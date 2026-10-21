const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const code = fs.readFileSync('saas/portfolio/public/js/assistant.js', 'utf8');

function element() {
    return {
        children: [],
        listeners: {},
        dataset: {},
        textContent: '',
        value: '',
        disabled: false,
        open: false,
        addEventListener(name, handler) { this.listeners[name] = handler; },
        appendChild(child) { this.children.push(child); },
        focus() {},
        reset() { this.value = ''; },
        showModal() { this.open = true; },
        close() { this.open = false; },
        querySelector() { return this.button; }
    };
}

async function interact(fakeFetch, question, topic = null) {
    const ids = Object.fromEntries(
        ['recruitmentAssistant', 'assistantOpen', 'assistantClose',
            'assistantMessages', 'assistantForm', 'assistantInput']
            .map(id => [id, element()])
    );
    const chip = element();
    chip.dataset.assistantTopic = topic;
    chip.textContent = topic || '';
    const document = {
        readyState: 'complete',
        getElementById(id) { return ids[id] || null; },
        createElement() { return element(); },
        querySelectorAll(selector) {
            return selector === '[data-assistant-topic]' && topic ? [chip] : [];
        }
    };
    const context = {
        document,
        localStorage: { getItem() { return 'fr'; } },
        fetch: fakeFetch,
        AbortController,
        setTimeout,
        clearTimeout
    };
    vm.runInNewContext(code, context);
    ids.assistantOpen.listeners.click();
    assert.equal(ids.recruitmentAssistant.open, true);
    if (topic) {
        await chip.listeners.click();
    } else {
        ids.assistantInput.value = question;
        await ids.assistantForm.listeners.submit({ preventDefault() {} });
    }
    return ids.assistantMessages.children;
}

test('une réponse JSON /api/chat remplace le secours local', async () => {
    let called = false;
    const messages = await interact(async (url, options) => {
        called = true;
        assert.equal(url, '/api/chat');
        assert.deepEqual(Object.keys(JSON.parse(options.body)), ['question']);
        assert.equal(JSON.parse(options.body).question, 'Quel est son parcours ?');
        return {
            ok: true,
            status: 200,
            headers: { get() { return 'application/json'; } },
            json: async () => ({ answer: 'Christophe travaille sur AWS.', sources: ['cv-public.txt', 'recruiter-knowledge-rag.txt'] })
        };
    }, 'Quel est son parcours ?');
    assert.ok(called);
    assert.equal(messages[1].textContent, 'Christophe travaille sur AWS.');
    assert.match(messages[1].children[0].textContent, /CV public/);
    assert.match(messages[1].children[0].textContent, /Connaissances publiques/);
});

test('la route absente revient aux réponses prédéfinies', async () => {
    const messages = await interact(async () => ({
        ok: true,
        status: 200,
        headers: { get() { return 'text/html'; } }
    }), 'Quel est son parcours ?');
    assert.match(messages[1].textContent, /^Mode secours :/);
    assert.match(messages[1].textContent, /20 ans/);
});

test('une erreur réseau ne bloque pas la conversation', async () => {
    const messages = await interact(async () => { throw new Error('Network unavailable'); }, 'AWS');
    assert.match(messages[1].textContent, /^Mode secours :/);
    assert.match(messages[1].textContent, /AWS/);
});

test('les boutons thématiques interrogent le backend RAG', async () => {
    let question;
    const messages = await interact(async (_url, options) => {
        question = JSON.parse(options.body).question;
        return {
            ok: true, status: 200,
            headers: { get() { return 'application/json; charset=utf-8'; } },
            json: async () => ({ answer: 'Christophe utilise AWS et CloudFormation.', sources: [] })
        };
    }, '', 'skills');
    assert.match(question, /compétences techniques de Christophe/);
    assert.equal(messages[1].textContent, 'Christophe utilise AWS et CloudFormation.');
});

test('une réponse à la première personne utilise le secours identifié', async () => {
    const messages = await interact(async () => ({
        ok: true, status: 200,
        headers: { get() { return 'application/json'; } },
        json: async () => ({ answer: "J'ai travaillé sur AWS.", sources: [] })
    }), 'AWS');
    assert.match(messages[1].textContent, /^Mode secours :/);
    assert.doesNotMatch(messages[1].textContent, /\bj['’]|\bje\b/i);
});
