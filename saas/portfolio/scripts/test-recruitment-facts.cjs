// Smoke tests du moteur factuel de recrutement.
const assert = require('node:assert/strict');
const facts = require('../public/data/recruitment-knowledge.json').fact_index;
const engine = require('../public/js/recruitment-facts.js');

const today = new Date('2026-10-17T16:00:00Z');
const cases = [
    ['Depuis combien de temps fais-tu du Terraform ?', 'duration', 'décembre 2021', 'fr'],
    ['Depuis quand fais-tu de l’Ansible ?', 'duration', 'octobre 2021', 'fr'],
    ['Depuis combien de temps pratiques-tu Bash ?', 'duration', 'août 2020', 'fr'],
    ['Combien de temps fais-tu du Python ?', 'duration', 'novembre 2020', 'fr'],
    ['Depuis combien de temps PowerShell ?', 'duration', 'août 2020', 'fr'],
    ['Où travailles-tu ?', 'where', 'La Caisse', 'fr'],
    ['Où es-tu basé ?', 'where', 'Montréal', 'fr'],
    ['Combien de comptes AWS ?', 'count', 'plusieurs centaines', 'fr'],
    ['Combien d’années d’expérience as-tu ?', 'duration', '20 ans', 'fr'],
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
    assert.ok(result.source.url.startsWith('https://'), question);
}

const followUp = engine.answer('Et Ansible ?', facts, 'fr', today, 'duration');
assert.ok(followUp && followUp.text.includes('octobre 2021'));
assert.equal(engine.answer('Pourquoi ce choix d’architecture ?', facts, 'fr', today), null);
console.log('Questions factuelles : ' + (cases.length + 2) + ' scénarios validés.');
