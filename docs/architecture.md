# Architecture du Projet freijstack.com

Ce document décrit l'architecture globale du dépôt GitHub `freijstack` et les stratégies de déploiement pour le site personnel de Christophe FREIJANES, `freijstack.com`.

## 1. Vue d'ensemble du Dépôt GitHub

Le dépôt `freijstack` est structuré pour héberger plusieurs composants distincts, tous liés au domaine `freijstack.com`. L'objectif est de démontrer les compétences en DevSecOps de Christophe FREIJANES à travers un portfolio, un blog, une landing page et des applications SaaS démonstratives.

```
freijstack/
├── .github/                     # Workflows GitHub Actions pour CI/CD
├── blog/                        # Blog personnel (contenu statique)
├── docs/                        # Documentation du projet (ce fichier, etc.)
├── landing/                     # Page d'accueil principale (freijstack.com)
├── package.json                 # Dépendances et scripts globaux (optionnel)
├── portfolio/                   # Portfolio interactif
│   ├── public/                  # Fichiers statiques (HTML, CSS, JS)
│   └── src/                     # Code source (si framework JS)
├── saas/                        # Répertoire pour les applications SaaS démonstratives
│   ├── app1/                    # Première application SaaS (backend, frontend, Dockerfile)
│   ├── app2/                    # Deuxième application SaaS (backend, frontend, Dockerfile)
│   └── README.md                # Description des applications SaaS
└── README.md                    # README principal du dépôt
```

## 2. Composants Principaux

### 2.1. Landing Page (`/landing`)

*   **Description** : La page d'accueil principale du site, servant de point d'entrée pour les visiteurs.
*   **Technologies** : HTML, CSS, JavaScript (potentiellement un framework léger ou un générateur de site statique comme Astro ou Next.js si le besoin évolue).
*   **Déploiement** : Fichiers statiques servis à la racine de `freijstack.com`.

### 2.2. Portfolio (`/portfolio`)

*   **Description** : Présentation des projets, compétences et expériences professionnelles de Christophe, inspirée d'un design moderne.
*   **Technologies** : HTML, CSS, JavaScript (actuellement pur, extensible vers React/Vue/Svelte pour plus d'interactivité).
*   **Déploiement** : Fichiers statiques servis sous `freijstack.com/portfolio`.

### 2.3. Blog (`/blog`)

*   **Description** : Contient les articles de blog existants de Christophe. La nature statique du blog facilite son intégration.
*   **Technologies** : Fichiers HTML/Markdown générés (par exemple, par Jekyll, Hugo, Astro).
*   **Déploiement** : Fichiers statiques servis sous `freijstack.com/blog`.

### 2.4. Applications SaaS (`/saas`)

*   **Description** : Répertoire pour héberger des applications logicielles en tant que service (SaaS) démonstratives. Chaque `appX` a sa propre structure pour simuler un microservice complet.
*   **Structure de chaque App SaaS** :
    *   `backend/` : Code source du backend (ex: Python/Flask, Node.js/Express, Go).
    *   `frontend/` : Code source du frontend (ex: React, Vue, Angular).
    *   `Dockerfile` : Pour la conteneurisation de l'application.
*   **Technologies** : Variables par application (Python, Go, Node.js, Docker, Kubernetes).
*   **Déploiement** : Les applications SaaS sont conçues pour être conteneurisées et peuvent être déployées indépendamment, potentiellement sous des sous-domaines (ex: `app1.freijstack.com`) ou des chemins spécifiques sur le serveur Hostinger.

## 3. Stratégie de Déploiement CI/CD

Le déploiement est automatisé via GitHub Actions vers l'hébergement Hostinger, en utilisant SSH pour la connexion et le transfert de fichiers.

### 3.1. Outils de Déploiement

*   **GitHub Actions** : Orchestre les workflows de CI/CD.
*   **`appleboy/ssh-action`** : Action GitHub pour exécuter des commandes SSH et transférer des fichiers.
*   **SSH** : Protocole sécurisé pour la connexion au serveur Hostinger.
*   **`scp`** : Utilisé pour copier des fichiers sur le serveur distant.

### 3.2. Secrets GitHub Requis

Les informations sensibles sont stockées en toute sécurité dans les secrets du dépôt GitHub :

*   `SSH_PRIVATE_KEY` : Clé SSH privée pour l'authentification sur Hostinger.
*   `SSH_HOST` : Adresse IP ou nom d'hôte du serveur Hostinger.
*   `SSH_USERNAME` : Nom d'utilisateur SSH pour la connexion Hostinger.
*   `DEPLOY_PATH_ROOT` : Chemin absolu sur le serveur Hostinger où les fichiers du site seront déployés (ex: `/home/uXXXXX/domains/freijstack.com/public_html`).
*   `DOCKER_USERNAME` (pour SaaS) : Nom d'utilisateur pour le registre Docker (ex: Docker Hub).
*   `DOCKER_PASSWORD` (pour SaaS) : Mot de passe/jeton pour le registre Docker.

### 3.3. Workflows GitHub Actions

*   **`.github/workflows/main.yml`** :
    *   **Déclencheur** : `push` sur la branche `main`.
    *   **Responsabilités** : Déploiement de la `landing page`, du `portfolio` (fichiers statiques de `portfolio/public`), et du `blog` (fichiers statiques de `blog/`).
    *   **Étapes** : Checkout du code, puis pour chaque composant, connexion SSH pour créer/nettoyer le répertoire de destination et copier les fichiers.

*   **Workflows SaaS dédiés (conceptual)** :
    *   **`.github/workflows/saas-app1-deploy.yml`** (exemple)
    *   **Déclencheur** : `push` sur la branche `main` avec des modifications dans `saas/app1/**`.
    *   **Responsabilités** : Construire l'image Docker de l'application SaaS, la pousser vers un registre (ex: Docker Hub), puis se connecter au serveur Hostinger pour déployer/redémarrer le conteneur (via `docker compose` ou `kubectl` si Kubernetes est configuré sur un VPS).

## 4. Hébergement et Serveur Web (Hostinger)

*   **Configuration DNS** : Le nom de domaine `freijstack.com` pointe vers l'adresse IP du serveur Hostinger.
*   **Configuration du serveur web (Nginx/Apache)** : Sur un VPS Hostinger, Nginx ou Apache sera configuré pour :
    *   Servir la `landing page` à la racine (`/`).
    *   Servir le `portfolio` sous `/portfolio`.
    *   Servir le `blog` sous `/blog`.
    *   Gérer les applications `saas` soit via des sous-domaines (nécessitant une configuration DNS et Nginx/Apache) soit via des chemins spécifiques avec reverse proxy vers les conteneurs Docker.

## 5. Considérations DevSecOps

*   **Sécurité des Secrets** : Utilisation des secrets GitHub pour stocker les informations sensibles.
*   **Automatisation** : CI/CD complet avec GitHub Actions pour réduire les erreurs manuelles et garantir des déploiements cohérents.
*   **Conteneurisation (SaaS)** : Utilisation de Docker pour isoler les applications SaaS et faciliter la portabilité.
*   **Infrastructure as Code (potentiel futur)** : Possibilité d'intégrer Terraform ou Ansible pour la gestion de l'infrastructure sur un VPS Hostinger.
*   **Qualité du code** : Intégration future de linters, tests unitaires et scans de sécurité (SAST/DAST/SCA) dans les workflows GitHub Actions.

Cette architecture fournit une base solide pour un site personnel évolutif et professionnel, mettant en valeur des pratiques modernes de développement et d'opérations sécurisées.
