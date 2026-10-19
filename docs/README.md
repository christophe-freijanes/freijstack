# Documentation technique

Point d'entrée des documents d'architecture, de déploiement et d'exploitation de FreijStack.

| Besoin | Document |
| --- | --- |
| Comprendre le dépôt | [README principal](../README.md) |
| Naviguer par domaine | [Index](00-overview/INDEX.md) |
| Architecture et composants | [Architecture](01-architecture/ARCHITECTURE.md) |
| Composition des conteneurs | [Structure Docker](01-architecture/DOCKER_STRUCTURE.md) |
| CI/CD | [Workflows réels](../.github/workflows/README.md) |
| Déployer et restaurer | [Déploiement](02-deployment/README.md) |
| Exploitation | [Diagnostic](04-operations/TROUBLESHOOTING.md) |
| Sécurité | [Politique du dépôt](../SECURITY.md) |

## Règles documentaires

La configuration versionnée et l'état observé des conteneurs font foi. Les anciens guides sont des références, **pas des commandes de production garanties**.

Toute procédure d'exploitation doit indiquer son périmètre, ses prérequis, sa validation et sa stratégie de retour arrière. Éviter les affirmations de conformité, de disponibilité et de sécurité sans éléments vérifiables.
