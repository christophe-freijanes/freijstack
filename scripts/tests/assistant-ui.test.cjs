const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const publicDir = 'saas/portfolio/public';
const html = fs.readFileSync(publicDir + '/index.html', 'utf8');
const css = fs.readFileSync(publicDir + '/css/style.css', 'utf8');
const nginx = fs.readFileSync(publicDir + '/config/nginx.conf', 'utf8');
const assistantCode = fs.readFileSync(publicDir + '/js/assistant.js', 'utf8');

test('la bulle ne montre que IA et possède un nom accessible', () => {
    const button = html.match(/<button[^>]*id="assistantOpen"[^>]*>[\\s\\S]*?<\\/button>/);
    assert.ok(button, 'Bouton IA présent');
    assert.match(button[0], /aria-label="Ouvrir l'assistant IA"/);
    assert.match(button[0], />\\s*IA\\s*<\\/button>/);
    assert.doesNotMatch(button[0], /data-i18n/);
    assert.equal((html.match(/id="assistantOpen"/g) || []).length, 1);
    assert.match(html, /<dialog id="recruitmentAssistant"/);
});

test('scripts et CSS utilisent une version de cache cohérente', () => {
    for (const file of ['css/style.css', 'js/script.js', 'js/assistant.js']) {
        assert.ok(html.includes(file + '?v=20261021-bulle-ia'), file);
    }
    assert.match(nginx, /location ~\\* \\\\?\\.\\(js\\|css\\)\\$/);
    assert.match(nginx, /try_files \\$uri =404/);
    assert.doesNotMatch(nginx, /location ~\\* \\\\?\\.\\(js\\|css\\|svg/);
    assert.match(css, /\\.hamburger span \\{[^}]*\\}\\s*\\.footer-legal-sep/);
});

test('la bulle ouvre le dialogue après DOMContentLoaded et le referme', () => {
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
    const context = {
        document, localStorage: { getItem: () => 'fr' },
        fetch: async () => { throw new Error('Ne doit pas appeler le RAG'); },
        AbortController, setTimeout, clearTimeout
    };
    vm.runInNewContext(assistantCode, context);
    assert.equal(typeof initialized, 'function');
    initialized();
    nodes.get('assistantOpen').listeners.click();
    assert.equal(nodes.get('recruitmentAssistant').open, true);
    nodes.get('assistantClose').listeners.click();
    assert.equal(nodes.get('recruitmentAssistant').open, false);
});
