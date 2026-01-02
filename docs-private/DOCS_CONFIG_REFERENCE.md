# 🤖 Configuration Auto-Génération Docs

Fichier de configuration pour la génération automatique de la documentation avec CI/CD.

```yaml
# .github/docs-config.yml
documentation:
  # Paramètres de génération
  generate:
    diagrams: true
    index: true
    summary: true
    validate_links: true
    scan_secrets: true
    
  # Formats de sortie
  output:
    formats:
      - markdown     # .md (source)
      - html         # HTML statique (GitHub Pages)
      - pdf          # PDF pour archivage
    
    diagrams:
      - png
      - svg
      - mermaid      # Format source
  
  # Planification
  schedules:
    daily: '0 2 * * *'       # Tous les jours à 2h du matin
    weekly: '0 0 * * 0'      # Chaque dimanche à minuit
    monthly: '0 0 1 * *'     # 1er du mois à minuit
  
  # Patterns de sécurité à détecter
  security:
    patterns:
      - name: AWS Keys
        regex: 'AKIA[0-9A-Z]{16}'
        severity: CRITICAL
        
      - name: Private Keys
        regex: '-----BEGIN .* PRIVATE KEY'
        severity: CRITICAL
        
      - name: GitHub Tokens
        regex: 'ghp_[A-Za-z0-9]{30,}'
        severity: CRITICAL
        
      - name: Database Connections
        regex: 'postgresql://<DB_USER>:<DB_PASSWORD>@'  # Pattern example
        severity: HIGH
        
      - name: Slack Webhooks
        regex: 'https://hooks\.slack\.com/services/'
        severity: HIGH
        
      - name: Discord Webhooks
        regex: 'discord\.com/api/webhooks/'
        severity: HIGH
    
    # Actions si secrets détectés
    on_secret_found: BLOCK
    
    # Fichiers à exclure du scan
    exclude:
      - docs/.generated/
      - docs-private/
      - .git/
  
  # Validation Markdown
  markdown:
    linter: markdownlint-cli2
    strict: false  # Warnings ne bloquent pas
    rules:
      - heading-increment
      - no-trailing-spaces
      - no-multiple-blanks
      - line-length: false  # Désactivé
  
  # Validation Liens
  links:
    check_external: false
    check_internal: true
    fail_on_broken: true
  
  # Publication
  publish:
    # GitHub Pages
    github_pages: true
    branch: gh-pages
    
    # Artifacts
    artifacts: true
    retention_days: 30
    
    # Archive
    archives:
      tar_gz: true
      zip: true
  
  # Notifications
  notifications:
    on_success:
      - slack
      - github_comments
    on_failure:
      - slack
      - email
      - github_issues
    
    slack:
      channel: '#documentation'
      webhook_env: SLACK_WEBHOOK_URL
    
    email:
      recipients:
        - team@freijstack.com
```

## 🔧 Utilisation

### CI/CD Automatique

Le workflow `docs-generate.yml` s'exécute:

1. **À chaque push** sur `master` ou `develop`
2. **Sur schedule** (hebdomadaire)
3. **Manuellement** via `workflow_dispatch`

### Résultats

- ✅ Diagrammes Mermaid convertis en PNG/SVG
- ✅ Index JSON généré
- ✅ Rapport de sécurité
- ✅ Artifacts uploadés
- ✅ GitHub Pages mis à jour (sur master)

### Localement

Pour générer la docs localement:

```bash
# Installation
npm install -g markdown-lint-cli @mermaid-js/mermaid-cli

# Validation Markdown
markdownlint-cli2 'docs/**/*.md'

# Générer diagrams
mmdc -i docs/cicd.mmd -o docs/.generated/cicd.png

# Scan secrets
./scripts/security-check.sh

# Voir le résumé
cat docs/.summary.txt
```

## 📊 Métriques Suivies

Le workflow enregistre:

| Métrique | Description |
|----------|-------------|
| `doc_count` | Nombre total de docs |
| `line_count` | Nombre total de lignes |
| `diagram_count` | Diagrams générés |
| `secret_scans` | Secrets détectés |
| `link_validation` | Liens rompus |
| `generation_time` | Durée génération |

## 🔐 Sécurité

**Les patterns de secrets détectés**:
- AWS: `AKIA*`, `ASIA*`
- GitHub: `ghp_*`, `ghr_*`
- JWT: Décodage automatique
- Webhooks: `slack.com`, `discord.com`
- DB: `postgresql://`, `mysql://`

**Actions**:
- ❌ BLOCK si secret trouvé en public
- ✅ WARN si docstring détecté
- 📧 Notification au team

## 📚 Structure Générée

```
docs/
├── *.md                    # Fichiers source
├── .generated/
│   ├── *.png              # Diagrams PNG
│   ├── *.svg              # Diagrams SVG
│   └── cicd.mmd           # Source Mermaid
├── .index.json            # Index des docs
└── .summary.txt           # Résumé stats

.github/
└── workflows/
    └── docs-generate.yml  # Workflow CI/CD
```

## 🔗 Intégrations

### GitHub Pages

Publié automatiquement sur `master`:

```markdown
https://christophe-freijanes.github.io/freijstack/

Structure:
├── index.html        # Index des docs
├── architecture/     # Diagrammes architecture
├── ci-cd/            # Diagrammes CI/CD
└── security/         # Docs de sécurité
```

### Slack Notifications

Intégration avec Discord/Slack pour:
- Notifier lors de génération complétée
- Alerter si secrets détectés
- Publier résumé stats

## 🛠️ Troubleshooting

### Diagrammes Mermaid non générés

```bash
# Installer mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Tester conversion
mmdc -i docs/cicd.mmd -o /tmp/test.png
```

### Secrets détectés faussement

Ajouter à `.gitleaksignore`:

```
# Pattern: Example code
docs/EXAMPLES.md:1234

# Pattern: Placeholder
docs/DEPLOYMENT.md:5678
```

### Liens rompus

Vérifier chemin relatif:

```bash
# Avant
[Link](docs/DEPLOYMENT.md)

# Après (chemin relatif depuis même dossier)
[Link](./DEPLOYMENT.md)
```

## 📖 Ressources

- [Mermaid Docs](https://mermaid.js.org/)
- [Markdownlint Rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

---

**Maintenu par**: DevOps Team  
**Version**: 1.0.0  
**Dernière mise à jour**: Janvier 2026
