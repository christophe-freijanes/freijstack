# 📊 Ops - Operations & Monitoring Data

Ce dossier contient les données d'exploitation générées automatiquement par les workflows n8n.

## 📁 Contenu

### `uptime-history.json`

Historique de surveillance uptime des services FreijStack.

**Structure:**
```json
{
  "version": 1,
  "endpoints": {
    "Portfolio (production)": {
      "url": "https://portfolio.freijstack.com/",
      "samples": [],
      "incident_state": {
        "open_issue_number": null,
        "last_down_comment_ts": null,
        "last_recovery_ts": "2026-01-03T12:30:00Z",
        "last_run_ts": "2026-01-03T19:30:00Z"
      }
    }
  }
}
```

**Champs:**
- `open_issue_number`: Numéro de l'issue GitHub d'incident actif (ou `null`)
- `last_down_comment_ts`: Date du dernier commentaire de panne
- `last_recovery_ts`: Date de la dernière récupération
- `last_run_ts`: Date de la dernière vérification

## 🤖 Workflow Associé

Ce fichier est mis à jour automatiquement par:
- **Workflow:** `automation/n8n/ops-incident-auto.json`
- **Fréquence:** Toutes les 30 minutes
- **Méthode:** Commit direct sur branche `master` via GitHub API

## 📈 Utilisation

```bash
# Voir l'état actuel
cat ops/uptime-history.json | jq '.endpoints | to_entries | .[] | {name: .key, state: .value.incident_state}'

# Voir les incidents actifs
cat ops/uptime-history.json | jq '.endpoints | to_entries | .[] | select(.value.incident_state.open_issue_number != null)'
```

## 🔗 Liens Utiles

- [Workflows n8n](../automation/README.md)
- [Guide Monitoring](../docs/MONITORING.md)
- [Issues GitHub - Label incident](https://github.com/christophe-freijanes/freijstack/labels/incident)

---

**Note:** Ce dossier est public et commité sur GitHub.
