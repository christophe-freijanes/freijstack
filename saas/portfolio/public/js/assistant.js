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
            unknown: 'Je peux répondre à partir du portfolio sur le parcours, les compétences et les projets. Vous pouvez aussi réserver un échange avec le bouton Google Calendar.'
        },
        en: {
            experience: 'The portfolio shows over 20 years of experience in Cloud and Security. Since June 2026, Christophe has been Principal Specialist – AWS Platform / Technical Lead at La Caisse (CDPQ). His background also includes ACENSI, SQUAD, ECONOCOM (ITER project), DIGIMIND and HARDIS.',
            skills: 'Listed skills include AWS, GCP, Kubernetes, Terraform, AWS CDK, CloudFormation, Ansible, Python, Bash/PowerShell, DevSecOps, SRE, FinOps, CloudWatch Logs, Datadog, LLMs, MCP and Amazon Bedrock.',
            projects: 'The portfolio features DevOps & CI/CD Training, ansible-webapp, student-list, freijstack, Docker Applications and Infrastructure as Code. Links are in the Projects section.',
            booking: 'You can book a conversation using the Google Calendar button below.',
            unknown: 'I can answer questions based on the portfolio about experience, skills and projects. You can also book a conversation using the Google Calendar button.'
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
        button.addEventListener('click', function() {
            const topic = button.dataset.assistantTopic;
            addMessage(button.textContent.trim(), true);
            addMessage(responses[language()][topic], false);
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
                body: JSON.stringify({ message: question }),
                cache: 'no-store',
                signal: controller.signal
            });
            const contentType = result.headers.get('content-type') || '';
            if (!result.ok || !contentType.includes('application/json')) {
                if (result.status === 404 || !contentType.includes('application/json')) apiUnavailable = true;
                return null;
            }
            const data = await result.json();
            return typeof data.answer === 'string' && data.answer.trim()
                ? data.answer.trim().slice(0, 1800)
                : null;
        } catch {
            return null;
        } finally {
            clearTimeout(timeout);
        }
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const question = input.value.trim();
        if (!question || sending) return;
        sending = true;
        const button = form.querySelector('button[type="submit"]');
        if (button) button.disabled = true;
        addMessage(question, true);
        const pending = addMessage(language() === 'en' ? 'Checking the public profile…' : 'Recherche dans le profil public…', false);
        form.reset();
        try {
            const answer = await queryApi(question);
            pending.textContent = answer || (language() === 'en' ? 'Offline mode: ' : 'Mode secours : ') + answerQuestion(question);
        } finally {
            sending = false;
            if (button) button.disabled = false;
            input.focus();
        }
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
