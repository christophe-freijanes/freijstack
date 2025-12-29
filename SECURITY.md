# 🔒 Politique de Sécurité - FreijStack

## Vue d'ensemble

Ce document décrit les mesures de sécurité et les bonnes pratiques pour protéger le dépôt FreijStack.

---

## 📋 Fichiers Sensibles à NE JAMAIS Commiter

### 1. Variables d'Environnement
- ❌ `.env` (production)
- ❌ `.env.local`
- ❌ `.env.*.local`
- ✅ `.env.example` (template avec valeurs vides)

**Raison**: Contient secrets, tokens, mots de passe

### 2. Clés Cryptographiques
- ❌ `*.pem`, `*.key`, `*.crt`
- ❌ Clés SSH privées (`id_rsa`, `id_ed25519`)
- ❌ Certificats SSL/TLS

**Raison**: Permettent l'accès aux systèmes

### 3. Credentials & Authentification
- ❌ `credentials.json` (Google, AWS)
- ❌ API keys
- ❌ OAuth tokens
- ❌ Database passwords

**Raison**: Donnent accès aux services externes

### 4. Données Privées
- ❌ Bases de données (`*.db`, `*.sqlite`)
- ❌ Backups sensibles
- ❌ Fichiers logs contenant secrets

---

## ✅ Bonnes Pratiques

### 1. Utiliser `.env.example`
```bash
# ✅ BON
cp .env.example .env
# Remplir les valeurs réelles seulement localement

# ❌ MAUVAIS
git add .env
```

### 2. Gérer les Secrets Correctement

**Pour le développement local**:
```bash
# Créer un fichier .env non-tracké
echo "JWT_SECRET=votre-secret-ici" >> .env
echo ".env" >> .gitignore
```

**Pour la production** (GitHub Actions):
- Utiliser **GitHub Secrets** (Settings → Secrets)
- Accès via `${{ secrets.MA_CLE }}`

**Pour le VPS**:
- Créer les fichiers `.env` **directement sur le VPS**
- Ne jamais les pousser via Git

### 3. Clés SSH pour GitHub Actions
```bash
# Générer une clé SSH dédiée
ssh-keygen -t ed25519 -f ~/.ssh/github_actions -N ""

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

Le projet inclut **Gitleaks** dans la CI/CD pour détecter les secrets accidentels.

### Configuration: `.github/workflows/main.yml`
```yaml
- name: Run Gitleaks
  uses: gitleaks/gitleaks-action@v2
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
# False positives (documentations, exemples)
saas/securevault/README.md:example-key:42
```

---

## 📝 Checklist de Sécurité

Avant chaque commit:

- [ ] ✅ Aucun `.env` non-example
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

### 2. Si déjà poussé sur GitHub
```bash
# Rotation des secrets
# 1. Générer une nouvelle clé/token
# 2. Mettre à jour sur tous les systèmes (GitHub, VPS, etc.)
# 3. Invalider l'ancienne clé

# Nettoyer l'historique Git (dangereux!)
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
DB_PASSWORD    # Mot de passe base de données
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
MIGfMA0GCSq...
... (contenu complet)
-----END OPENSSH PRIVATE KEY-----
```

### Permissions sur le VPS
```bash
# Ajouter la clé publique
cat ~/.ssh/gh-actions.pub >> ~/.ssh/authorized_keys

# Permissions correctes
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
```

### Dependabot
Alertes automatiques pour dépendances vulnérables:
- `package.json` (npm)
- `package-lock.json`
- `Dockerfile`

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
