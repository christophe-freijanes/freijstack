# Déploiement

Ce dossier contient des procédures historiques et des références d'exploitation. Plusieurs commandes et hypothèses doivent être rapprochées de la configuration réelle du VPS avant toute utilisation.

| Besoin | Document |
| --- | --- |
| Installation initiale — référence | [DEPLOYMENT.md](DEPLOYMENT.md) |
| SecureVault — référence | [SECUREVAULT_DEPLOYMENT.md](SECUREVAULT_DEPLOYMENT.md) |
| Fonctions avancées SecureVault — référence | [PRO_DEPLOYMENT.md](PRO_DEPLOYMENT.md) |
| Déclencheurs CI/CD actuels | [Fichiers GitHub Actions](../../.github/workflows/README.md) |
| État des composants | [Structure Docker](../01-architecture/DOCKER_STRUCTURE.md) |

## Mise à jour d'un service

1. Identifier le dossier et les fichiers Compose réellement employés par le conteneur.
2. Valider l'image, son origine et les variables nécessaires.
3. Sauvegarder l'identifiant de la version précédente ; préserver les volumes et fichiers de configuration.
4. Déployer seulement le service concerné, sans supprimer les volumes.
5. Vérifier le conteneur, les routes HTTPS et les logs ; restaurer l'image précédente en cas d'échec.

L'authentification SSH par clé, les privilèges du compte distant et l'exécution des anciens workflows nécessitent une validation séparée. Les scripts de réinitialisation du dépôt ne doivent pas être lancés aveuglément sur un checkout contenant des fichiers locaux de production.

[Retour à la documentation](../README.md)
