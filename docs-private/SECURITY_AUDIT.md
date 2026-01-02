# 🔒 Sécurité et Audit Docs - FreijStack

Guide complet pour auditer la documentation publique vs. privée et appliquer les bonnes pratiques de sécurité.

**Dernière mise à jour**: Janvier 2026  
**Classification**: Public  
**Audience**: Mainteneurs + DevOps + Développeurs

---

## 📋 Table des Matières

1. [Principes de Sécurité](#principes-de-sécurité)
2. [Classification des Documents](#classification-des-documents)
3. [Directives de Redaction](#directives-de-redaction)
4. [Audit Automatisé](#audit-automatisé)
5. [Processus de Review](#processus-de-review)
6. [Gestion des Accès](#gestion-des-accès)

---

## Principes de Sécurité

### ✅ Philosophie "Secure by Default"

- **Defense in Depth**: Multiples couches de sécurité
- **Least Privilege**: Données sensibles isolées dans `/docs-private`
- **Public by Default**: Sauf indication contraire, docs sont publiques
- **Redaction Progressive**: Masquer uniquement ce qui est nécessaire

### 🎯 Critères d'Exposition

Un document peut être public **si et seulement si**:

```
✅ Aucun secret (clés, tokens, URLs sensibles)
✅ Aucune topologie interne exploitable
✅ Aucune information personnelle/business sensible
✅ Utilise des placeholders pour infos dynamiques
✅ Respecte les normes d'accessibilité
```

---

## Classification des Documents

### 📊 Matrice de Classification

| Classification | Stockage | Accès | Exemple | Sensibilité |
|---|---|---|---|---|
| **PUBLIC** | `/docs/**` | ✅ GitHub, public | Architecture, APIs, guide de déploiement (redacté) | 🟢 Basse |
| **INTERNAL** | `/docs/**` avec redaction | ✅ Membres org GitHub | Setup local, benchmarks, roadmaps | 🟡 Moyenne |
| **CONFIDENTIAL** | `/docs-private/**` | ⚠️ Accès restreint | Credentials, incident reports, configs réelles | 🔴 Haute |
| **SECRET** | Hors repo | 🔒 Secrets Manager | Private keys, master passwords, API keys | 🔴 Critique |

### 📁 Structure Recommandée

```
docs/                          # ✅ Public
├── ARCHITECTURE.md            # Architecture de haut niveau
├── DEPLOYMENT.md              # Guide avec placeholders
├── API_DOCUMENTATION.md       # Endpoints publics
├── TROUBLESHOOTING.md         # Problèmes courants (redacté)
└── README.md                  # Hub de navigation

docs-private/                  # 🔒 Accès restreint
├── CREDENTIALS.md             # Mappings secrets
├── INCIDENT_RESPONSE.md       # Playbooks sensibles
├── ENVIRONMENT_CONFIG.md      # Valeurs réelles .env
├── ACCESS_POLICY.md           # Qui a accès à quoi
└── README.md                  # Index privé

.env                           # 🔓 Toujours .gitignored
.env.example                   # ✅ Versions sans valeurs
.github/                       # Workflows + secrets
└── workflows/
    └── *-deploy.yml          # Refs à ${{ secrets.* }}
```

---

## Directives de Redaction

### 🚨 Patterns Sensibles à Redacter

#### 1️⃣ AWS Credentials
```
# ❌ NON
AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY_ID>
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY

# ✅ OUI
AWS_ACCESS_KEY_ID=<REDACTED>
AWS_SECRET_ACCESS_KEY=<REDACTED>
```

#### 2️⃣ Tokens & Keys
```
# ❌ NON
GITHUB_TOKEN=<GITHUB_TOKEN>
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ✅ OUI
GITHUB_TOKEN=<REDACTED>
JWT_SECRET=<REDACTED>
```

#### 3️⃣ URLs Sensibles
```
# ❌ NON
Slack webhook: <SLACK_WEBHOOK_URL>
Database: <POSTGRES_URI>

# ✅ OUI
Slack webhook: <REDACTED_SLACK_WEBHOOK>
Database: postgresql://<DB_USER>:<DB_PASS>@<DB_HOST>:<DB_PORT>/<DB_NAME>
```

#### 4️⃣ Private IPs / Hostnames
```
# ❌ NON
Connect to 192.168.1.100 with user root

# ✅ OUI
Connect to <VPS_HOST> with user <VPS_USER>
```

#### 5️⃣ API Keys
```
# ❌ NON
STRIPE_SECRET=sk_live_<REDACTED>
OPENAI_API_KEY=sk-proj-<REDACTED>

# ✅ OUI
STRIPE_SECRET=<REDACTED>
OPENAI_API_KEY=<REDACTED>
```

### 📝 Template de Redaction

```markdown
## Configuration Sécurité

Pour activer SAML:

1. Obtenez les credentials depuis votre provider
   - Metadata URL: (disponible dans console d'administration)
   - Entity ID: `<YOUR_ENTITY_ID>`
   - ACS URL: `https://vault.freijstack.com/saml/callback`

2. Mettez à jour secrets:
   ```bash
   gh secret set SAML_METADATA_URL \
     --body "https://idp.example.com/metadata" \
     --repo owner/repo
   ```

3. Vérifiez le déploiement:
   ```bash
   curl -H "Authorization: Bearer $GITHUB_TOKEN" \
     https://api.github.com/repos/owner/repo/actions/secrets
   ```

> ⚠️ **Conseil**: Conservez les credentials originales dans `/docs-private/CREDENTIALS.md`
```

---

## Audit Automatisé

### 🔍 Détection Secrets (ripgrep + expressions régulières)

Exécutez ce script localement pour scanner vos docs:

```bash
#!/bin/bash

echo "🔍 Scanning for potential secrets in docs/"

rg -n --hidden --no-ignore-vcs --type markdown \
  -e "AKIA[0-9A-Z]{16}" \
  -e "-----BEGIN (RSA|OPENSSH|EC) PRIVATE KEY-----" \
  -e "xox[baprs]-[a-z0-9]+" \
  -e "ghp_[A-Za-z0-9]{30,}" \
  -e "AIza[0-9A-Za-z\-_]{35}" \
  -e "https://hooks\.slack\.com/services/[A-Z0-9/]+" \
  -e "discord\.com/api/webhooks/[0-9]{15,}/[A-Za-z0-9_-]{25,}" \
  -e "sk_(live|test)_[0-9a-zA-Z]{20,}" \
  docs docs-private || {
    echo "✅ No obvious secrets detected"
    exit 0
}

echo "⚠️ Potential secrets found - review immediately!"
exit 1
```

### 🤖 GitHub Actions Workflow pour Audit

```yaml
name: Security Audit

on:
  pull_request:
    paths:
      - 'docs/**'
      - 'docs-private/**'
  push:
    branches: [master, develop]

jobs:
  scan-secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install ripgrep
        run: cargo install ripgrep

      - name: Scan for secrets in docs
        run: |
          rg -n --hidden --no-ignore-vcs --type markdown \
            -e "AKIA[0-9A-Z]{16}" \
            -e "-----BEGIN .* PRIVATE KEY" \
            -e "xox[baprs]-" \
            -e "ghp_[A-Za-z0-9]{30,}" \
            -e "AIza[0-9A-Za-z\-_]{35}" \
            -e "https://hooks\.slack\.com/services/" \
            -e "discord\.com/api/webhooks/" \
            docs docs-private || exit 0
        continue-on-error: true

      - name: Check for CloudFormation keys
        run: |
          rg -n "AKIA|ASIA" docs docs-private --type markdown || exit 0

      - name: Check for DB connection strings
        run: |
          rg -n "postgresql://.*:.*@" docs docs-private --type markdown || exit 0

      - name: Validate markdown syntax
        run: |
          rg -n "\.env" docs --type markdown || exit 0
          rg -n "password=" docs --type markdown || exit 0

      - name: Report Results
        if: failure()
        run: |
          echo "⚠️ Security scan found potential issues"
          echo "Please review and redact any sensitive information"
          exit 1
```

### 🛠️ Gitleaks Configuration

Ajoutez `.gitleaksignore` pour les faux positifs:

```
# Ignore code examples
docs/EXAMPLES.md:1234

# Ignore placeholder texts
docs/DEPLOYMENT.md:5678
```

---

## Processus de Review

### ✍️ Checklist pour Nouveau Document Public

Avant de commiter un nouveau doc:

```markdown
## 📋 Pre-commit Checklist

- [ ] Pas de secrets en dur (clés, tokens, URLs sensibles)
- [ ] Pas d'IPs privées ou hostnames internes
- [ ] Placeholders utilisés pour infos dynamiques
  - [ ] `<VPS_HOST>`, `<VPS_USER>`, `<VPS_SSH_KEY>`
  - [ ] `<GITHUB_TOKEN>`, `<API_KEY>`, `<SECRET>`
  - [ ] `<DOMAIN>`, `<EMAIL>`, `<BUCKET>`
- [ ] Aucune capture d'écran montrant des données sensibles
- [ ] Aucun log brut contenant headers/cookies
- [ ] Liens vers `/docs-private` utilisent un langage clair
- [ ] Tests d'accessibilité passés (en-tête, listes, code blocks)
- [ ] Format Markdown valide
- [ ] Images optimisées (< 200KB chacune)
```

### 🔄 PR Review Flow

```
1. PR créée avec changes docs/
   ↓
2. Bot scanning: Gitleaks + ripgrep check
   ↓
3. Si secrets détectés → Auto-comment + request changes
   ↓
4. Humain review: Vérifier redactions + clarté
   ↓
5. Approval + merge
   ↓
6. Publish sur GitHub Pages (si master)
```

### 📊 Matrice d'Approbation

| Document Type | Reviews Requis | Sections Sensibles |
|---|---|---|
| Architecture | 1 maintaineur | Aucune |
| Deployment Guide | 1 maintaineur + 1 DevOps | Secrets section |
| API Docs | 1 développeur | Authentification |
| Incident Response | 2 mainteneurs | Tout le document |
| Access Policy | 2 mainteneurs | Tout le document |

---

## Gestion des Accès

### 🔐 Permissions par Rôle

#### 👤 Développeurs
```
✅ Lecture: /docs/**
✅ Édition: /docs/ARCHITECTURE.md, /docs/DEVELOPMENT.md
❌ Accès: /docs-private/**
❌ Édition: Configs sensibles
```

#### 🔧 DevOps / Mainteneurs
```
✅ Lecture: /docs/** + /docs-private/**
✅ Édition: Tous les documents
✅ Secrets management
✅ Incident response
```

#### 🚀 Release Manager
```
✅ Lecture: /docs/** + /docs-private/** (limité)
✅ Édition: /CHANGELOG.md, /docs/DEPLOYMENT.md
❌ Édition: /docs-private/INCIDENT_RESPONSE.md
```

### 📋 Access Control Policy

```yaml
# GitHub Team Permissions
teams:
  developers:
    permissions: push
    restrictions:
      - docs-private/
      - .github/workflows/
      
  devops:
    permissions: admin
    
  security-team:
    permissions: push
    restrictions:
      - docs-private/INCIDENT_RESPONSE.md
      - docs-private/CREDENTIALS.md
```

### 🔑 Secret Rotation Schedule

| Secret | Rotation | Process |
|---|---|---|
| JWT Keys | Mensuel | workflow + notification |
| DB Passwords | Mensuel | secrets update + restart |
| API Keys | Trimestriel | provider rotation + update |
| SSL Certs | Annuel | Let's Encrypt auto-renew |
| SSH Keys | À la demande | revoke + generate new |

---

## Bonnes Pratiques

### ✨ Top 10 Do's

1. ✅ **Use Placeholders**: `<VPS_HOST>` not `192.168.1.100`
2. ✅ **Version Your Docs**: Semantic versioning in frontmatter
3. ✅ **Link to Private Docs**: "See `/docs-private/CREDENTIALS.md` for real values"
4. ✅ **Example-Driven**: Show `example-config.yml` not real one
5. ✅ **Automate Scans**: CI/CD checks for secrets before merge
6. ✅ **Rotate Regularly**: Monthly secret updates documented
7. ✅ **Audit Trail**: `git log --grep="secret"` should show rotations
8. ✅ **Encrypt Backups**: `/docs-private` backups must be encrypted
9. ✅ **Review Regularly**: Monthly access reviews for `/docs-private`
10. ✅ **Train Team**: Share this guide with all contributors

### ⛔ Top 10 Don'ts

1. ❌ **Never**: Commit `.env` with real values
2. ❌ **Never**: Paste API keys in examples
3. ❌ **Never**: Screenshot dashboards with sensitive data
4. ❌ **Never**: Use generic "password" in docs
5. ❌ **Never**: Log full error messages with stack traces (PII)
6. ❌ **Never**: Share SSH keys in any doc
7. ❌ **Never**: Include webhook URLs directly
8. ❌ **Never**: Document DB connection strings
9. ❌ **Never**: List open ports with real IPs
10. ❌ **Never**: Share customer data or metrics

---

## Templates

### 🔓 Public Document Header

```markdown
# Document Title

**Classification**: 🟢 PUBLIC  
**Last Updated**: January 2026  
**Audience**: Developers + DevOps  
**Linked Docs**: [See `/docs-private/` for sensitive configs](../docs-private/)

> ⚠️ This document uses placeholders like `<VPS_HOST>`. See the [Access Policy](../docs-private/ACCESS_POLICY.md) for real values.

---
```

### 🔒 Private Document Header

```markdown
# Document Title

**Classification**: 🔴 CONFIDENTIAL  
**Last Updated**: January 2026  
**Audience**: DevOps + Security Team ONLY  
**Access Control**: Maintainers only  
**Encryption**: YES (in transit + at rest)

> ⚠️ This document contains sensitive information. Do not share or copy.

---
```

### 📊 Audit Log Template

```markdown
## Audit Log

| Date | Action | Author | Notes |
|---|---|---|---|
| 2026-01-15 | Secret rotation | @christophe | JWT secrets updated |
| 2026-01-01 | Document review | @security-team | All redactions verified |
| 2025-12-15 | Access granted | @admin | New DevOps member added |
```

---

## Ressources

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Gitleaks Documentation](https://gitleaks.io/)
- [ripgrep](https://github.com/BurntSushi/ripgrep)

---

## Questions Fréquentes

### Q: Dois-je documenter comment obtenir les secrets?
**R**: Non. Documentez QUÉ faire (ex: "rotez les JWT"), pas COMMENT (ex: "utiliser cette clé privée").

### Q: Et si quelqu'un commit un secret par erreur?
**R**: Réagissez rapidement:
1. Alert via Discord
2. `git filter-branch` ou `BFG` pour rewrite history
3. Rotate le secret immédiatement
4. Post-mortem dans Slack

### Q: Comment partager `/docs-private` avec des contractors?
**R**: 
1. Créez un GitHub team privée
2. Limitez accès à fichiers spécifiques
3. Utilisez `CODEOWNERS` avec approvals
4. Audit logs mensuels

### Q: Y a-t-il une limite taille `/docs-private`?
**R**: Non, mais gardez-le petit:
- Aucun artifacts ni binaires
- Max 100 fichiers
- Compressez les anciens logs

---

## Support

Questions ou inquiétudes?

📧 Email: security@freijstack.com  
🔗 GitHub Issues: [with `[security]` tag](https://github.com/christophe-freijanes/freijstack/issues)

---

**Maintenu par**: Security & DevOps Team  
**Licence**: Confidential  
**Version**: 1.0.0
