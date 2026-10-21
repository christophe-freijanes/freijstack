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

async function interact(fakeFetch, question) {
    const ids = Object.fromEntries(
        ['recruitmentAssistant', 'assistantOpen', 'assistantClose',
            'assistantMessages', 'assistantForm', 'assistantInput']
            .map(id => [id, element()])
    );
    const document = {
        readyState: 'complete',
        getElementById(id) { return ids[id] || null; },
        createElement() { return element(); },
        querySelectorAll() { return []; }
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
    ids.assistantInput.value = question;
    await ids.assistantForm.listeners.submit({ preventDefault() {} });
    return ids.assistantMessages.children;
}

test('une réponse JSON /api/chat remplace le secours local', async () => {
    let called = false;
    const messages = await interact(async (url, options) => {
        called = true;
        assert.equal(url, '/api/chat');
        assert.equal(JSON.parse(options.body).message, 'Quel est son parcours ?');
        return {
            ok: true,
            status: 200,
            headers: { get() { return 'application/json'; } },
            json: async () => ({ answer: 'Réponse publique vérifiée' })
        };
    }, 'Quel est son parcours ?');
    assert.ok(called);
    assert.equal(messages[1].textContent, 'Réponse publique vérifiée');
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
