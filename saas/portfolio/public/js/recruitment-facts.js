// Réponses factuelles de recrutement.
// Reconnait l'intention, puis utilise uniquement les faits sourcés.
(function (root) {
    'use strict';

    // 1. Correspondance des questions
    function normalize(text) {
        return String(text).toLowerCase().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    }

    function includesPhrase(question, phrase) {
        return (' ' + question + ' ').includes(' ' + normalize(phrase) + ' ');
    }

    function detectIntent(question, previousIntent) {
        const q = normalize(question);
        if (/\b(entreprise|societe|business|company|boite)\b/.test(q) && /\b(deja|eu|cree|creer|fonde|fondee|possede|own|owned|founded|run)\b/.test(q)) return 'ownership';
        if (/\b(depuis|how long|since when|how many years|years of experience|combien (?:d |de )?(?:annees?|ans?|temps))\b/.test(q)) return 'duration';
        if (/\b(ou|where|based|dans quelle entreprise|chez qui)\b/.test(q)) return 'where';
        if (/\b(combien|how many|how much|number of)\b/.test(q)) return 'count';
        if (/\b(quand|when|quelle annee|which year)\b/.test(q)) return 'when';
        if (/\b(quel|quelle|quels|quelles|lequel|laquelle|lesquels|lesquelles|which|what)\b/.test(q)) return 'which';
        if (/^(et|and|what about|et pour|qu en est il)\b/.test(q)) return previousIntent;
        return null;
    }

    // 2. Dates attestées dans les dépôts GitHub
    function elapsed(date, now, lang) {
        const first = new Date(date + 'T00:00:00Z');
        let months = (now.getUTCFullYear() - first.getUTCFullYear()) * 12
            + now.getUTCMonth() - first.getUTCMonth();
        if (now.getUTCDate() < first.getUTCDate()) months -= 1;
        months = Math.max(0, months);
        const years = Math.floor(months / 12);
        const extra = months % 12;
        if (lang === 'en') return years + ' years' + (extra ? ' and ' + extra + ' months' : '');
        return years + ' an' + (years > 1 ? 's' : '') + (extra ? ' et ' + extra + ' mois' : '');
    }

    function history(skill, lang, now) {
        const month = new Intl.DateTimeFormat(lang === 'en' ? 'en-CA' : 'fr-CA',
            { month: 'long', year: 'numeric', timeZone: 'UTC' })
            .format(new Date(skill.first_evidence + 'T00:00:00Z'));
        const period = elapsed(skill.first_evidence, now, lang);
        if (lang === 'en') {
            return 'My earliest publicly accessible ' + skill.label + ' examples on GitHub date to '
                + month + ' (about ' + period + ' ago). ' + skill.professional.en;
        }
        return 'Mes premiers exemples ' + skill.label + ' accessibles publiquement sur GitHub datent de '
            + month + ' (il y a environ ' + period + '). ' + skill.professional.fr;
    }

    function match(entry, question) {
        return entry.aliases.some(alias => includesPhrase(question, alias));
    }

    // 3. Réponse : type de question, sujet, puis source
    function answer(question, facts, lang, now, previousIntent) {
        if (!facts) return null;
        const q = normalize(question);
        const intent = detectIntent(q, previousIntent);
        if (!intent) return null;

        const language = lang === 'en' ? 'en' : 'fr';
        const today = now || new Date();
        const skills = (facts.skills || []).filter(skill => match(skill, q));
        if (skills.length && (intent === 'duration' || intent === 'when')) {
            return {
                text: skills.map(skill => history(skill, language, today)).join('\n\n'),
                source: skills[0].source,
                intent
            };
        }
        if (skills.length && intent === 'where') {
            return {
                text: skills.map(skill => skill.professional[language]).join('\n\n'),
                source: {
                    label: 'CV 2026',
                    url: 'https://portfolio.freijstack.com/cv/CV-Christophe-FREIJANES.pdf'
                },
                intent
            };
        }

        const entries = (facts.answers || []).filter(entry =>
            match(entry, q) && (entry[intent] || (intent === 'duration' && entry.since)));
        const specific = entries.filter(entry => entry.id === 'aws_experience' && includesPhrase(q, 'aws'));
        const ranked = specific.length ? specific : entries;
        const result = ranked.sort((a, b) =>
            Math.max(...b.aliases.filter(alias => includesPhrase(q, alias)).map(a => a.length))
            - Math.max(...a.aliases.filter(alias => includesPhrase(q, alias)).map(a => a.length)))[0];
        if (!result) return null;
        return { text: (result[intent] || result.since)[language], source: result.source, intent };
    }

    const engine = { answer, detectIntent };
    root.RecruitmentFacts = engine;
    if (typeof module !== 'undefined' && module.exports) module.exports = engine;
})(typeof window !== 'undefined' ? window : {});
