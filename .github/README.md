# Configuration GitHub

Ce répertoire centralise les workflows, les règles de contribution et les paramètres d'analyse du code de FreijStack.

## Repères

- [Workflows et état de la chaîne CI/CD](workflows/README.md)
- [Modèle de pull request](pull_request_template.md)
- [Politique de sécurité](../SECURITY.md)
- [Contributions](../CONTRIBUTING.md)

## Changements et déploiements

Les contrôles de qualité et la construction d'images sont distincts de leur mise en production. Les workflows existants ne doivent pas être considérés comme une chaîne entièrement validée tant que l'accès SSH, les privilèges distants et le rollback n'ont pas été testés de bout en bout.

Avant de modifier un workflow : vérifier ses déclencheurs, les permissions demandées, les dépendances et le périmètre applicatif. Les fichiers YAML, et non les anciens guides, décrivent son comportement actuel.
