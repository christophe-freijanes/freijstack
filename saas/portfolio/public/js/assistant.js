/* Assistant de recrutement : API publique contrôlée et réponses locales de secours. */
function initializeAssistant() {
    const dialog = document.getElementById('recruitmentAssistant');
    const openButton = document.getElementById('assistantOpen');
    const closeButton = document.getElementById('assistantClose');
    const messages = document.getElementById('assistantMessages');
    const form = document.getElementById('assistantForm');
    const input = document.getElementById('assistantInput');

    if (!dialog || !openButton || !closeButton || !messages || !form || !input) return;

    const responses = {
        fr: {
            experience: 'Le portfolio présente plus de 20 ans d’expérience en Cloud et sécurité. Depuis juin 2026, Christophe est Spécialiste principal – Plateforme AWS / Référent technique chez La Caisse (CDPQ). Son parcours inclut notamment ACENSI, SQUAD, ECONOCOM (projet ITER), DIGIMIND et HARDIS.',
            skills: 'Les compétences affichées comprennent AWS, GCP, Kubernetes, Terraform, AWS CDK, CloudFormation, Ansible, Python, Bash/PowerShell, DevSecOps, SRE, FinOps, CloudWatch Logs, Datadog, LLM, MCP et Amazon Bedrock.',
            projects: 'Le portfolio présente notamment Formation DevOps & CI/CD, ansible-webapp, student-list, freijstack, Docker Applications et Infrastructure as Code. Les liens sont dans la section Projets.',
            booking: 'Vous pouvez réserver un échange avec le bouton Google Calendar ci-dessous.',
            unknown: 'Cet assistant présente les informations publiques du portfolio de Christophe Freijanes. Un rendez-vous peut également être réservé via le calendrier.'
        },
        en: {
            experience: 'The portfolio shows over 20 years of experience in Cloud and Security. Since June 2026, Christophe has been Principal Specialist – AWS Platform / Technical Lead at La Caisse (CDPQ). His background also includes ACENSI, SQUAD, ECONOCOM (ITER project), DIGIMIND and HARDIS.',
            skills: 'Listed skills include AWS, GCP, Kubernetes, Terraform, AWS CDK, CloudFormation, Ansible, Python, Bash/PowerShell, DevSecOps, SRE, FinOps, CloudWatch Logs, Datadog, LLMs, MCP and Amazon Bedrock.',
            projects: 'The portfolio features DevOps & CI/CD Training, ansible-webapp, student-list, freijstack, Docker Applications and Infrastructure as Code. Links are in the Projects section.',
            booking: 'You can book a conversation using the Google Calendar button below.',
            unknown: 'This assistant presents Christophe Freijanes’s public portfolio information. A meeting can also be booked using the calendar.'
        }
    };

    const topics = {
        fr: {
            experience: 'Quel est le parcours professionnel de Christophe Freijanes ?',
            skills: 'Quelles sont les compétences techniques de Christophe Freijanes ?',
            projects: 'Quels projets techniques présente le portfolio de Christophe Freijanes ?'
        },
        en: {
            experience: 'What is Christophe Freijanes’s professional background?',
            skills: 'What are Christophe Freijanes’s technical skills?',
            projects: 'Which projects appear in Christophe Freijanes’s portfolio?'
        }
    };

    const language = () => {
        try {
            return localStorage.getItem('preferredLanguage') === 'en' ? 'en' : 'fr';
        } catch {
            return 'fr';
        }
    };
    const normalize = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    function addMessage(text, isUser) {
        const message = document.createElement('p');
        message.className = `assistant-message ${isUser ? 'assistant-user' : 'assistant-reply'}`;
        message.textContent = text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
        return message;
    }

    function answerQuestion(question) {
        const text = normalize(question);
        const copy = responses[language()];

        if (/(book|booking|calendar|schedule|meeting|interview|rdv|rendez|reservation|reserve)/.test(text)) return copy.booking;
        if (/(experience|parcours|career|background|caisse|cdpq|acensi|squad|econom|digimind|hardis|years|annee)/.test(text)) return copy.experience;
        if (/(skill|competence|technical|technologie|aws|gcp|kubernetes|terraform|cloudformation|cdk|sre|finops|bedrock|mcp|datadog|cloudwatch|ansible|druva|devsecops)/.test(text)) return copy.skills;
        if (/(project|projet|portfolio|ansible-webapp|student-list|freijstack|docker|formation|infrastructure as code)/.test(text)) return copy.projects;
        return copy.unknown;
    }

    openButton.addEventListener('click', function() {
        dialog.showModal();
        input.focus();
    });

    closeButton.addEventListener('click', function() {
        dialog.close();
    });

    dialog.addEventListener('close', function() {
        openButton.focus();
    });

    dialog.addEventListener('click', function(event) {
        if (event.target === dialog) dialog.close();
    });

    document.querySelectorAll('[data-assistant-topic]').forEach(function(button) {
        button.addEventListener('click', async function() {
            const question = topics[language()][button.dataset.assistantTopic];
            if (question) await sendQuestion(question, button.textContent.trim());
        });
    });

    let apiUnavailable = false;
    let sending = false;
    async function queryApi(question) {
        if (apiUnavailable) return null;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7000);
        try {
            const result = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ question }),
                cache: 'no-store',
                signal: controller.signal
            });
            const contentType = result.headers.get('content-type') || '';
            if (!result.ok || !contentType.includes('application/json')) {
                if (result.status === 404 || !contentType.includes('application/json')) apiUnavailable = true;
                return null;
            }
            const data = await result.json();
            if (typeof data.answer !== 'string') return null;
            const answer = data.answer.trim().slice(0, 1800);
            // Un assistant n'usurpe jamais la voix de Christophe.
            if (!answer || /(?:^|[\s(«"“])(?:je\b|j['’]|moi\b|mon\b|ma\b|mes\b|i\b|i['’]|my\b|mine\b)/i.test(answer)) {
                return null;
            }
            const sources = Array.isArray(data.sources) ? data.sources : [];
            const labels = {
                'cv-public.txt': language() === 'en' ? 'Public CV' : 'CV public',
                'recruiter-knowledge-rag.txt': language() === 'en'
                    ? 'Public portfolio knowledge' : 'Connaissances publiques du portfolio'
            };
            return {
                answer,
                sources: [...new Set(sources.filter(source => Object.hasOwn(labels, source)).map(source => labels[source]))]
            };
        } catch {
            return null;
        } finally {
            clearTimeout(timeout);
        }
    }

    async function sendQuestion(question, label = question) {
        if (!question || sending) return;
        sending = true;
        const button = form.querySelector('button[type="submit"]');
        if (button) button.disabled = true;
        addMessage(label, true);
        const pending = addMessage(language() === 'en'
            ? 'Searching public sources…' : 'Recherche dans les sources publiques…', false);
        try {
            const reply = await queryApi(question);
            if (reply) {
                pending.textContent = reply.answer;
                if (reply.sources.length) {
                    const sources = document.createElement('small');
                    sources.className = 'assistant-sources';
                    sources.textContent = (language() === 'en' ? 'Sources: ' : 'Sources : ')
                        + reply.sources.join(' · ');
                    pending.appendChild(sources);
                }
            } else {
                pending.textContent = (language() === 'en' ? 'Offline mode: ' : 'Mode secours : ')
                    + answerQuestion(question);
            }
        } finally {
            sending = false;
            if (button) button.disabled = false;
            input.focus();
        }
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const question = input.value.trim();
        if (!question || sending) return;
        form.reset();
        await sendQuestion(question);
    });

    function updatePlaceholder() {
        input.placeholder = language() === 'en'
            ? 'Ask about my experience, skills or projects…'
            : 'Posez une question sur mon parcours, mes compétences ou mes projets…';
    }

    document.querySelectorAll('.lang-btn').forEach(function(button) {
        button.addEventListener('click', updatePlaceholder);
    });
    updatePlaceholder();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAssistant);
} else {
    initializeAssistant();
}
