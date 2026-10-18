// ============================================
// SMOOTH SCROLLING & NAVIGATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    // Bouton retour en haut
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        backToTopBtn.addEventListener('click', function() {
            backToTopBtn.classList.add('rotate');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(function() {
                backToTopBtn.classList.remove('rotate');
            }, 500);
        });
    }

    // Init gestion cookies depuis le footer
    initManageCookiesButton();
        // Fonction pour ouvrir la modal cookies depuis le footer
        function initManageCookiesButton() {
            const btn = document.getElementById('manageCookiesBtn');
            if (!btn) return;
            btn.addEventListener('click', () => {
                // 1) si tu as une fonction dédiée
                if (typeof window.openCookiePreferences === 'function') {
                    window.openCookiePreferences();
                    return;
                }
                // 2) fallback : ouvre la modal si elle existe
                const modal = document.getElementById('cookiePreferencesModal');
                if (modal) {
                    modal.classList.add('is-open');
                    modal.setAttribute('aria-hidden', 'false');
                    document.body.classList.add('modal-open');
                } else {
                    console.warn('Cookie preferences modal not found.');
                }
            });
        }
        // Easter egg : clic sur le logo du footer
        const footerEgg = document.getElementById('footerEgg');
        if (footerEgg) {
            footerEgg.addEventListener('click', function(e) {
                window.location.href = 'pages/hidden.html';
            });
            footerEgg.title = '??';
        }
        // Easter egg : clic sur le bouton rouge de la fenêtre code-header
        const hiddenEgg = document.getElementById('hiddenEgg');
        if (hiddenEgg) {
            hiddenEgg.addEventListener('click', function(e) {
                window.location.href = 'pages/hidden.html';
            });
            hiddenEgg.title = 'Red button';
        }
    // Détection et application automatique du thème saisonnier
    function applySeasonalTheme() {
        const month = new Date().getMonth() + 1; // 1 = janvier, 12 = décembre
        let seasonClass = '';
        let faviconFile = 'favicon.svg';
        
        if (month >= 12 || month <= 2) {
            seasonClass = 'season-winter'; // Hiver: décembre, janvier, février
            faviconFile = 'favicon-winter.svg';
        } else if (month >= 3 && month <= 5) {
            seasonClass = 'season-spring'; // Printemps: mars, avril, mai
            faviconFile = 'favicon-spring.svg';
        } else if (month >= 6 && month <= 8) {
            seasonClass = 'season-summer'; // Été: juin, juillet, août
            faviconFile = 'favicon-summer.svg';
        } else if (month >= 9 && month <= 11) {
            seasonClass = 'season-autumn'; // Automne: septembre, octobre, novembre
            faviconFile = 'favicon-autumn.svg';
        }
        // Retirer toutes les classes de palette et appliquer la saison
        document.body.classList.remove('palette-neutral', 'season-winter', 'season-spring', 'season-summer', 'season-autumn');
        document.body.classList.add(seasonClass);
        // Mettre à jour le favicon
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.setAttribute('href', 'images/' + faviconFile);
        }
    }
    
    // Appliquer le thème au chargement
    applySeasonalTheme();

    // ============================================
    // SYSTÈME DE TRADUCTION (i18n)
    // ============================================
    const translations = {
        fr: {
            // Navigation
            'nav.home': 'Accueil',
            'nav.skills': 'Compétences',
            'nav.projects': 'Projets',
            'nav.experience': 'Expérience',
            'nav.contact': 'Contact',
            // Hero
            'hero.greeting': '👋 Bienvenue sur mon portfolio',
            'hero.title': 'Christophe FREIJANES',
            'hero.role': 'Spécialiste senior Cloud & Sécurité - DevSecOps',
            'hero.tagline': 'Sécurité infonuagique • DevSecOps • Infrastructure as Code • Automatisation',
            'hero.btn.projects': 'Voir mes projets',
            'hero.btn.contact': 'Me contacter',
            // Hero code block
            'hero.code.role': 'Spécialiste Cloud & Sécurité • 20+ ans d\'expérience • Montréal (QC, Canada)',
            'hero.code.expertise': '• AWS (IAM, EC2, S3, CloudWatch) • GCP • Kubernetes\n• AWS CDK • CloudFormation • Terraform • Ansible (AWX/AAP)\n• Docker / Podman • Helm • GitHub Actions • GitLab CI • Jenkins\n• LLM • MCP • Amazon Bedrock • Agents & tools • Skills • Hooks\n• Strands Agents SDK • Frameworks d’agents\n• CloudWatch Logs • Datadog • Grafana • Prometheus • Nagios • Centreon\n• Commvault • Clumio • Cohesity • Druva • Veeam',
            'hero.code.motto': 'Security-by-design • IA • Automation-first',
            // Compétences
            'skills.title': 'Compétences Techniques',
            'skills.subtitle': 'Technologies et outils maîtrisés',
            'skills.cloud': 'Cloud & Sécurité',
            'skills.devsecops': 'DevSecOps & CI/CD',
            'skills.backup': 'Sauvegarde & DRP',
            'skills.automation': 'IaC & Automatisation',
            'skills.monitoring': 'Monitoring & Observabilité',
            'skills.ai': 'IA & Agents',
            'skills.os': 'Systèmes d\'Exploitation',
            'skills.virtualization': 'Virtualisation & Infrastructure',
            'skills.storage': 'Stockage & Données',
            'skills.methodologies': 'Méthodologies',
            // Projets
            'projects.title': 'Projets Récents',
            'projects.subtitle': 'Réalisations et contributions',
            // Project details
            'project.formation.title': 'Formation DevOps & CI/CD',
            'project.formation.desc': 'Dépôt utilisé pour mes formations DevOps couvrant l\'automatisation, l\'intégration continue et le déploiement continu.',
            'project.formation.link': 'Voir sur GitHub',
            'project.ansible.title': 'ansible-webapp',
            'project.ansible.desc': 'Playbooks Ansible pour le déploiement et la configuration automatisée d\'applications web avec rôles modulaires.',
            'project.ansible.link': 'Voir sur GitHub',
            'project.student.title': 'student-list',
            'project.student.desc': 'Application fullstack démontrant l\'interaction entre une API backend et une webapp frontend pour la gestion d\'étudiants.',
            'project.student.link': 'Voir sur GitHub',
            'project.freijstack.title': 'freijstack',
            'project.freijstack.desc': 'Stack personnalisée regroupant mes outils et configurations préférés pour les projets DevSecOps et infrastructure.',
            'project.freijstack.link': 'Voir sur GitHub',
            'project.docker.title': 'Docker Applications',
            'project.docker.desc': 'Collection d\'images Docker et configurations pour déployer rapidement des applications en environnements conteneurisés.',
            'project.docker.link': 'Private Registry',
            'project.iac.title': 'Infrastructure as Code',
            'project.iac.desc': 'Automatisation de l’infrastructure, du monitoring et des sauvegardes, orchestrée par mes workflows GitHub Actions sécurisés.',
            'project.iac.link': 'Voir les Workflows',
            // Expérience
            'experience.title': 'Parcours Professionnel',
            'experience.subtitle': 'Mon expérience et mes réalisations',
            // Accréditations
            'accreditations.title': 'Accréditations',
            'accreditations.subtitle': 'Formations et certifications récentes',
            // Contact
            'contact.title': 'Parlons Ensemble',
            'contact.subtitle': 'Vous avez un projet ? Contactez-moi',
            'assistant.open': 'IA',
            'assistant.eyebrow': 'ÉCHANGE RECRUTEMENT',
            'assistant.title': 'Assistant recrutement',
            'assistant.close': 'Fermer',
            'assistant.notice': 'Assistant virtuel : réponses inspirées de mon parcours et de mon style.',
            'assistant.greeting': 'Bonjour ! Ravi de vous accueillir. Une question sur mon parcours, AWS ou le travail en équipe ?',
            'assistant.questions.title': 'Questions fréquentes',
            'assistant.question.experience': 'Mon parcours',
            'assistant.question.aws': 'AWS',
            'assistant.question.sre': 'SRE',
            'assistant.question.aiops': 'IA agentique',
            'assistant.question.impact': 'Réalisations',
            'assistant.question.certs': 'Certifications',
            'assistant.question.langs': 'Langues',
            'assistant.question.teamwork': 'Travail en équipe',
            'assistant.question.skills': 'Mes compétences',
            'assistant.question.projects': 'Mes projets',
            'assistant.input.label': 'Votre question',
            'assistant.send': 'Envoyer',
            'assistant.booking': 'Réserver un échange',
            // Footer
            'footer.home': 'Accueil',
            'footer.projects': 'Projets',
            'footer.rights': 'Tous droits réservés.',
            // Experience details - La Caisse (CDPQ)
            'exp.caisse.title': 'Spécialiste principal – Plateforme AWS / Référent technique | La Caisse (CDPQ)',
            'exp.caisse.period': 'Juin 2026 – Aujourd’hui · Montréal, Québec',
            'exp.caisse.item1': 'Exploitation, fiabilisation et évolution d’une plateforme AWS multi-comptes dans un environnement financier critique et réglementé.',
            'exp.caisse.item2': 'Automatisation et standardisation des opérations avec CloudFormation, Systems Manager et Python/Bash/PowerShell ; contribution aux workflows Azure DevOps et approche SRE axée sur la fiabilité de la plateforme.',
            'exp.caisse.item3': 'Amélioration de l’observabilité avec Datadog et CloudWatch : tableaux de bord, ajustement des alertes et réduction du bruit sur les workflows Lambda et Step Functions.',
            'exp.caisse.item4': 'Centralisation des opérations Systems Manager : inventaire, gestion des correctifs Windows/Linux, contrôles post-maintenance et traçabilité opérationnelle.',
            'exp.caisse.item5': 'Contribution à la gouvernance, à la sécurité et au FinOps : IAM, KMS, IMDSv2, moindre privilège et optimisation des ressources ; accompagnement technique des équipes.',
            'exp.caisse.item6': 'Conception d’approches AIOps et agentiques pour les opérations AWS : MCP, Bedrock/AgentCore, agents spécialisés, validation humaine et accès en lecture seule gouverné.',
            // Experience details - ACENSI

            'exp.acensi.title': 'Spécialiste Cloud & Sécurité – DevSecOps | ACENSI',
            'exp.acensi.period': '2023 – Juin 2026',
            'exp.acensi.item1': 'Conception et déploiement d\'une stratégie de sauvegarde « as-code » (Terraform, AWS S3, Commvault/Clumio), réduction des interventions manuelles et temps d\'exploitation.',
            'exp.acensi.item2': 'Automatisation end-to-end CI/CD (Jenkins, GitHub Actions, Ansible AAP) pour pipelines sécurisés et déploiements reproductibles, amélioration des cycles de livraison.',
            'exp.acensi.item3': 'Renforcement de la sécurité cloud (IAM, SAML, scans Tenable, hardening CIS), réduction majeure des vulnérabilités critiques détectées.',
            'exp.acensi.item4': 'Mise en place d\'observabilité (Prometheus, Grafana) et playbooks d\'incident pour réduire le MTTR et améliorer la disponibilité.',
            // Experience details - SQUAD
            'exp.squad.title': 'Ingénieur Systèmes – DevSecOps | SQUAD',
            'exp.squad.period': '2022 – 2023',
            'exp.squad.item1': 'Administration et sécurisation de 3000+ VM dans un contexte SMSI/eIDAS ; mise en place de contrôles et revues de sécurité.',
            'exp.squad.item2': 'Automatisation du hardening RedHat via Ansible, accélération des mises en conformité et réduction des corrections manuelles.',
            'exp.squad.item3': 'Containerisation et orchestration de services (Docker, Kubernetes) avec pipelines CI/CD sécurisés.',
            'exp.squad.item4': 'Accompagnement et formation des équipes DevOps sur les bonnes pratiques DevSecOps et la sécurité du pipeline.',
            // Experience details - ECONOCOM
            'exp.econocom.title': 'Ingénieur Infrastructure – DevSecOps | ECONOCOM (Projet ITER)',
            'exp.econocom.period': '2020 – 2022',
            'exp.econocom.item1': 'Déploiement d\'Ansible AWX/AAP et création de playbooks modulaires pour le provisioning et la configuration.',
            'exp.econocom.item2': 'Automatisation des contrôles d\'accès (intégration LDAP) et des procédures de sécurité pour environnements réglementés.',
            'exp.econocom.item3': 'Mise en place de workflows d\'automatisation pour provisioning et gestion du stockage, avec procédures auditables.',
            'exp.econocom.item4': 'Standardisation des templates et réduction significative du temps de provisionnement et des erreurs manuelles.',
            // Experience details - DIGIMIND
            'exp.digimind.title': 'Ingénieur Système R&D - DevOps | DIGIMIND',
            'exp.digimind.period': 'Avril 2020 – Août 2020',
            'exp.digimind.item1': 'Modernisation d\'infrastructures multi-datacenters, gain de performance mesurable de +30% (CPU/RPS) livré en 6 mois.',
            'exp.digimind.item2': 'Mise en place de supervision et gestion des incidents (Centreon, Prometheus) pour améliorer la résilience et réduire le MTTR.',
            'exp.digimind.item3': 'Traitement et optimisation Big Data (SolrCloud) : tuning d\'index et d\'architectures pour réduire la latence des requêtes.',
            'exp.digimind.item4': 'Conduite de migrations et optimisation CDN pour les utilisateurs asiatiques afin d\'améliorer l\'expérience et la latence réseau.',
            // Experience details - HARDIS
            'exp.hardis.title': 'Administrateur Systèmes - CloudOps | HARDIS',
            'exp.hardis.period': 'Août 2019 – Mars 2020',
            'exp.hardis.item1': 'Gestion des incidents et demandes de niveau 2 avec respect des SLA et réduction des escalades vers les équipes d\'expertise.',
            'exp.hardis.item2': 'Automatisation des tâches récurrentes via scripts Shell et PowerShell, diminuant le travail manuel et accélérant les opérations.',
            'exp.hardis.item3': 'Optimisation des performances serveurs (ESX) et répartition de charge des VMs pour améliorer l\'efficience des ressources.',
            'exp.hardis.item4': 'Rédaction de procédures d\'intégration et participation aux actions de conformité (ISO 27001) pour renforcer la gouvernance.',
            // Experience note
            'exp.more.title': 'Et d\'autres expériences...',
            'exp.more.description': 'D\'autres missions et projets disponibles sur demande ou dans le CV complet. Contactez-moi pour obtenir la liste complète des réalisations et cas clients.'
        },
        en: {
            // Navigation
            'nav.home': 'Home',
            'nav.skills': 'Skills',
            'nav.projects': 'Projects',
            'nav.experience': 'Experience',
            'nav.contact': 'Contact',
            // Hero
            'hero.greeting': '👋 Welcome to my portfolio',
            'hero.title': 'Christophe FREIJANES',
            'hero.role': 'Senior Cloud & Security Specialist - DevSecOps',
            'hero.tagline': 'Cloud Security • DevSecOps • Infrastructure as Code • Automation',
            'hero.btn.projects': 'View my projects',
            'hero.btn.contact': 'Contact me',
            // Hero code block
            'hero.code.role': 'Cloud & Security Specialist • 20+ years experience • Montreal (QC, Canada)',
            'hero.code.expertise': '• AWS (IAM, EC2, S3, CloudWatch) • GCP • Kubernetes\n• AWS CDK • CloudFormation • Terraform • Ansible (AWX/AAP)\n• Docker / Podman • Helm • GitHub Actions • GitLab CI • Jenkins\n• LLM • MCP • Amazon Bedrock • Agents & tools • Skills • Hooks\n• Strands Agents SDK • Agent frameworks\n• CloudWatch Logs • Datadog • Grafana • Prometheus • Nagios • Centreon\n• Commvault • Clumio • Cohesity • Druva • Veeam',
            'hero.code.motto': 'Security-by-design • IA • Automation-first',
            // Skills
            'skills.title': 'Technical Skills',
            'skills.subtitle': 'Technologies and tools mastered',
            'skills.cloud': 'Cloud & Security',
            'skills.devsecops': 'DevSecOps & CI/CD',
            'skills.backup': 'Backup & DRP',
            'skills.automation': 'IaC & Automation',
            'skills.monitoring': 'Monitoring & Observability',
            'skills.ai': 'AI & Agents',
            'skills.os': 'Operating Systems',
            'skills.virtualization': 'Virtualization & Infrastructure',
            'skills.storage': 'Storage & Data',
            'skills.methodologies': 'Methodologies',
            // Projects
            'projects.title': 'Recent Projects',
            'projects.subtitle': 'Achievements and contributions',
            // Project details
            'project.formation.title': 'DevOps & CI/CD Training',
            'project.formation.desc': 'Repository used for my DevOps training covering automation, continuous integration and continuous deployment.',
            'project.formation.link': 'View on GitHub',
            'project.ansible.title': 'ansible-webapp',
            'project.ansible.desc': 'Ansible playbooks for automated deployment and configuration of web applications with modular roles.',
            'project.ansible.link': 'View on GitHub',
            'project.student.title': 'student-list',
            'project.student.desc': 'Fullstack application demonstrating interaction between a backend API and a frontend webapp for student management.',
            'project.student.link': 'View on GitHub',
            'project.freijstack.title': 'freijstack',
            'project.freijstack.desc': 'Custom stack bringing together my favorite tools and configurations for DevSecOps and infrastructure projects.',
            'project.freijstack.link': 'View on GitHub',
            'project.docker.title': 'Docker Applications',
            'project.docker.desc': 'Collection of Docker images and configurations to quickly deploy applications in containerized environments.',
            'project.docker.link': 'Private Registry',
            'project.iac.title': 'Infrastructure as Code',
            'project.iac.desc': 'Automation of infrastructure, monitoring and backups, orchestrated by my secure GitHub Actions workflows.',
            'project.iac.link': 'See Workflows',
            // Experience
            'experience.title': 'Professional Background',
            'experience.subtitle': 'My experience and achievements',
            // Accreditations
            'accreditations.title': 'Certifications',
            'accreditations.subtitle': 'Recent training and certifications',
            // Contact
            'contact.title': 'Let\'s Talk',
            'contact.subtitle': 'Have a project? Contact me',
            'assistant.open': 'AI',
            'assistant.eyebrow': 'RECRUITMENT CHAT',
            'assistant.title': 'Recruitment assistant',
            'assistant.close': 'Close',
            'assistant.notice': 'Virtual assistant: answers inspired by my background and speaking style.',
            'assistant.greeting': 'Welcome! Glad you stopped by. Curious about my background, AWS or teamwork?',
            'assistant.questions.title': 'Frequently asked questions',
            'assistant.question.experience': 'My experience',
            'assistant.question.aws': 'AWS',
            'assistant.question.sre': 'SRE',
            'assistant.question.aiops': 'Agentic AI',
            'assistant.question.impact': 'Achievements',
            'assistant.question.certs': 'Certifications',
            'assistant.question.langs': 'Languages',
            'assistant.question.teamwork': 'Teamwork',
            'assistant.question.skills': 'My skills',
            'assistant.question.projects': 'My projects',
            'assistant.input.label': 'Your question',
            'assistant.send': 'Send',
            'assistant.booking': 'Book a conversation',
            // Footer
            'footer.home': 'Home',
            'footer.projects': 'Projects',
            'footer.rights': 'All rights reserved.',
            // Experience details - La Caisse (CDPQ)
            'exp.caisse.title': 'Principal Specialist – AWS Platform / Technical Lead | La Caisse (CDPQ)',
            'exp.caisse.period': 'June 2026 – Present · Montreal, Quebec',
            'exp.caisse.item1': 'Operating, improving reliability and evolving a multi-account AWS platform in a critical, regulated financial environment.',
            'exp.caisse.item2': 'Automating and standardizing operations with CloudFormation, Systems Manager and Python/Bash/PowerShell; contributing to Azure DevOps workflows and applying SRE practices to platform reliability.',
            'exp.caisse.item3': 'Improving observability with Datadog and CloudWatch: dashboards, alert tuning and noise reduction for Lambda and Step Functions workflows.',
            'exp.caisse.item4': 'Centralizing Systems Manager operations: inventory, Windows/Linux patch management, post-maintenance checks and operational traceability.',
            'exp.caisse.item5': 'Contributing to governance, security and FinOps: IAM, KMS, IMDSv2, least privilege and resource optimization; providing technical guidance to teams.',
            'exp.caisse.item6': 'Designing AIOps and agentic approaches for AWS operations: MCP, Bedrock/AgentCore, specialized agents, human approval and governed read-only access.',
            // Experience details - ACENSI

            'exp.acensi.title': 'Cloud & Security Specialist – DevSecOps | ACENSI',
            'exp.acensi.period': '2023 – June 2026',
            'exp.acensi.item1': 'Design and deployment of an "as-code" backup strategy (Terraform, AWS S3, Commvault/Clumio), reducing manual interventions and operational time.',
            'exp.acensi.item2': 'End-to-end CI/CD automation (Jenkins, GitHub Actions, Ansible AAP) for secure pipelines and reproducible deployments, improving delivery cycles.',
            'exp.acensi.item3': 'Cloud security hardening (IAM, SAML, Tenable scans, CIS hardening), major reduction in critical vulnerabilities detected.',
            'exp.acensi.item4': 'Implementation of observability (Prometheus, Grafana) and incident playbooks to reduce MTTR and improve availability.',
            // Experience details - SQUAD
            'exp.squad.title': 'Systems Engineer – DevSecOps | SQUAD',
            'exp.squad.period': '2022 – 2023',
            'exp.squad.item1': 'Administration and security of 3000+ VMs in an ISMS/eIDAS context; implementation of security controls and reviews.',
            'exp.squad.item2': 'RedHat hardening automation via Ansible, accelerating compliance and reducing manual corrections.',
            'exp.squad.item3': 'Containerization and orchestration of services (Docker, Kubernetes) with secure CI/CD pipelines.',
            'exp.squad.item4': 'Support and training of DevOps teams on DevSecOps best practices and pipeline security.',
            // Experience details - ECONOCOM
            'exp.econocom.title': 'Infrastructure Engineer – DevSecOps | ECONOCOM (ITER Project)',
            'exp.econocom.period': '2020 – 2022',
            'exp.econocom.item1': 'Deployment of Ansible AWX/AAP and creation of modular playbooks for provisioning and configuration.',
            'exp.econocom.item2': 'Automation of access controls (LDAP integration) and security procedures for regulated environments.',
            'exp.econocom.item3': 'Implementation of automation workflows for provisioning and storage management, with auditable procedures.',
            'exp.econocom.item4': 'Template standardization and significant reduction in provisioning time and manual errors.',
            // Experience details - DIGIMIND
            'exp.digimind.title': 'R&D Systems Engineer - DevOps | DIGIMIND',
            'exp.digimind.period': 'April 2020 – August 2020',
            'exp.digimind.item1': 'Multi-datacenter infrastructure modernization, measurable +30% performance gain (CPU/RPS) delivered in 6 months.',
            'exp.digimind.item2': 'Implementation of monitoring and incident management (Centreon, Prometheus) to improve resilience and reduce MTTR.',
            'exp.digimind.item3': 'Big Data processing and optimization (SolrCloud): index and architecture tuning to reduce query latency.',
            'exp.digimind.item4': 'Migration leadership and CDN optimization for Asian users to improve experience and network latency.',
            // Experience details - HARDIS
            'exp.hardis.title': 'Systems Administrator - CloudOps | HARDIS',
            'exp.hardis.period': 'August 2019 – March 2020',
            'exp.hardis.item1': 'Level 2 incident and request management with SLA compliance and reduced escalations to expert teams.',
            'exp.hardis.item2': 'Automation of recurring tasks via Shell and PowerShell scripts, reducing manual work and accelerating operations.',
            'exp.hardis.item3': 'Server performance optimization (ESX) and VM load balancing to improve resource efficiency.',
            'exp.hardis.item4': 'Integration procedure documentation and participation in compliance actions (ISO 27001) to strengthen governance.',
            // Experience note
            'exp.more.title': 'And more experiences...',
            'exp.more.description': 'Other missions and projects available upon request or in the complete CV. Contact me for the full list of achievements and client cases.'
        }
    };

    // Fonction pour changer la langue
    function setLanguage(lang) {
        // Stocker la langue choisie
        localStorage.setItem('preferredLanguage', lang);
        
        // Mettre à jour tous les éléments avec data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // Si l'élément contient des enfants (ex: icônes), ne remplacer que le nœud texte principal
                let replaced = false;
                element.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && !replaced) {
                        node.textContent = translations[lang][key];
                        replaced = true;
                    }
                });
                // Si aucun nœud texte trouvé, fallback sur textContent
                if (!replaced) {
                    element.textContent = translations[lang][key];
                }
            }
        });
        
        const assistantTrigger = document.getElementById('assistantOpen');
        if (assistantTrigger) {
            const label = lang === 'en'
                ? 'Open recruitment assistant'
                : "Ouvrir l'assistant de recrutement";
            assistantTrigger.setAttribute('aria-label', label);
            assistantTrigger.title = label;
        }

        // Mettre à jour le code block dans hero
        const codeBlock = document.querySelector('.code-block code');
        if (codeBlock && translations[lang]) {
            codeBlock.textContent = `$ whoami
Christophe FREIJANES

$ summary --role
${translations[lang]['hero.code.role']}

$ expertise --list
${translations[lang]['hero.code.expertise']}

$ echo "${translations[lang]['hero.code.motto']}"`;
        }
        
        // Mettre à jour les boutons de langue
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
    }

    // Initialiser la langue (localStorage ou navigateur ou défaut FR)
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    const defaultLang = savedLang || (browserLang === 'en' ? 'en' : 'fr');
    setLanguage(defaultLang);

    // Écouter les clics sur les boutons de langue
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // Navigation active state on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById(this.getAttribute('data-section'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger?.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu?.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('section, .project-card, .skill-category, .timeline-item').forEach(el => {
        observer.observe(el);
    });
});

// ============================================
// CONTACT FORM HANDLING (with captcha + sanitization)
// ============================================

const contactForm = document.getElementById('contactForm');

// Simple sanitizer for client-side (server-side mandatory)
function sanitizeInput(str){
    return String(str).replace(/[<>]/g, function(c){ return {'<':'&lt;','>':'&gt;'}[c]; });
}

// Captcha simple : addition de deux nombres (1-9)
var expectedCaptcha = null;
function generateCaptcha(){
    var a = Math.floor(Math.random()*9) + 1;
    var b = Math.floor(Math.random()*9) + 1;
    expectedCaptcha = a + b;
    var q = document.getElementById('captchaQuestion');
    if(q) q.textContent = 'Antispam : ' + a + ' + ' + b + ' = ?';
}

// Attach data-alert click handlers (replaces inline onclick)
document.addEventListener('DOMContentLoaded', function(){
    // Ajout du pointer lumineux
    const pointer = document.createElement('div');
    pointer.className = 'pointer-lumineux';
    document.body.appendChild(pointer);
    document.addEventListener('mousemove', (e) => {
        pointer.style.left = e.clientX + 'px';
        pointer.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('[data-alert]').forEach(function(el){
        el.addEventListener('click', function(e){
            e.preventDefault();
            alert(el.getAttribute('data-alert'));
        });
    });

    // Email link if present (obfuscated link support) — open mailto in new tab/window
    document.querySelectorAll('[data-user][data-domain]').forEach(function(link){
        link.addEventListener('click', function(e){
            e.preventDefault();
            var user = link.getAttribute('data-user');
            var domain = link.getAttribute('data-domain');
            if(!(user && domain)) return;
            var mailto = 'mailto:' + user + '@' + domain;
            // Try window.open first to open in new tab
            var w = null;
            try { w = window.open(mailto, '_blank'); } catch(err){ w = null; }
            if(!w){
                // fallback: create temporary anchor and click
                var tmp = document.createElement('a');
                tmp.href = mailto;
                tmp.target = '_blank';
                tmp.rel = 'noopener noreferrer';
                tmp.style.display = 'none';
                document.body.appendChild(tmp);
                tmp.click();
                tmp.remove();
            }
        }, false);
    });

    // Keep footer email text readable but obfuscated visually; update aria-label for screen readers
    var footerEmail = document.getElementById('footerEmail');
    if(footerEmail){
        footerEmail.setAttribute('title', 'Envoyer un e-mail');
        footerEmail.setAttribute('aria-label', 'Envoyer un e-mail');
    }

    // Init captcha if present
    if(document.getElementById('captchaQuestion')) generateCaptcha();
    var refresh = document.getElementById('refreshCaptcha');
    if(refresh) refresh.addEventListener('click', function(){ generateCaptcha(); }, false);
});

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var nameEl = document.getElementById('name');
        var emailEl = document.getElementById('email');
        var subjectEl = document.getElementById('subject');
        var messageEl = document.getElementById('message');
        var captchaAns = document.getElementById('captchaAnswer');

        var name = nameEl ? nameEl.value.trim() : '';
        var email = emailEl ? emailEl.value.trim() : '';
        var subject = subjectEl ? subjectEl.value.trim() : '';
        var message = messageEl ? messageEl.value.trim() : '';

        // Basic checks
        if (!name || !email || !message) {
            showNotification('Veuillez remplir tous les champs requis', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showNotification('Veuillez entrer une adresse email valide', 'error');
            return;
        }

        // Length checks (defensive)
        if(name.length > 100){ showNotification('Le nom est trop long (max 100 caractères).', 'error'); return; }
        if(email.length > 254){ showNotification('L\'email est trop long (max 254 caractères).', 'error'); return; }
        if(subject.length > 150){ showNotification('Le sujet est trop long (max 150 caractères).', 'error'); return; }
        if(message.length > 2000){ showNotification('Le message est trop long (max 2000 caractères).', 'error'); return; }

        // Captcha validation
        if(captchaAns){
            var v = parseInt(captchaAns.value, 10);
            if(isNaN(v) || expectedCaptcha === null || v !== expectedCaptcha){
                showNotification('Réponse au captcha incorrecte.', 'error');
                generateCaptcha();
                if(captchaAns) captchaAns.value = '';
                return;
            }
        }

        // Client-side sanitization (for UX only)
        if(nameEl) nameEl.value = sanitizeInput(name);
        if(subjectEl) subjectEl.value = sanitizeInput(subject);
        if(messageEl) messageEl.value = sanitizeInput(message);

        // Simulate form submission (replace with server call)
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn ? submitBtn.textContent : 'Envoyer';
        if(submitBtn){ submitBtn.textContent = 'Envoi en cours...'; submitBtn.disabled = true; }

        setTimeout(() => {
            console.log('Form data:', { name: nameEl.value, email, subject: subjectEl ? subjectEl.value : subject, message: messageEl ? messageEl.value : message });
            showNotification('Message envoyé avec succès! Je vous recontacterai bientôt.', 'success');
            contactForm.reset();
            if(submitBtn){ submitBtn.textContent = originalText; submitBtn.disabled = false; }
        }, 1200);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#51cf66' : '#ff6b6b'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideInDown 0.3s ease-out;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// CV DOWNLOAD
// ============================================

const downloadCVBtn = document.getElementById('downloadCV');

if (downloadCVBtn) {
    downloadCVBtn.addEventListener('click', function(e) {
        // Le lien pointe directement vers Google Drive, pas besoin de preventDefault
        // showNotification('Ouverture de votre CV...', 'info');
    });
}

// ============================================
// PARALLAX EFFECT
// ============================================

window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    const heroSection = document.querySelector('.hero');
    
    if (heroSection && scrollY < window.innerHeight) {
        heroSection.style.backgroundPosition = `center ${scrollY * 0.5}px`;
    }
});

// ============================================
// TYPING EFFECT (OPTIONAL)
// ============================================

function typeText(element, text, speed = 50) {
    if (!element) return;
    
    element.textContent = '';
    let i = 0;
    
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Add any additional initialization here
    console.log('Portfolio loaded and ready!');
});

// Ensure external links (icons, external anchors) open in a new tab
document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a[href]').forEach(function(a){
        var href = a.getAttribute('href') || '';
        if(!href) return;
        // skip internal anchors and javascript pseudo-links
        if(href.startsWith('#') || href.startsWith('javascript:')) return;
        // don't override placeholders that use data-alert
        if(a.hasAttribute('data-alert')) return;
        // only handle external/http or mailto links
        if(href.indexOf('http') === 0 || href.indexOf('mailto:') === 0){
            // preserve any original target set in HTML to avoid double-opening
            var originalTarget = a.getAttribute('target');
            a.setAttribute('target','_blank');
            a.setAttribute('rel','noopener noreferrer');
            a.addEventListener('click', function(e){
                // allow modifier keys to keep default behavior
                if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                // if the anchor originally specified target="_blank", don't intercept (let browser handle it)
                if(originalTarget === '_blank') return;
                e.preventDefault();
                // Special handling for mailto: links to avoid replacing current page
                if(href.indexOf('mailto:') === 0){
                    var w = null;
                    try { w = window.open(href, '_blank'); } catch(err){ w = null; }
                    if(!w){
                        var tmp = document.createElement('a');
                        tmp.href = href;
                        tmp.target = '_blank';
                        tmp.rel = 'noopener noreferrer';
                        tmp.style.display = 'none';
                        document.body.appendChild(tmp);
                        tmp.click();
                        tmp.remove();
                    }
                    return;
                }

                var w = null;
                try { w = window.open(href, '_blank', 'noopener'); } catch(err){ w = null; }
                if(!w) window.location.href = href;
            });
        }
    });
});

// ============================================
// DARK MODE TOGGLE (OPTIONAL)
// ============================================

const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
};

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

document.addEventListener('DOMContentLoaded', function() {
    const dialog = document.getElementById('recruitmentAssistant');
    const openButton = document.getElementById('assistantOpen');
    const closeButton = document.getElementById('assistantClose');
    const messages = document.getElementById('assistantMessages');
    const form = document.getElementById('assistantForm');
    const input = document.getElementById('assistantInput');

    if (!dialog || !openButton || !closeButton || !messages || !form || !input) return;

    const language = () => localStorage.getItem('preferredLanguage') === 'en' ? 'en' : 'fr';
    const normalize = value => value.toLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9+]+/g, ' ').trim();
    const phrases = {
        fr: {
            missing: [
                "Bonne question. Je préfère rester précis : je n'ai pas assez d'éléments vérifiés pour vous répondre. On peut parler du parcours, des projets ou des compétences.",
                "Je n'ai pas cette information dans le CV ou le portfolio. Si vous voulez, parlons d'un sujet concret : AWS, SRE, certifications ou réalisations.",
                "Sur ce point, je ne veux pas inventer. Le plus simple est de poser la question lors d'un échange."
            ],
            unavailable: "Je n'arrive pas à charger les informations pour le moment. Le CV ATS reste disponible, et vous pouvez aussi proposer un échange.",
            unverified: "Je n'ai pas de donnée vérifiée pour répondre précisément à cette question. Je préfère ne pas avancer de chiffre ou de date sans source.",
            booking: [
                "Avec plaisir ! Le bouton « Réserver un échange » est juste en dessous.",
                "Bonne idée. Pour aller plus loin, vous pouvez choisir un créneau avec « Réserver un échange »."
            ],
            identity: "Je suis l'assistant virtuel du portfolio, pas Christophe en direct. Je partage ses expériences et ses centres d'intérêt dans un style qui lui ressemble, sans inventer de faits.",
            next: ["Ça vous intéresserait aussi de parler de ", "On peut également regarder ", "Un autre angle intéressant : "],
            meeting: ["Pour approfondir, le bouton de rendez-vous est à votre disposition.", "Envie d'en discuter directement ? La prise de rendez-vous est juste en dessous."],
            explore: "En savoir plus : "
        },
        en: {
            missing: [
                "Good question. I prefer to be precise: I don't have enough verified information to answer that. We can talk about experience, projects or skills.",
                "That detail isn't in the résumé or portfolio. We could explore AWS, SRE, certifications or achievements instead.",
                "I don't want to guess on this one. It's a good question to ask in a conversation."
            ],
            unavailable: "I can't load the information just now. The ATS résumé is available, and you can book a conversation.",
            unverified: "I don't have a verified figure or date for that specific question, so I'd rather not guess.",
            booking: [
                "Of course! Use the “Book a conversation” button below.",
                "Great idea. You can pick a time using the booking button below."
            ],
            identity: "I'm the portfolio's virtual assistant, not Christophe live. I share his experience and interests in a style inspired by him, without inventing details.",
            next: ["Would you also like to hear about ", "We could also look at ", "Another interesting angle: "],
            meeting: ["To explore this further, you can book a conversation below.", "Want to discuss this directly? The booking option is right below."],
            explore: "Explore: "
        }
    };

    const previousAnswers = new Map();
    let knowledge = [];
    let facts = null;
    let previousFactIntent = null;
    let previousTopic = null;
    let replyCount = 0;
    const loading = fetch('data/recruitment-knowledge.json')
        .then(response => {
            if (!response.ok) throw new Error('Index non disponible');
            return response.json();
        })
        .then(data => {
            if (!data || !Array.isArray(data.items)) throw new Error('Index invalide');
            knowledge = data.items.filter(item => item.id && Array.isArray(item.tags)
                && item.replies && Array.isArray(item.replies.fr) && Array.isArray(item.replies.en));
            facts = data.fact_index || null;
        })
        .catch(() => { knowledge = []; });

    function choose(values, key) {
        if (!values.length) return '';
        if (values.length === 1) return values[0];
        const last = previousAnswers.get(key);
        let index = Math.floor(Math.random() * values.length);
        if (index === last) index = (index + 1 + Math.floor(Math.random() * (values.length - 1))) % values.length;
        previousAnswers.set(key, index);
        return values[index];
    }

    function addMessage(text, isUser) {
        const message = document.createElement('p');
        message.className = 'assistant-message ' + (isUser ? 'assistant-user' : 'assistant-reply');
        message.textContent = text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    // Afficher la preuve sans insérer de HTML provenant des données.
    function addFactSource(source) {
        if (!source || !source.url) return;
        const url = new URL(source.url);
        if (url.protocol !== 'https:' || !['github.com', 'portfolio.freijstack.com'].includes(url.hostname)) return;
        const link = document.createElement('a');
        link.className = 'assistant-source';
        link.href = url.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Source : ' + source.label;
        messages.appendChild(link);
    }

    // API optionnelle : aucun secret dans le navigateur.
    async function askNvidia(question, lang) {
        if (question.length > 350) return null;
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                credentials: 'omit',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, language: lang }),
                signal: AbortSignal.timeout(8500)
            });
            if (!response.ok) return null;
            const data = await response.json();
            return typeof data.answer === 'string' && data.answer.length <= 650
                ? { text: data.answer.trim(), source: data.source } : null;
        } catch (_error) {
            return null;
        }
    }

    function matches(question, keyword) {
        const key = normalize(keyword);
        return key && (' ' + question + ' ').includes(' ' + key + ' ');
    }

    function findTopic(question) {
        const q = normalize(question);
        if (!q) return null;
        if (/(rendez vous|prendre rdv|book|booking|appointment|calendar|calendrier|meeting)/.test(q)) return 'booking';
        if (/(tu es une ia|es tu une ia|qui es tu|vraie ia|un robot|un bot|chatbot|are you ai|are you real|virtual assistant)/.test(q)) return 'identity';

        // Les questions personnelles et humaines passent avant les mots-clés génériques.
        if (/(handball|hockey|soccer|football|sports?|photograph|photo|video|design|cuisine|loisirs?|hobb|hors travail|en dehors du travail|outside work|free time|spare time|weekend|for fun|5 a 7|passions?)/.test(q)) {
            return knowledge.find(item => item.id === 'interests') || null;
        }
        if (/(collabor|collegu|equipe|teamwork|team|soft skills?|savoir etre|sociab|communi|relationnel|esprit d equipe|qualites?|strengths?|points? forts?|working style|style de travail)/.test(q)) {
            return knowledge.find(item => item.id === 'teamwork') || null;
        }

        const ranked = knowledge.map(item => {
            const score = item.tags.reduce((total, tag) =>
                total + (matches(q, tag) ? (normalize(tag).includes(' ') ? 5 : (tag.length >= 4 ? 3 : 1)) : 0), 0);
            return { item, score };
        }).sort((a, b) => b.score - a.score);

        if (ranked.length && ranked[0].score > 0) return ranked[0].item;
        if (previousTopic && /^(encore|plus|detail|details|precise|preciser|developpe|raconte|more|tell me more|explain)/.test(q)) return previousTopic;
        if (previousTopic && /^(et |et sinon|what about|how about|qu en est il)/.test(q)) {
            return knowledge.find(item => item.id === previousTopic.next) || null;
        }
        return null;
    }

    async function reply(topic, question = '') {
        await loading;
        const lang = language();
        const copy = phrases[lang];
        const result = topic
            ? knowledge.find(item => item.id === topic)
            : findTopic(question);
        replyCount += 1;

        // Les modèles sélectionnent d'abord une réponse approuvée côté serveur.
        if (!topic && result !== 'booking' && result !== 'identity') {
            const remote = await askNvidia(question, lang);
            if (remote) {
                addMessage(remote.text, false);
                addFactSource(remote.source);
                return;
            }
        }

        if (!topic) {
            const engine = window.RecruitmentFacts;
            const verified = engine && facts
                ? engine.answer(question, facts, lang, new Date(), previousFactIntent) : null;
            if (verified) {
                addMessage(verified.text, false);
                addFactSource(verified.source);
                previousFactIntent = verified.intent;
                messages.scrollTop = messages.scrollHeight;
                return;
            }
            // Pas d'anecdote de remplacement pour une question factuelle.
            const intent = engine
                ? engine.detectIntent(question, previousFactIntent)
                : /\b(depuis|combien|quand|ou|quel|quelle|how long|how many|when|where|which)\b/
                    .test(normalize(question));
            if (intent && result !== 'booking' && result !== 'identity') {
                addMessage(copy.unverified, false);
                return;
            }
        }

        if (result === 'booking') {
            addMessage(choose(copy.booking, lang + ':booking'), false);
            return;
        }
        if (result === 'identity') {
            addMessage(copy.identity, false);
            return;
        }
        if (!result) {
            addMessage(knowledge.length
                ? choose(copy.missing, lang + ':missing')
                : copy.unavailable, false);
            return;
        }

        const options = result.replies[lang];
        let answer = choose(options, lang + ':' + result.id);
        previousTopic = result;
        const next = knowledge.find(item => item.id === result.next && item.id !== result.id);
        // Relances occasionnelles, jamais systématiques.
        const addFollowUp = next && replyCount % 3 !== 1 && Math.random() < 0.65;
        if (addFollowUp) {
            answer += '\n\n' + choose(copy.next, lang + ':transition') + (next.topic_en && lang === 'en' ? next.topic_en : next.topic) + ' ?';
        } else if (replyCount > 2 && replyCount % 4 === 0) {
            answer += '\n\n' + choose(copy.meeting, lang + ':meeting');
        }
        addMessage(answer, false);
        if (addFollowUp) {
            const suggestion = document.createElement('button');
            suggestion.type = 'button';
            suggestion.className = 'assistant-next';
            const label = lang === 'en' && next.topic_en ? next.topic_en : next.topic;
            suggestion.textContent = copy.explore + label;
            suggestion.addEventListener('click', () => {
                addMessage(label, true);
                suggestion.remove();
                reply(next.id);
            });
            messages.appendChild(suggestion);
            messages.scrollTop = messages.scrollHeight;
        }
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

    document.querySelectorAll('[data-assistant-topic]').forEach(button => {
        button.addEventListener('click', () => {
            addMessage(button.textContent.trim(), true);
            reply(button.dataset.assistantTopic);
        });
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        const question = input.value.trim();
        if (!question) return;
        addMessage(question, true);
        reply(null, question);
        form.reset();
        input.focus();
    });

    function updatePlaceholder() {
        input.placeholder = language() === 'en'
            ? 'Curious about my work? Ask away…'
            : 'Une question sur mon parcours ? Je vous écoute…';
    }

    document.querySelectorAll('.lang-btn').forEach(function(button) {
        button.addEventListener('click', updatePlaceholder);
    });
    updatePlaceholder();
});
