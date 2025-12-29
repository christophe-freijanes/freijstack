# Architecture du Projet freijstack.com

Ce document décrit l'architecture actuelle de `freijstack` et le déploiement de `freijstack.com` (production et staging), basée sur un VPS Docker avec Traefik et Nginx.

## 1. Structure du dépôt

```
freijstack/
├── portfolio/              # Site portfolio (HTML/CSS/JS)
├── saas/
│   ├── app1/               # Démo SaaS 1 (Dockerfile + README)
│   └── app2/               # Démo SaaS 2 (Dockerfile + README)
├── docs/                   # Documentation (ce fichier, README)
├── .github/workflows/      # CI/CD GitHub Actions
├── package.json            # Dépendances/outils
└── README.md               # README racine
```

## 2. Composants déployés

### 2.1 Portfolio
- Frontend statique: HTML5/CSS3/JS (vanilla)
- Sécurité: Content Security Policy (CSP) dans `portfolio/index.html`
- Responsif: breakpoints `≤768px`, `≤480px`, `≤360px`
- Production: `https://portfolio.freijstack.com`
- Staging: `https://portfolio-staging.freijstack.com`

### 2.2 SaaS (démos)
- `saas/app1` et `saas/app2`: images Docker et documentation
- Non déployés publiquement par défaut; prêts pour conteneurisation et orchestration

### 2.3 Automation (optionnel)
- `automation.freijstack.com`: n8n (workflow automation) via Traefik (si activé sur VPS)

## 3. Hébergement (VPS Docker)

- OS: Ubuntu 22.04 LTS
- Orchestration: Docker Compose v2
- Reverse proxy: Traefik (TLS via Let's Encrypt/ACME)
- Serveur statique: Nginx (2 conteneurs)

### 3.1 Routage Traefik
Routers et services déclarés pour chaque sous-domaine:
- `portfolio.freijstack.com` → service `portfolio` (nginx)
- `portfolio-staging.freijstack.com` → service `portfolio-staging` (nginx)
- `automation.freijstack.com` → service `n8n` (optionnel)

TLS: certificats gérés automatiquement par Traefik.

### 3.2 Nginx (conteneurs distincts)
Deux conteneurs Nginx serveurs de fichiers statiques:
- Montages:
    - `/srv/www/portfolio` → `/usr/share/nginx/html`
    - `/srv/www/portfolio-staging` → `/usr/share/nginx/html`
- Traefik pointe directement vers ces services (pas de middleware de réécriture complexe).

## 4. DNS & Réseau

- DNS A records: sous-domaines pointant vers l'IP du VPS
- TLS: Let's Encrypt via Traefik (ACME challenge)
- Accès public: HTTPS obligatoire

## 5. CI/CD (GitHub Actions)

Workflows clés dans `.github/workflows/main.yml`:
- Validation & sécurité:
    - CodeQL (SAST), Gitleaks (secrets), Trivy (vulnérabilités)
- Build & optimisation:
    - Minification CSS via `csso` (flag `--no-restructure`)
    - Minification JS via `terser`
- Déploiement:
    - `rsync` sécurisé vers le VPS: mise à jour de `/srv/www/portfolio*`
    - Nettoyage des backups: conservation des 3 derniers, purge anciens
    - Redémarrage Traefik post-déploy pour recharger routes/certs
- Artefacts:
    - `style.min.css` et `script.min.js` générés et utilisés en production

Branches cibles:
- `develop` → staging (`portfolio-staging.freijstack.com`)
- `master` → production (`portfolio.freijstack.com`)

## 6. Sécurité & Gouvernance

- CSP stricte dans le portfolio; pas de trackers externes
- `.gitignore`: secrets et artefacts sensibles ignorés
- README consistency workflow: exige mise à jour des README lors de modifications de dossiers
- CODEOWNERS: revue PR requise (avec branch protection)
- SECURITY.md: divulgation responsable et pratiques de durcissement

## 7. Flux de requête (schéma)

```
Utilisateur → DNS → Traefik (TLS) → Router (Host) → Service Nginx → Fichiers statiques
                                                                                     └→ n8n (automation) [optionnel]
```

## 8. Arborescence serveur (VPS)

```
/srv/www/
├── portfolio/            # Production (branch master)
└── portfolio-staging/    # Staging (branch develop)
```

## 9. Notes de maintenance

- Toujours vérifier les pages sur mobile (≤480px et ≤360px)
- Éviter les réécritures Traefik complexes; préférer services dédiés
- Ne jamais committer de secrets (`.env`, clés, certificats)
- Utiliser le PR template pour valider README, sécurité, CI et accessibilité.
