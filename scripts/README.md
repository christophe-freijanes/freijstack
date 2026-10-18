# Scripts d'administration

Les scripts de ce dossier couvrent les diagnostics, sauvegardes, migrations, contrôles et interventions de maintenance. Leur présence ne signifie pas qu'ils sont tous validés pour la configuration actuelle du VPS.

## Inventaire

| Usage | Scripts |
| --- | --- |
| Diagnostic | `check-traefik-network.sh`, `diagnose-cors.sh`, `diagnose-registration.sh`, `test-registry.sh` |
| Sécurité | `security-check.sh`, `generate-secrets.ps1`, `rotate-secrets.sh` |
| Données | `backup-to-cloud.sh`, `run-migrations.sh` |
| Documentation | `docs-generate.sh`, `docs-generate.ps1` |
| Déploiement historique | `deploy-registry.sh`, `redeploy-portfolio.sh`, `redeploy-portfolio.ps1` |
| Maintenance | `cleanup-registry-images.sh`, `fix-network-issue.sh`, `setup-registry-prod-secrets.sh` |

## Précautions

- **Ne pas exécuter les scripts de redéploiement historiques en production sans revue.** Certains font appel à `root`, arrêtent des services ou suppriment des volumes.
- `deploy-registry.sh` référence une branche `main` alors que le dépôt utilise `develop` et `master`.
- Tester les paramètres, les droits, la destination et l'effet sur les données avant chaque commande mutante.
- Conserver le script et la sortie utiles à l'audit ; ne jamais écrire de secrets dans les logs.

La procédure adaptée à un service doit préciser son périmètre, ses dépendances et son retour arrière.

[Déploiement](../docs/02-deployment/README.md) · [Sécurité](../SECURITY.md)
