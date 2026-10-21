const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const dir = 'saas/portfolio/public';
const html = fs.readFileSync(dir + '/index.html', 'utf8');
const css = fs.readFileSync(dir + '/css/style.css', 'utf8');
const nginx = fs.readFileSync(dir + '/config/nginx.conf', 'utf8');
const assistant = fs.readFileSync(dir + '/js/assistant.js', 'utf8');

test('la bulle affiche uniquement IA avec un nom accessible', () => {
    const start = html.indexOf('id="assistantOpen"');
    const end = html.indexOf('</button>', start);
    assert.ok(start >= 0 && end > start, 'Bouton IA présent');
    const button = html.slice(start, end + 9);
    assert.match(button, /aria-label="Ouvrir l'assistant IA"/);
    assert.match(button, />\s*IA\s*<\/button>/);
    assert.doesNotMatch(button, /data-i18n/);
    assert.equal(html.split('id="assistantOpen"').length - 1, 1);
    assert.ok(html.includes('<dialog id="recruitmentAssistant"'));
});

test('les ressources statiques évitent le cache immutable', () => {
    for (const asset of ['css/style.css', 'js/script.js', 'js/assistant.js']) {
        assert.ok(html.includes(asset + '?v=20261021-bulle-ia'), asset);
    }
    assert.ok(nginx.includes('location ~* \\.(js|css)$'));
    assert.ok(nginx.includes('try_files $uri =404;'));
    assert.ok(!nginx.includes('(js|css|svg|png'));
    assert.ok(css.includes('transition: all var(--transition-fast);\n}\n\n.footer-legal-sep'));
});

test('un clic après DOMContentLoaded ouvre le chat et la fermeture fonctionne', () => {
    const nodes = new Map();
    const make = () => ({
        listeners: {}, children: [], value: '', textContent: '',
        addEventListener(type, cb) { this.listeners[type] = cb; },
        appendChild(child) { this.children.push(child); },
        querySelector() { return { disabled: false }; },
        focus() {}, reset() {}, showModal() { this.open = true; },
        close() { this.open = false; }
    });
    for (const id of ['recruitmentAssistant', 'assistantOpen', 'assistantClose',
        'assistantMessages', 'assistantForm', 'assistantInput']) nodes.set(id, make());
    let initialized;
    const document = {
        readyState: 'loading',
        addEventListener(type, cb) {
            if (type === 'DOMContentLoaded') initialized = cb;
        },
        getElementById(id) { return nodes.get(id); },
        querySelectorAll() { return []; },
        querySelector() { return null; },
        createElement: make
    };
    vm.runInNewContext(assistant, {
        document, localStorage: { getItem: () => 'fr' },
        fetch: async () => { throw new Error('No API call expected'); },
        AbortController, setTimeout, clearTimeout
    });
    assert.equal(typeof initialized, 'function');
    initialized();
    nodes.get('assistantOpen').listeners.click();
    assert.equal(nodes.get('recruitmentAssistant').open, true);
    nodes.get('assistantClose').listeners.click();
    assert.equal(nodes.get('recruitmentAssistant').open, false);
});
