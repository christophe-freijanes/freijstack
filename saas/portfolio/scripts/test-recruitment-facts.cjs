// Smoke tests du moteur factuel de recrutement.
const assert = require('node:assert/strict');
const facts = require('../public/data/recruitment-knowledge.json').fact_index;
const engine = require('../public/js/recruitment-facts.js');

const today = new Date('2026-10-17T16:00:00Z');
const cases = [
    ['Depuis combien de temps fais-tu du Terraform ?', 'duration', 'décembre 2021', 'fr'],
    ['Depuis quand fais-tu de l’Ansible ?', 'duration', 'octobre 2021', 'fr'],
    ['Depuis combien de temps pratiques-tu Bash ?', 'duration', 'octobre 2021', 'fr'],
    ['Combien de temps fais-tu du Python ?', 'duration', 'novembre 2021', 'fr'],
    ["Depuis combien de temps fais-tu du python ?", 'duration', 'novembre 2021', 'fr'],
    ["Depuis combien de temps fait tu du AWS", 'duration', 'environ dix ans', 'fr'],
    ["Combien d'années d'expérience AWS as-tu ?", 'duration', 'environ dix ans', 'fr'],
    ["As-tu deja eu une entreprise ?", 'ownership', 'ne précise pas', 'fr'],
    ["Depuis combien de temps fais tu du Python ?", 'duration', 'novembre 2021', 'fr'],
    ["Depuis combien d'années pratiques-tu Python ?", 'duration', 'novembre 2021', 'fr'],

    ['Depuis combien de temps PowerShell ?', 'duration', 'octobre 2021', 'fr'],
    ['Où travailles-tu ?', 'where', 'La Caisse', 'fr'],
    ['Où es-tu basé ?', 'where', 'Montréal', 'fr'],
    ['Combien de comptes AWS ?', 'count', 'plusieurs centaines', 'fr'],
    ['Combien d’années d’expérience as-tu ?', 'duration', '20 ans', 'fr'],
    ["Combien d' année as-tu d' experiences ?", 'duration', '20 ans', 'fr'],
    ["Combien d'années as-tu d'expérience ?", 'duration', '20 ans', 'fr'],
    ["Combien d'années d'expérience ?", 'duration', '20 ans', 'fr'],
    ["Depuis combien d'années travailles-tu dans l'informatique ?", 'duration', '20 ans', 'fr'],
    ['How many years of experience do you have?', 'duration', '20 years', 'en'],
    ["Combien d'années de Terraform ?", 'duration', 'décembre 2021', 'fr'],
    ['Quelles certifications as-tu ?', 'which', 'CompTIA Security+', 'fr'],
    ['Quels outils utilises-tu ?', 'which', 'Terraform', 'fr'],
    ['Depuis quand es-tu chez La Caisse ?', 'duration', 'juin 2026', 'fr'],
    ['Où as-tu utilisé Terraform ?', 'where', 'ACENSI', 'fr'],
    ['How long have you worked with Terraform?', 'duration', 'December 2021', 'en'],
    ['Where are you based?', 'where', 'Montréal', 'en'],
    ['How many AWS accounts?', 'count', 'several hundred', 'en'],
    ['Which certifications do you have?', 'which', 'KCNA', 'en']
];

for (const [question, intent, expected, lang] of cases) {
    const result = engine.answer(question, facts, lang, today);
    assert.ok(result, 'Réponse absente : ' + question);
    assert.equal(result.intent, intent, question);
    assert.ok(result.text.includes(expected), question + ': ' + result.text);
    assert.ok(result.source && (!result.source.url || result.source.url.startsWith('https://')), question);
}

// Ne publier que des preuves accessibles aux recruteurs.
for (const skill of facts.skills) {
    assert.match(skill.source.url, /^https:\/\/github\.com\/christophe-freijanes\/(formation|student-list)\/commit\//);
}

const followUp = engine.answer('Et Ansible ?', facts, 'fr', today, 'duration');
assert.ok(followUp && followUp.text.includes('octobre 2021'));
assert.equal(engine.answer('Pourquoi ce choix d’architecture ?', facts, 'fr', today), null);
assert.equal(engine.answer('Combien de postes as-tu occupés ?', facts, 'fr', today), null);
assert.equal(engine.detectIntent("Combien d' année as-tu d' experiences ?"), 'duration');
// Test du mauvais routage signalé : jamais la statistique ACENSI pour Python.
// Le navigateur doit contacter l'API avant son moteur factuel local.
const { readFileSync } = require('node:fs');
const browser = readFileSync(require('node:path').join(__dirname, '../public/js/script.js'), 'utf8');
assert.ok(browser.indexOf('const remote = await askNvidia(question, lang)') < browser.indexOf('const verified = engine && facts'));

const python = engine.answer('Depuis combien de temps fais-tu du python ?', facts, 'fr', today);
assert.ok(python && python.text.includes('novembre 2021'));
assert.ok(!python.text.includes('60 %') && !python.text.includes('Ansible'));

console.log('Questions factuelles : ' + (cases.length + 2) + ' scénarios validés.');
