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

async function interact(fakeFetch, question, topic = null, lang = 'fr') {
    const ids = Object.fromEntries(
        ['recruitmentAssistant', 'assistantOpen', 'assistantClose',
            'assistantMessages', 'assistantForm', 'assistantInput']
            .map(id => [id, element()])
    );
    const chip = element();
    chip.dataset.assistantTopic = topic;
    chip.textContent = topic || '';
    const booking = element();
    booking.href = 'https://calendar.app.google/SfQR76G2NTX63CyLA';
    const document = {
        readyState: 'complete',
        getElementById(id) { return ids[id] || null; },
        querySelector(selector) { return selector === '.assistant-booking' ? booking : null; },
        createElement() { return element(); },
        querySelectorAll(selector) {
            return selector === '[data-assistant-topic]' && topic ? [chip] : [];
        }
    };
    const context = {
        document,
        localStorage: { getItem() { return lang; } },
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

test('une question non documentée donne un repli neutre sans inventer de non', async () => {
    const messages = await interact(async () => ({
        ok: false, status: 503,
        headers: { get() { return 'application/json'; } }
    }), 'Christophe a-t-il fondé une entreprise ?');
    assert.match(messages[1].textContent, /sources publiques du portfolio ne permettent pas/);
    assert.doesNotMatch(messages[1].textContent, /\b(?:Oui|Non),?\b/);
    assert.doesNotMatch(messages[1].textContent, /déclaré|déclaration/i);
});

test('une réponse affirmative sourcée du RAG reste intacte', async () => {
    const messages = await interact(async () => ({
        ok: true, status: 200,
        headers: { get() { return 'application/json'; } },
        json: async () => ({
            answer: 'Oui. Christophe utilise CloudFormation pour standardiser les environnements AWS.',
            sources: ['cv-public.txt']
        })
    }), 'Christophe utilise-t-il CloudFormation ?');
    assert.match(messages[1].textContent, /^Oui\. Christophe utilise CloudFormation/);
    assert.match(messages[1].children[0].textContent, /CV public/);
});

test('une demande de plusieurs créneaux ouvre le calendrier sans inventer des horaires', async () => {
    let apiCalled = false;
    const messages = await interact(async () => {
        apiCalled = true;
        throw new Error('Le RAG ne doit pas choisir les horaires');
    }, 'Pouvez-vous proposer deux ou trois créneaux pour un entretien ?');
    assert.equal(apiCalled, false);
    assert.match(messages[1].textContent, /calendrier de réservation/);
    assert.doesNotMatch(messages[1].textContent, /(?:10|14|16) h/);
    assert.equal(messages[1].children[0].href, 'https://calendar.app.google/SfQR76G2NTX63CyLA');
    assert.equal(messages[1].children[0].rel, 'noopener noreferrer');
});

test('une demande de contact permet la réservation immédiate', async () => {
    const messages = await interact(async () => {
        throw new Error('Pas d’appel nécessaire');
    }, 'Comment contacter Christophe pour un appel ?');
    assert.match(messages[1].children[0].textContent, /Voir les créneaux et réserver/);
});

test('le bouton rendez-vous est une action de réservation et non une réponse RAG', async () => {
    const messages = await interact(async () => {
        throw new Error('Pas d’appel nécessaire');
    }, '', 'booking');
    assert.equal(messages[0].textContent, 'booking');
    assert.match(messages[1].textContent, /horaire qui vous convient/);
});

test('la proposition de réservation existe en anglais', async () => {
    const messages = await interact(async () => {
        throw new Error('Pas d’appel nécessaire');
    }, 'Are there any available time slots to speak with Christophe?', null, 'en');
    assert.match(messages[1].textContent, /booking calendar/);
    assert.equal(messages[1].children[0].textContent, 'View appointment options');
});

test('une question sur les compétences reste transmise au RAG', async () => {
    let called = false;
    const messages = await interact(async (_url, options) => {
        called = true;
        assert.equal(JSON.parse(options.body).question, 'Christophe maîtrise-t-il AWS ?');
        return {
            ok: true, status: 200,
            headers: { get() { return 'application/json'; } },
            json: async () => ({ answer: 'Oui. Christophe travaille sur AWS.', sources: [] })
        };
    }, 'Christophe maîtrise-t-il AWS ?');
    assert.equal(called, true);
    assert.match(messages[1].textContent, /^Oui\./);
});
