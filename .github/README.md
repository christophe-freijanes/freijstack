# 🔄 GitHub Configuration

Configuration et workflows GitHub Actions pour le CI/CD du projet FreijStack.

---

## 📋 Contenu

```
.github/
├── workflows/                      # GitHub Actions workflows (16+)
│   ├── infrastructure-deploy.yml   # Deploy Traefik + n8n + Portfolio
│   ├── securevault-deploy.yml      # Deploy SecureVault (prod/staging)
│   ├── codeql.yml                  # SAST security scanning
│   ├── gitleaks.yml                # Secret detection
│   ├── trivy-scan.yml              # Container vulnerability scanning
│   ├── healthcheck-prod.yml        # Production health checks (24/7)
│   ├── healthcheck-dev.yml         # Development health checks
│   ├── rotate-secrets.yml          # Automated secret rotation
│   ├── release-automation.yml      # Semantic versioning + releases
│   ├── pr-title-automation.yml     # PR title validation
│   └── ...autres workflows
├── pull_request_template.md        # Template et checklist PRs
└── README.md                       # Ce fichier
```

---

## 🚀 Workflows GitHub Actions

### 1. **infrastructure-deploy.yml** - Déploiement Infrastructure

Déploie l'infrastructure centralisée (Traefik, n8n, Portfolio).

**Trigger**:
- Push to `master` branch
- Schedule: `0 */6 * * *` (toutes les 6 heures)

**Jobs**:
1. **Validate & Lint**
   - Docker Compose syntax check
   - YAML validation

2. **Build & Test**
   - Docker image build
   - Health checks
   - Network connectivity tests

3. **Security Scan**
   - Trivy container scanning
   - Gitleaks secret detection
   - CodeQL analysis

4. **Deploy to VPS**
   - SSH connexion au VPS
   - Pull latest images
   - Update docker-compose
   - Restart services
   - Health check post-deploy

**Artifacts**:
- Build logs
- Security scan results
- Deployment report

---

### 2. **securevault-deploy.yml** - Déploiement SecureVault

Déploie SecureVault (prod et staging).

**Triggers**:
- Push to `master` → Production
- Push to `develop` → Staging (éphémère)
- Manual workflow dispatch

**Environments**:

| Branch | Environment | URL | Duration |
|--------|-------------|-----|----------|
| master | Production | vault.freijstack.com | Permanent |
| develop | Staging | vault-staging.freijstack.com | Auto-destroy après tests |

**Workflow Production (master)**:
```
1. Build Backend + Frontend
2. Run Tests (unit, integration)
3. Security Scans (CodeQL, Gitleaks, Trivy)
4. Build Docker Images
5. Push to Registry (si applicable)
6. Deploy to VPS
7. Database Migrations
8. Health Checks
9. Notification (Slack/Discord)
```

**Workflow Staging (develop)**:
```
1-4: Même que production
5. Deploy environment éphémère
6. Run integration tests
7. Run e2e tests
8. Auto-destroy après ~4h (configurable)
9. Report results
```

---

### 3. **codeql.yml** - SAST (Static Application Security Testing)

Analyse de sécurité du code avec GitHub CodeQL.

**Schedule**: Quotidien à 3h du matin

**Analyse**:
- JavaScript/TypeScript
- Python (si applicable)
- SQL injection detection
- XSS vulnerabilities
- Authentication bypass
- Hardcoded credentials

**Rapports**:
- Severity: Critical, High, Medium, Low
- Dashboard: GitHub Security → Code scanning
- PR comments (si trouvé sur feature branch)

---

### 4. **gitleaks.yml** - Secret Detection

Détecte les secrets accidentellement committés.

**Trigger**:
- Tous les commits (push)
- Pull requests
- Scheduled: quotidien

**Détecte**:
- API keys (AWS, GitHub, etc.)
- Private keys (SSH, PGP, etc.)
- Passwords et tokens
- Database credentials
- Encryption keys

**Rules**: `.gitleaks.toml` (configuration complète)

**Remediation si secret détecté**:
1. Revoke le secret sur le service
2. Force push avec secret supprimé
3. Rebase commits
4. Exécuter `git-filter-repo` si nécessaire

---

### 5. **trivy-scan.yml** - Container Vulnerability Scanning

Scanne les images Docker pour vulnérabilités CVE.

**Target images**:
- `backend:latest`
- `frontend:latest`
- `nginx:alpine`
- `postgres:15`

**Vulnerabilities scannées**:
- OS packages (apt, apk, yum)
- Application dependencies (npm, pip, etc.)
- Known CVEs in base images

**Thresholds**:
- Critical: FAIL (build échoue)
- High: WARNING (mais continue)
- Medium/Low: INFO

**Reports**:
- SARIF format (GitHub Security)
- JSON export
- HTML report

---

### 6. **healthcheck-prod.yml** - Production Health Check

Monitore la santé en production 24/7.

**Schedule**: Toutes les 30 minutes

**Tests**:
- HTTP GET `/health` endpoints
- Response time < 2s
- SSL/TLS certificate validity
- Database connectivity
- DNS resolution
- API functionality tests

**Alertes si failure**:
- Slack notification
- GitHub issue creation
- Email to admins

**Metrics collectés**:
- Uptime percentage
- Response times
- Error rates
- Last successful check timestamp

---

### 7. **healthcheck-dev.yml** - Development Health Check

Monitore la santé en staging.

**Schedule**: Chaque heure

**Identique à prod avec**:
- URLs staging (vault-staging, portfolio-staging)
- Moins strict sur timeouts
- Info notifications seulement (pas d'alertes critiques)

---

### 8. **rotate-secrets.yml** - Secret Rotation Automation

Effectue la rotation automatique des secrets.

**Schedule**: `0 0 1 * *` (1er du mois à minuit UTC)

**Actions**:
1. Génère nouvelle `ENCRYPTION_KEY`
2. Re-chiffre tous les secrets SecureVault
3. Backup ancienne clé
4. Update `.env` sur VPS
5. Redéploie application
6. Valide rotation réussie
7. Archive logs de rotation

**Notifications**:
- Slack message avec status
- Email de confirmation
- GitHub issue pour tracking

---

### 9. **release-automation.yml** - Semantic Versioning & Releases

Automatise les releases avec semantic versioning.

**Trigger**: Commit to `master` avec conventional commits

**Conventional Commits**:
- `feat:` → Minor version bump (v1.2.0)
- `fix:` → Patch version bump (v1.2.1)
- `BREAKING CHANGE:` → Major version bump (v2.0.0)

**Workflow**:
```
1. Analyze commits since last release
2. Determine next version
3. Generate CHANGELOG
4. Create Git tag
5. Create GitHub Release
6. Publish artifacts
7. Notify team
```

**Example**:
```
Last version: v1.0.0
Commits: feat: add new feature
         feat: another feature
         fix: bug fix

→ Next version: v1.2.0
```

---

### 10. **pr-title-automation.yml** - PR Title Validation

Valide les titres des pull requests.

**Rules**:
- Commence par un type: `feat:`, `fix:`, `docs:`, etc.
- Format: `type(scope): description`
- Minimum 10 caractères
- Pas de majuscules sauf acronymes

**Examples** ✅:
- `feat(securevault): add 2FA support`
- `fix(portfolio): correct responsive design`
- `docs: update deployment guide`

**Examples** ❌:
- `Update stuff` (no type)
- `FEAT: add feature` (wrong format)
- `x` (too short)

---

## 📋 Pull Request Template

Voir [pull_request_template.md](./pull_request_template.md) pour la checklist complète.

### Sections

- **Type de PR** (Feature, Bugfix, Docs, etc.)
- **Description** détaillée des changements
- **Testing** - Comment tester les changements
- **Checklist** de validation (tests, docs, security)
- **Screenshots** (si applicable pour UI)
- **Related Issues** (#123)

### Exemple

```markdown
## Type
- [x] Feature
- [ ] Bugfix
- [ ] Documentation

## Description
Ajoute support de 2FA dans SecureVault

## Testing
1. Register nouveau compte
2. Login
3. Enable 2FA from settings
4. Verify code validation

## Checklist
- [x] Tests unitaires passent
- [x] Aucun warning CodeQL
- [x] Documentation mise à jour
- [x] CHANGELOG updated

## Related Issues
Closes #456
```

---

## 🔐 Secrets GitHub

Variables sensibles stockées dans GitHub Secrets:

### Infrastructure Secrets

- `SSH_PRIVATE_KEY` - Clé SSH pour VPS
- `VPS_HOST` - IP ou domaine VPS
- `VPS_USER` - Utilisateur SSH

### Application Secrets

- `ENCRYPTION_KEY` - AES-256 key (SecureVault)
- `JWT_SECRET` - JWT signing key
- `DATABASE_PASSWORD` - PostgreSQL password
- `AWS_ACCESS_KEY_ID` - AWS credentials
- `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `AZURE_STORAGE_KEY` - Azure credentials

### Notifications

- `SLACK_WEBHOOK` - Slack notifications
- `DISCORD_WEBHOOK` - Discord notifications
- `GITHUB_TOKEN` - GitHub API access (auto-provided)

---

## 🌿 Branches Strategy

### Main Branches

| Branch | Purpose | Deploy To |
|--------|---------|-----------|
| `master` | Production release | Production VPS |
| `develop` | Development integration | Staging VPS |
| `release-test` | Testing branch | Staging (optional) |

### Feature Branches

```
feature/description         → PR → develop
bugfix/description         → PR → develop
hotfix/production-issue    → PR → master
docs/documentation-update  → PR → develop
```

### Workflow

```
feature branch
    ↓
Pull Request to develop
    ↓ (CI/CD tests)
Code review
    ↓
Merge to develop
    ↓ (Deploy to staging)
Test in staging
    ↓
Merge to master
    ↓ (CI/CD deploys to production)
Release created
```

---

## 🔍 Security & Compliance

### Scanning Tools

1. **CodeQL** - Source code analysis
2. **Gitleaks** - Secret detection
3. **Trivy** - Container scanning
4. **Dependabot** - Dependency updates (auto)

### Status Checks

Tous les PR doivent avoir un **green status** avant merge:

```
✅ GitHub Actions (all workflows pass)
✅ CodeQL security review
✅ Gitleaks scan
✅ Code review approval
✅ Branch protection rules
```

### Branch Protection Rules

Configurés sur `master` et `develop`:

- Require pull request reviews (1+ approvals)
- Require status checks to pass
- Require branches to be up to date
- Require code scanning results
- Dismiss stale PR approvals

---

## 📊 Action Statistics

### Monthly Workflow Runs

- **infrastructure-deploy**: ~90 runs (3× daily + manual)
- **securevault-deploy**: ~60 runs (2× daily)
- **healthcheck-prod**: ~1440 runs (every 30min)
- **healthcheck-dev**: ~720 runs (hourly)
- **CodeQL**: ~30 runs (daily + on PR)

### Typical Job Duration

| Workflow | Duration |
|----------|----------|
| Infrastructure Deploy | 10-15 min |
| SecureVault Deploy | 15-20 min |
| Health Checks | 2-3 min |
| Security Scans | 5-10 min |
| Release Automation | 3-5 min |

### Cost Estimate (GitHub Actions)

- Free tier: 2000 minutes/month
- Current usage: ~1500 minutes/month
- **No additional cost** (within free tier)

---

## 🛠️ Troubleshooting Workflows

### Workflow fails with "Runner timeout"

**Cause**: Job takes > 360 minutes

**Solution**:
- Optimize slow steps (caching, parallelization)
- Split into multiple jobs
- Increase timeout if needed

---

### Secret not available in job

**Cause**: Secret not configured in GitHub

**Solution**:
```bash
# Configure secret
gh secret set SECRET_NAME --body "value"

# List all secrets
gh secret list

# Delete old secret
gh secret delete OLD_SECRET_NAME
```

---

### Docker image push fails

**Cause**: Registry credentials missing or expired

**Solution**:
- Regenerate Docker Hub token
- Update GitHub secret: `DOCKER_PASSWORD`
- Verify registry endpoint

---

### Deployment fails "SSH: Permission denied"

**Cause**: SSH key not configured or permissions wrong

**Solution**:
```bash
# Re-generate and configure SSH key
./scripts/setup-ssh-key.sh

# Update GitHub secret: SSH_PRIVATE_KEY
gh secret set SSH_PRIVATE_KEY < ~/.ssh/id_rsa
```

---

## 📚 Documentation Complète

- **CI/CD Architecture**: [../docs/CI_CD_ARCHITECTURE.md](../docs/CI_CD_ARCHITECTURE.md)
- **Automation Guide**: [../docs/AUTOMATION_GUIDE.md](../docs/AUTOMATION_GUIDE.md)
- **Deployment Guide**: [../docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)
- **Security Policy**: [../SECURITY.md](../SECURITY.md)

---

## 🔗 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Secrets Management](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

**Créé par**: Christophe FREIJANES  
**Dernière mise à jour**: Janvier 2026  
**Version**: 2.0.0  
**Status**: ✅ Production Ready
