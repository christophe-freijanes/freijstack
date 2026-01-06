# 🔒 Politique de Sécurité - FreijStack

## Vue d'ensemble

Ce document décrit les mesures de sécurité et les bonnes pratiques pour protéger le dépôt FreijStack.

---

# 🛡️ Structure Sécurité Centralisée (2026)

Depuis janvier 2026, la sécurité CI/CD et les scripts sont harmonisés pour une maintenance optimale :

## 1. Workflows CI/CD
- **.github/workflows/security-ci.yml** : Unifie PR, production, nightly (SAST, secrets, Trivy, DAST, etc.)
- **.github/workflows/00-core-security-ci.yml** : Orchestrateur réutilisable appelé par le workflow principal

## 2. Scripts Sécurité
- **scripts/security-check.sh** : Script unique pour toutes les vérifications pré-commit (fichiers sensibles, secrets, debug, etc.)
- Les autres scripts sécurité ont été supprimés (voir historique Git si besoin)

## 3. Documentation
- **SECURITY.md** (ce fichier) : Point d’entrée unique pour toutes les pratiques et procédures sécurité

## 4. Bonnes pratiques DevSecOps
- Centralisation, automatisation, suppression des doublons
- Score de sécurité GitHub surveillé en continu
- Utilisation de Gitleaks, Trivy, CodeQL, Dependabot

---

> **Mise à jour 2026 :**
> - Un seul workflow sécurité CI/CD pour tous les contextes
> - Un seul script shell principal pour les checks sécurité
> - Documentation centralisée ici
> - Suppression des fichiers/scripts redondants

---

## 📋 Fichiers Sensibles à NE JAMAIS Commiter

### 1. Variables d'Environnement
- ❌ `.env` (production)
- ❌ `.env.local`
- ❌ `.env.*.local`
- ✅ `.env.example` (template avec valeurs vides)

**Raison**: Contient secrets, tokens, mots de passe

## 🔒 Politique de Sécurité - FreijStack
- ❌ `*.pem`, `*.key`, `*.crt`
- ❌ Clés SSH privées (`id_rsa`, `id_ed25519`)

**Raison**: Permettent l'accès aux systèmes
## 🛡️ Structure Sécurité Centralisée (2026)
### 3. Credentials & Authentification
- ❌ `credentials.json` (Google, AWS)
- ❌ Database passwords

- ❌ Bases de données (`*.db`, `*.sqlite`)

## ✅ Bonnes Pratiques
```bash
cp .env.example .env
**À ne pas faire :**
```bash

**Pour le développement local**:
```


---

## 🏆 Security Score & Tableau de bord GitHub

Le dépôt utilise le **Security Score** GitHub, visible dans l’onglet "Security" du repository. Ce score agrège :
- Détection de secrets (Gitleaks)
- Vulnérabilités de dépendances (Dependabot)
- Analyse de code (CodeQL)
- Scans d’images (Trivy)
- Bonnes pratiques de configuration

**Objectif :** Maintenir un score de sécurité le plus élevé possible (idéalement 100 %).

### Bonnes pratiques :
- Corriger rapidement toutes les alertes de sécurité GitHub
- Activer toutes les protections proposées (branch protection, secret scanning, etc.)

### 3. Clés SSH pour GitHub Actions
```bash
# Copier la clé **PRIVÉE** dans GitHub Secrets
cat ~/.ssh/github_actions

# Copier la clé **PUBLIQUE** sur le VPS
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
```

### 4. Audit des Fichiers Trackés
```bash
# Vérifier qu'aucun .env n'est tracké
git ls-files | grep -E '\.env|\.key|\.pem'

# Vérifier les secrets potentiels
gitleaks detect --verbose
```

---

## 🔍 Gitleaks - Prévention Automatique


### Configuration: `.github/workflows/main.yml`
```yaml
- name: Run Gitleaks
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Configuration locale:
```bash
# Installer gitleaks
brew install gitleaks  # ou curl/wget

# Scanner avant commit
gitleaks detect --verbose

# Scanner historique Git
gitleaks detect --source git --verbose
```

### Fichier d'ignore: `.gitleaksignore`
```
saas/securevault/README.md:example-key:42
```
- [ ] ✅ Aucune clé SSH (`*.key`, `*.pem`)
- [ ] ✅ Aucun `credentials.json`
- [ ] ✅ Aucune base de données (`*.db`, `*.sqlite`)
- [ ] ✅ Aucun token/API key en dur
- [ ] ✅ `.gitignore` à jour
- [ ] ✅ `gitleaks detect` passe

---

## 🚨 Si un Secret a Été Commité

### 1. Action Immédiate
```bash
# NE PAS pousser vers le serveur si possible
git reset HEAD~1              # Annuler le commit
git checkout -- .env          # Restaurer fichier local
```

## 2. Mettre à jour sur tous les systèmes (GitHub, VPS, etc.)
## 3. Invalider l'ancienne clé

## Nettoyer l'historique Git (dangereux!)
git filter-branch --tree-filter 'rm -f .env' HEAD
git push --force-with-lease
```

### 3. Notifier
- Alerter l'équipe immédiatement
- Vérifier les logs d'accès
- Changer les mots de passe associés
---

## 🔐 Secrets GitHub Actions

### Créer des Secrets
**Settings → Secrets and variables → Actions → New repository secret**

```yaml
VPS_HOST       # IP/domaine du VPS
VPS_USER       # Utilisateur SSH
VPS_SSH_KEY    # Clé SSH PRIVÉE
JWT_SECRET     # Secret JWT
```
### Utiliser les Secrets
```yaml
- name: Deploy
  env:
    MY_SECRET: ${{ secrets.MY_SECRET }}
  run: echo "Using secret safely"
```

⚠️ **Les secrets ne s'affichent JAMAIS dans les logs**
---

## 🔑 Gestion des Clés SSH

### Générer une clé dédiée
```bash
ssh-keygen -t ed25519 -C "github-actions@freijstack" -f ~/.ssh/gh-actions
```

### Format à mettre dans GitHub Secrets
```
-----BEGIN OPENSSH PRIVATE KEY-----
[EXAMPLE — DO NOT USE REAL KEYS]
-----END OPENSSH PRIVATE KEY-----
```

### Ajouter la clé publique et permissions
```bash
cat ~/.ssh/gh-actions.pub >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```
---

## 📊 Scanning Continu

### CodeQL (GitHub-native)
Détecte les failles de sécurité dans le code:
- Injection SQL
- XSS
- Authentification faible

### Trivy (Images Docker)
Scanne les images Docker pour vulnérabilités:
```bash
trivy image nom-image:tag


---

## 🛡️ Conformité & Standards

| Standard | Implémentation |
|----------|----------------|
| **OWASP Top 10** | CodeQL scanning |
| **CWE** | Gitleaks + Trivy |
| **GDPR** | Pas de données personnelles stockées |
| **CSP** | Headers Content-Security-Policy |
| **HTTPS** | Traefik + ACME/Let's Encrypt |

---

## 📞 Incident Response

### En cas de fuite de secret:

1. **Immédiat** (< 1h)
   - Invalider la clé/le token
   - Générer un nouveau secret
   - Mettre à jour tous les services

2. **Court terme** (< 24h)
   - Nettoyer l'historique Git si nécessaire
   - Notifier l'équipe/clients
   - Créer un incident report

3. **Long terme**
   - Audit des accès
   - Post-mortem
   - Améliorer les procédures

---

## 📚 Ressources

- [GitHub Security Hardening](https://docs.github.com/en/code-security)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [Trivy Documentation](https://github.com/aquasecurity/trivy)

---

**Créé par**: Christophe FREIJANES  
**Date**: Décembre 2025  
**Statut**: 🔒 Active - Mises à jour régulières
