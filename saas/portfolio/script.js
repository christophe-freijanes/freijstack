/* ============================================================
   Portfolio Script - Refactor "Level Up"
   - Single DOMContentLoaded
   - Seasonal theme + seasonal favicon
   - theme-color sync (dark/light)
   - i18n
   - Smooth scroll + active nav
   - Animations (IntersectionObserver)
   - Contact form (captcha + sanitization)
   - External links safe target blank
   - Parallax
   - Dark mode toggle (optional)
   ============================================================ */

// ============================================
// CONFIG
// ============================================

// Si tes favicons sont dans /images/, laisse "images/".
// Sinon, mets "" pour la racine (ex: /saas/portfolio/)
const FAVICON_BASE_PATH = "images/";

// Theme color for mobile browser UI
const THEME_COLOR_DARK = "#0b0f1a";
const THEME_COLOR_LIGHT = "#ffffff";

// ============================================
// UTILITIES
// ============================================

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Simple sanitizer for client-side (server-side mandatory)
function sanitizeInput(str) {
  return String(str).replace(/[<>]/g, (c) => ({ "<": "&lt;", ">": "&gt;" }[c]));
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  const bg =
    type === "success" ? "#51cf66" :
    type === "error" ? "#ff6b6b" :
    "#4dabf7";

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${bg};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    animation: slideInDown 0.3s ease-out;
    font-weight: 500;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideInUp 0.3s ease-out forwards";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function typeText(element, text, speed = 50) {
  if (!element) return;

  element.textContent = "";
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
// SEASON THEME + FAVICON (dark/light via SVG) + THEME-COLOR
// ============================================

function setThemeColorMeta() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;

  const isLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
  meta.setAttribute("content", isLight ? THEME_COLOR_LIGHT : THEME_COLOR_DARK);
}

function setSeasonalFavicon(faviconFile) {
  // Priorité au SVG, fallback sur rel="icon"
  const link =
    document.querySelector('link[rel="icon"][type="image/svg+xml"]') ||
    document.querySelector('link[rel="icon"]');

  if (!link) return;

  const href = new URL(FAVICON_BASE_PATH + faviconFile, document.baseURI).toString();
  link.setAttribute("href", href);
}

function applySeasonalTheme() {
  const month = window.__forceSeasonMonth || (new Date().getMonth() + 1);

  let seasonClass = "palette-neutral";
  let faviconFile = "/saas/portfolio/images/favicon.svg";

  if (month >= 12 || month <= 2) {
    seasonClass = "season-winter"; // Hiver
    faviconFile = "favicon-winter.svg";
  } else if (month >= 3 && month <= 5) {
    seasonClass = "season-spring"; // Printemps
    faviconFile = "favicon-spring.svg";
  } else if (month >= 6 && month <= 8) {
    seasonClass = "season-summer"; // Été
    faviconFile = "favicon-summer.svg";
  } else if (month >= 9 && month <= 11) {
    seasonClass = "season-autumn"; // Automne
    faviconFile = "favicon-autumn.svg";
  }

  // Retirer toutes les classes de palette et appliquer la saison
  document.body.classList.remove(
    "palette-neutral",
    "season-winter",
    "season-spring",
    "season-summer",
    "season-autumn"
  );
  document.body.classList.add(seasonClass);

  // Mettre à jour favicon + theme-color
  setSeasonalFavicon(faviconFile);
  setThemeColorMeta();
}

// ============================================
// SCROLL ANIMATIONS (IntersectionObserver)
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// ============================================
// CAPTCHA (simple)
// ============================================

let expectedCaptcha = null;

function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  expectedCaptcha = a + b;

  const q = document.getElementById("captchaQuestion");
  if (q) q.textContent = "Antispam : " + a + " + " + b + " = ?";
}

// ============================================
// i18n TRANSLATIONS
// ============================================

const translations = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.skills": "Compétences",
    "nav.projects": "Projets",
    "nav.experience": "Expérience",
    "nav.contact": "Contact",
    // Hero
    "hero.greeting": "👋 Bienvenue sur mon portfolio",
    "hero.title": "Christophe FREIJANES",
    "hero.role": "Spécialiste senior Cloud & Sécurité - DevSecOps",
    "hero.tagline": "Sécurité infonuagique • DevSecOps • Infrastructure as Code • Automatisation",
    "hero.btn.projects": "Voir mes projets",
    "hero.btn.contact": "Me contacter",
    // Hero code block
    "hero.code.role": "Spécialiste Cloud & Sécurité • 20+ ans d'expérience • Montréal (QC, Canada)",
    "hero.code.expertise":
      "• AWS (IAM, EC2, S3, CloudWatch) • Kubernetes • GCP\n" +
      "• Terraform • Ansible (AWX/AAP) • Docker / Podman\n" +
      "• GitHub Actions • GitLab CI • Jenkins • Helm\n" +
      "• Commvault • Clumio • Cohesity • Veeam\n" +
      "• Grafana • Prometheus • Nagios • Centreon",
    "hero.code.motto": "Security-by-design • Zero Trust • Automation-first",
    // Compétences
    "skills.title": "Compétences Techniques",
    "skills.subtitle": "Technologies et outils maîtrisés",
    "skills.cloud": "Cloud & Sécurité",
    "skills.devsecops": "DevSecOps & CI/CD",
    "skills.backup": "Sauvegarde & DRP",
    "skills.automation": "Automatisation & Développement",
    "skills.monitoring": "Monitoring & Observabilité",
    "skills.os": "Systèmes d'Exploitation",
    "skills.virtualization": "Virtualisation & Infrastructure",
    "skills.storage": "Stockage & Données",
    "skills.methodologies": "Méthodologies",
    // Projets
    "projects.title": "Projets Récents",
    "projects.subtitle": "Réalisations et contributions",
    "project.formation.title": "Formation DevOps & CI/CD",
    "project.formation.desc":
      "Dépôt utilisé pour mes formations DevOps couvrant l'automatisation, l'intégration continue et le déploiement continu.",
    "project.formation.link": "Voir sur GitHub",
    "project.ansible.title": "ansible-webapp",
    "project.ansible.desc":
      "Playbooks Ansible pour le déploiement et la configuration automatisée d'applications web avec rôles modulaires.",
    "project.ansible.link": "Voir sur GitHub",
    "project.student.title": "student-list",
    "project.student.desc":
      "Application fullstack démontrant l'interaction entre une API backend et une webapp frontend pour la gestion d'étudiants.",
    "project.student.link": "Voir sur GitHub",
    "project.freijstack.title": "freijstack",
    "project.freijstack.desc":
      "Stack personnalisée regroupant mes outils et configurations préférés pour les projets DevSecOps et infrastructure.",
    "project.freijstack.link": "Voir sur GitHub",
    "project.docker.title": "Docker Applications",
    "project.docker.desc":
      "Collection d'images Docker et configurations pour déployer rapidement des applications en environnements conteneurisés.",
    "project.docker.link": "Private Registry",
    "project.iac.title": "Infrastructure as Code",
    "project.iac.desc":
      "Automatisation de l’infrastructure, du monitoring et des sauvegardes, orchestrée par mes workflows GitHub Actions sécurisés.",
    "project.iac.link": "Voir les Workflows",
    // Expérience
    "experience.title": "Parcours Professionnel",
    "experience.subtitle": "Mon expérience et mes réalisations",
    // Accréditations
    "accreditations.title": "Accréditations",
    "accreditations.subtitle": "Formations et certifications récentes",
    // Contact
    "contact.title": "Parlons Ensemble",
    "contact.subtitle": "Vous avez un projet ? Contactez-moi",
    // Footer
    "footer.home": "Accueil",
    "footer.projects": "Projets",
    "footer.rights": "Tous droits réservés.",
    // Experience details - ACENSI
    "exp.acensi.title": "Spécialiste Cloud & Sécurité – DevSecOps | ACENSI",
    "exp.acensi.period": "2023 – Aujourd'hui",
    "exp.acensi.item1":
      "Conception et déploiement d'une stratégie de sauvegarde « as-code » (Terraform, AWS S3, Commvault/Clumio), réduction des interventions manuelles et temps d'exploitation.",
    "exp.acensi.item2":
      "Automatisation end-to-end CI/CD (Jenkins, GitHub Actions, Ansible AAP) pour pipelines sécurisés et déploiements reproductibles, amélioration des cycles de livraison.",
    "exp.acensi.item3":
      "Renforcement de la sécurité cloud (IAM, SAML, scans Tenable, hardening CIS), réduction majeure des vulnérabilités critiques détectées.",
    "exp.acensi.item4":
      "Mise en place d'observabilité (Prometheus, Grafana) et playbooks d'incident pour réduire le MTTR et améliorer la disponibilité.",
    // Experience details - SQUAD
    "exp.squad.title": "Ingénieur Systèmes – DevSecOps | SQUAD",
    "exp.squad.period": "2022 – 2023",
    "exp.squad.item1":
      "Administration et sécurisation de 3000+ VM dans un contexte SMSI/eIDAS ; mise en place de contrôles et revues de sécurité.",
    "exp.squad.item2":
      "Automatisation du hardening RedHat via Ansible, accélération des mises en conformité et réduction des corrections manuelles.",
    "exp.squad.item3":
      "Containerisation et orchestration de services (Docker, Kubernetes) avec pipelines CI/CD sécurisés.",
    "exp.squad.item4":
      "Accompagnement et formation des équipes DevOps sur les bonnes pratiques DevSecOps et la sécurité du pipeline.",
    // Experience details - ECONOCOM
    "exp.econocom.title": "Ingénieur Infrastructure – DevSecOps | ECONOCOM (Projet ITER)",
    "exp.econocom.period": "2020 – 2022",
    "exp.econocom.item1":
      "Déploiement d'Ansible AWX/AAP et création de playbooks modulaires pour le provisioning et la configuration.",
    "exp.econocom.item2":
      "Automatisation des contrôles d'accès (intégration LDAP) et des procédures de sécurité pour environnements réglementés.",
    "exp.econocom.item3":
      "Mise en place de workflows d'automatisation pour provisioning et gestion du stockage, avec procédures auditables.",
    "exp.econocom.item4":
      "Standardisation des templates et réduction significative du temps de provisionnement et des erreurs manuelles.",
    // Experience details - DIGIMIND
    "exp.digimind.title": "Ingénieur Système R&D - DevOps | DIGIMIND",
    "exp.digimind.period": "Avril 2020 – Août 2020",
    "exp.digimind.item1":
      "Modernisation d'infrastructures multi-datacenters, gain de performance mesurable de +30% (CPU/RPS) livré en 6 mois.",
    "exp.digimind.item2":
      "Mise en place de supervision et gestion des incidents (Centreon, Prometheus) pour améliorer la résilience et réduire le MTTR.",
    "exp.digimind.item3":
      "Traitement et optimisation Big Data (SolrCloud) : tuning d'index et d'architectures pour réduire la latence des requêtes.",
    "exp.digimind.item4":
      "Conduite de migrations et optimisation CDN pour les utilisateurs asiatiques afin d'améliorer l'expérience et la latence réseau.",
    // Experience details - HARDIS
    "exp.hardis.title": "Administrateur Systèmes - CloudOps | HARDIS",
    "exp.hardis.period": "Août 2019 – Mars 2020",
    "exp.hardis.item1":
      "Gestion des incidents et demandes de niveau 2 avec respect des SLA et réduction des escalades vers les équipes d'expertise.",
    "exp.hardis.item2":
      "Automatisation des tâches récurrentes via scripts Shell et PowerShell, diminuant le travail manuel et accélérant les opérations.",
    "exp.hardis.item3":
      "Optimisation des performances serveurs (ESX) et répartition de charge des VMs pour améliorer l'efficience des ressources.",
    "exp.hardis.item4":
      "Rédaction de procédures d'intégration et participation aux actions de conformité (ISO 27001) pour renforcer la gouvernance.",
    // Experience note
    "exp.more.title": "Et d'autres expériences...",
    "exp.more.description":
      "D'autres missions et projets disponibles sur demande ou dans le CV complet. Contactez-moi pour obtenir la liste complète des réalisations et cas clients."
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.experience": "Experience",
    "nav.contact": "Contact",
    // Hero
    "hero.greeting": "👋 Welcome to my portfolio",
    "hero.title": "Christophe FREIJANES",
    "hero.role": "Senior Cloud & Security Specialist - DevSecOps",
    "hero.tagline": "Cloud Security • DevSecOps • Infrastructure as Code • Automation",
    "hero.btn.projects": "View my projects",
    "hero.btn.contact": "Contact me",
    // Hero code block
    "hero.code.role": "Cloud & Security Specialist • 20+ years experience • Montreal (QC, Canada)",
    "hero.code.expertise":
      "• AWS (IAM, EC2, S3, CloudWatch) • Kubernetes • GCP\n" +
      "• Terraform • Ansible (AWX/AAP) • Docker / Podman\n" +
      "• GitHub Actions • GitLab CI • Jenkins • Helm\n" +
      "• Commvault • Clumio • Cohesity • Veeam\n" +
      "• Grafana • Prometheus • Nagios • Centreon",
    "hero.code.motto": "Security-by-design • Zero Trust • Automation-first",
    // Skills
    "skills.title": "Technical Skills",
    "skills.subtitle": "Technologies and tools mastered",
    "skills.cloud": "Cloud & Security",
    "skills.devsecops": "DevSecOps & CI/CD",
    "skills.backup": "Backup & DRP",
    "skills.automation": "Automation & Development",
    "skills.monitoring": "Monitoring & Observability",
    "skills.os": "Operating Systems",
    "skills.virtualization": "Virtualization & Infrastructure",
    "skills.storage": "Storage & Data",
    "skills.methodologies": "Methodologies",
    // Projects
    "projects.title": "Recent Projects",
    "projects.subtitle": "Achievements and contributions",
    "project.formation.title": "DevOps & CI/CD Training",
    "project.formation.desc":
      "Repository used for my DevOps training covering automation, continuous integration and continuous deployment.",
    "project.formation.link": "View on GitHub",
    "project.ansible.title": "ansible-webapp",
    "project.ansible.desc":
      "Ansible playbooks for automated deployment and configuration of web applications with modular roles.",
    "project.ansible.link": "View on GitHub",
    "project.student.title": "student-list",
    "project.student.desc":
      "Fullstack application demonstrating interaction between a backend API and a frontend webapp for student management.",
    "project.student.link": "View on GitHub",
    "project.freijstack.title": "freijstack",
    "project.freijstack.desc":
      "Custom stack bringing together my favorite tools and configurations for DevSecOps and infrastructure projects.",
    "project.freijstack.link": "View on GitHub",
    "project.docker.title": "Docker Applications",
    "project.docker.desc":
      "Collection of Docker images and configurations to quickly deploy applications in containerized environments.",
    "project.docker.link": "Private Registry",
    "project.iac.title": "Infrastructure as Code",
    "project.iac.desc":
      "Automation of infrastructure, monitoring and backups, orchestrated by my secure GitHub Actions workflows.",
    "project.iac.link": "See Workflows",
    // Experience
    "experience.title": "Professional Background",
    "experience.subtitle": "My experience and achievements",
    // Accreditations
    "accreditations.title": "Certifications",
    "accreditations.subtitle": "Recent training and certifications",
    // Contact
    "contact.title": "Let's Talk",
    "contact.subtitle": "Have a project? Contact me",
    // Footer
    "footer.home": "Home",
    "footer.projects": "Projects",
    "footer.rights": "All rights reserved.",
    // Experience details - ACENSI
    "exp.acensi.title": "Cloud & Security Specialist – DevSecOps | ACENSI",
    "exp.acensi.period": "2023 – Present",
    "exp.acensi.item1":
      'Design and deployment of an "as-code" backup strategy (Terraform, AWS S3, Commvault/Clumio), reducing manual interventions and operational time.',
    "exp.acensi.item2":
      "End-to-end CI/CD automation (Jenkins, GitHub Actions, Ansible AAP) for secure pipelines and reproducible deployments, improving delivery cycles.",
    "exp.acensi.item3":
      "Cloud security hardening (IAM, SAML, Tenable scans, CIS hardening), major reduction in critical vulnerabilities detected.",
    "exp.acensi.item4":
      "Implementation of observability (Prometheus, Grafana) and incident playbooks to reduce MTTR and improve availability.",
    // Experience details - SQUAD
    "exp.squad.title": "Systems Engineer – DevSecOps | SQUAD",
    "exp.squad.period": "2022 – 2023",
    "exp.squad.item1":
      "Administration and security of 3000+ VMs in an ISMS/eIDAS context; implementation of security controls and reviews.",
    "exp.squad.item2":
      "RedHat hardening automation via Ansible, accelerating compliance and reducing manual corrections.",
    "exp.squad.item3":
      "Containerization and orchestration of services (Docker, Kubernetes) with secure CI/CD pipelines.",
    "exp.squad.item4":
      "Support and training of DevOps teams on DevSecOps best practices and pipeline security.",
    // Experience details - ECONOCOM
    "exp.econocom.title": "Infrastructure Engineer – DevSecOps | ECONOCOM (ITER Project)",
    "exp.econocom.period": "2020 – 2022",
    "exp.econocom.item1":
      "Deployment of Ansible AWX/AAP and creation of modular playbooks for provisioning and configuration.",
    "exp.econocom.item2":
      "Automation of access controls (LDAP integration) and security procedures for regulated environments.",
    "exp.econocom.item3":
      "Implementation of automation workflows for provisioning and storage management, with auditable procedures.",
    "exp.econocom.item4":
      "Template standardization and significant reduction in provisioning time and manual errors.",
    // Experience details - DIGIMIND
    "exp.digimind.title": "R&D Systems Engineer - DevOps | DIGIMIND",
    "exp.digimind.period": "April 2020 – August 2020",
    "exp.digimind.item1":
      "Multi-datacenter infrastructure modernization, measurable +30% performance gain (CPU/RPS) delivered in 6 months.",
    "exp.digimind.item2":
      "Implementation of monitoring and incident management (Centreon, Prometheus) to improve resilience and reduce MTTR.",
    "exp.digimind.item3":
      "Big Data processing and optimization (SolrCloud): index and architecture tuning to reduce query latency.",
    "exp.digimind.item4":
      "Migration leadership and CDN optimization for Asian users to improve experience and network latency.",
    // Experience details - HARDIS
    "exp.hardis.title": "Systems Administrator - CloudOps | HARDIS",
    "exp.hardis.period": "August 2019 – March 2020",
    "exp.hardis.item1":
      "Level 2 incident and request management with SLA compliance and reduced escalations to expert teams.",
    "exp.hardis.item2":
      "Automation of recurring tasks via Shell and PowerShell scripts, reducing manual work and accelerating operations.",
    "exp.hardis.item3":
      "Server performance optimization (ESX) and VM load balancing to improve resource efficiency.",
    "exp.hardis.item4":
      "Integration procedure documentation and participation in compliance actions (ISO 27001) to strengthen governance.",
    // Experience note
    "exp.more.title": "And more experiences...",
    "exp.more.description":
      "Other missions and projects available upon request or in the complete CV. Contact me for the full list of achievements and client cases."
  },
};

// i18n helpers
function setLanguage(lang) {
  localStorage.setItem("preferredLanguage", lang);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });

  // Update hero code block
  const codeBlock = document.querySelector(".code-block code");
  if (codeBlock && translations[lang]) {
    codeBlock.textContent = `$ whoami
Christophe FREIJANES

$ summary --role
${translations[lang]["hero.code.role"]}

$ expertise --list
${translations[lang]["hero.code.expertise"]}

$ echo "${translations[lang]["hero.code.motto"]}"`;
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
}

// ============================================
// MAIN (single DOMContentLoaded)
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // 1) Seasonal theme (includes favicon + theme-color)
  applySeasonalTheme();

  // Sync theme-color if OS theme changes while open
  const mq = window.matchMedia?.("(prefers-color-scheme: light)");
  mq?.addEventListener?.("change", () => {
    setThemeColorMeta();
    // (optionnel) si tu veux que le rendu du SVG soit recalculé aussi
    // applySeasonalTheme();
  });

  // 2) i18n init
  const savedLang = localStorage.getItem("preferredLanguage");
  const browserLang = navigator.language.split("-")[0];
  const defaultLang = savedLang || (browserLang === "en" ? "en" : "fr");
  setLanguage(defaultLang);

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      setLanguage(lang);
    });
  });

  // 3) Navigation active state on scroll
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("data-section") === current) {
        link.classList.add("active");
      }
    });
  });

  // 4) Smooth scroll for nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.getElementById(this.getAttribute("data-section"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // 5) Hamburger menu toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.querySelector(".nav-menu");

  hamburger?.addEventListener("click", function () {
    this.classList.toggle("active");
    navMenu?.classList.toggle("active");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger?.classList.remove("active");
      navMenu?.classList.remove("active");
    });
  });

  // 6) Observe elements for fade-in
  document
    .querySelectorAll("section, .project-card, .skill-category, .timeline-item")
    .forEach((el) => observer.observe(el));

  // 7) Pointer lumineux + data-alert handlers
  const pointer = document.createElement("div");
  pointer.className = "pointer-lumineux";
  document.body.appendChild(pointer);

  document.addEventListener("mousemove", (e) => {
    pointer.style.left = e.clientX + "px";
    pointer.style.top = e.clientY + "px";
  });

  document.querySelectorAll("[data-alert]").forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      alert(el.getAttribute("data-alert"));
    });
  });

  // 8) Email obfuscation links (data-user / data-domain)
  document.querySelectorAll("[data-user][data-domain]").forEach((link) => {
    link.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        const user = link.getAttribute("data-user");
        const domain = link.getAttribute("data-domain");
        if (!(user && domain)) return;
        const mailto = "mailto:" + user + "@" + domain;

        let w = null;
        try {
          w = window.open(mailto, "_blank");
        } catch (err) {
          w = null;
        }
        if (!w) {
          const tmp = document.createElement("a");
          tmp.href = mailto;
          tmp.target = "_blank";
          tmp.rel = "noopener noreferrer";
          tmp.style.display = "none";
          document.body.appendChild(tmp);
          tmp.click();
          tmp.remove();
        }
      },
      false
    );
  });

  const footerEmail = document.getElementById("footerEmail");
  if (footerEmail) {
    footerEmail.setAttribute("title", "Envoyer un e-mail");
    footerEmail.setAttribute("aria-label", "Envoyer un e-mail");
  }

  // 9) Init captcha (if present)
  if (document.getElementById("captchaQuestion")) generateCaptcha();
  const refresh = document.getElementById("refreshCaptcha");
  if (refresh) refresh.addEventListener("click", () => generateCaptcha(), false);

  // 10) Contact form handling
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameEl = document.getElementById("name");
      const emailEl = document.getElementById("email");
      const subjectEl = document.getElementById("subject");
      const messageEl = document.getElementById("message");
      const captchaAns = document.getElementById("captchaAnswer");

      const name = nameEl ? nameEl.value.trim() : "";
      const email = emailEl ? emailEl.value.trim() : "";
      const subject = subjectEl ? subjectEl.value.trim() : "";
      const message = messageEl ? messageEl.value.trim() : "";

      if (!name || !email || !message) {
        showNotification("Veuillez remplir tous les champs requis", "error");
        return;
      }

      if (!validateEmail(email)) {
        showNotification("Veuillez entrer une adresse email valide", "error");
        return;
      }

      if (name.length > 100) {
        showNotification("Le nom est trop long (max 100 caractères).", "error");
        return;
      }
      if (email.length > 254) {
        showNotification("L'email est trop long (max 254 caractères).", "error");
        return;
      }
      if (subject.length > 150) {
        showNotification("Le sujet est trop long (max 150 caractères).", "error");
        return;
      }
      if (message.length > 2000) {
        showNotification("Le message est trop long (max 2000 caractères).", "error");
        return;
      }

      // Captcha validation
      if (captchaAns) {
        const v = parseInt(captchaAns.value, 10);
        if (isNaN(v) || expectedCaptcha === null || v !== expectedCaptcha) {
          showNotification("Réponse au captcha incorrecte.", "error");
          generateCaptcha();
          captchaAns.value = "";
          return;
        }
      }

      // Client-side sanitization (UX only)
      if (nameEl) nameEl.value = sanitizeInput(name);
      if (subjectEl) subjectEl.value = sanitizeInput(subject);
      if (messageEl) messageEl.value = sanitizeInput(message);

      const submitBtn = contactForm.querySelector(".btn-submit");
      const originalText = submitBtn ? submitBtn.textContent : "Envoyer";
      if (submitBtn) {
        submitBtn.textContent = "Envoi en cours...";
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        console.log("Form data:", {
          name: nameEl?.value,
          email,
          subject: subjectEl?.value,
          message: messageEl?.value,
        });

        showNotification("Message envoyé avec succès! Je vous recontacterai bientôt.", "success");
        contactForm.reset();

        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }, 1200);
    });
  }

  // 11) External links safety: open in new tab
  document.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (!href) return;
    if (href.startsWith("#") || href.startsWith("javascript:")) return;
    if (a.hasAttribute("data-alert")) return;

    if (href.startsWith("http") || href.startsWith("mailto:")) {
      const originalTarget = a.getAttribute("target");
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");

      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (originalTarget === "_blank") return;

        e.preventDefault();

        if (href.startsWith("mailto:")) {
          let w = null;
          try {
            w = window.open(href, "_blank");
          } catch (err) {
            w = null;
          }
          if (!w) window.location.href = href;
          return;
        }

        let w = null;
        try {
          w = window.open(href, "_blank", "noopener");
        } catch (err) {
          w = null;
        }
        if (!w) window.location.href = href;
      });
    }
  });

  // 12) CV DOWNLOAD (keep if button exists)
  const downloadCVBtn = document.getElementById("downloadCV");
  if (downloadCVBtn) {
    downloadCVBtn.addEventListener("click", function () {
      // Si c’est un lien direct, rien à faire ici.
    });
  }

  // 13) Dark mode toggle (optional)
  // Tu peux relier ceci à un bouton: <button id="toggleDark">...</button>
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
  };

  const toggleBtn = document.getElementById("toggleDark");
  if (toggleBtn) toggleBtn.addEventListener("click", toggleDarkMode);

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  // 14) Init log
  console.log("Portfolio loaded and ready!");
});

// ============================================
// PARALLAX EFFECT
// ============================================

window.addEventListener("scroll", function () {
  const scrollY = window.scrollY;
  const heroSection = document.querySelector(".hero");

  if (heroSection && scrollY < window.innerHeight) {
    heroSection.style.backgroundPosition = `center ${scrollY * 0.5}px`;
  }
});

/*
// === BOUTON DE TEST SAISON ===
// Décommente si tu veux forcer et tester les saisons.
// Note: applySeasonalTheme() est globale dans cette version.
document.addEventListener('DOMContentLoaded', function() {
  const testBtn = document.createElement('button');
  testBtn.textContent = '🌦️ Tester saison';
  testBtn.style.cssText = 'position:fixed;bottom:18px;right:18px;z-index:9999;padding:8px 16px;background:#0072c6;color:#fff;border:none;border-radius:6px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.12);font-size:15px;';
  document.body.appendChild(testBtn);
  let testSeason = 0;
  const testSeasons = [
    {month:1, label:'Hiver'},
    {month:4, label:'Printemps'},
    {month:7, label:'Été'},
    {month:10, label:'Automne'}
  ];
  testBtn.addEventListener('click', function(){
    testSeason = (testSeason+1)%testSeasons.length;
    window.__forceSeasonMonth = testSeasons[testSeason].month;
    applySeasonalTheme();
    testBtn.textContent = '🌦️ ' + testSeasons[testSeason].label;
  });
});
*/
