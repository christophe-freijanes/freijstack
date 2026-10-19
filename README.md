# FreijStack

Plateforme personnelle de développement, d'exploitation et de sécurisation d'applications web sur VPS. Le dépôt réunit l'infrastructure conteneurisée, trois services applicatifs et leurs automatisations.

## Périmètre

| Composant | Rôle | Technologies |
| --- | --- | --- |
| [Infrastructure](base-infra/) | Routage HTTP(S) et services partagés | Docker Compose, Traefik, n8n |
| [Portfolio](saas/portfolio/) | Site professionnel bilingue | HTML, CSS, JavaScript, nginx |
| [SecureVault](saas/securevault/) | Gestion de secrets applicative | Node.js, React, PostgreSQL |
| [Registry](saas/registry/) | Stockage et distribution d'images Docker | Docker Registry, interface Joxit |

Le projet couvre le cycle de vie des services : configuration, construction d'images, contrôles qualité, exploitation et diagnostic. Les workflows GitHub Actions sont versionnés dans [`.github/workflows/`](.github/workflows/).

## Architecture

Les applications sont conteneurisées. Traefik assure le routage et la terminaison TLS ; les données persistantes sont gérées par les volumes des services concernés. Chaque application possède sa propre configuration Docker Compose.

```text
Internet → Traefik → Portfolio (nginx)
                   → SecureVault (API, frontend, PostgreSQL)
                   → Registry (images Docker)
                   → n8n
```

Cette vue décrit les composants du dépôt, pas une garantie de haute disponibilité.

## Exécution locale : Portfolio

```bash
docker build -t freijstack/portfolio:local ./saas/portfolio
docker run --rm -p 127.0.0.1:8080:80 freijstack/portfolio:local
```

Ouvrir http://localhost:8080. Pour les autres services, consulter leurs README et leurs prérequis avant de lancer Docker Compose.

## Développement et exploitation

- `develop` : branche par défaut du dépôt.
- `master` : branche utilisée par les workflows historiques de production.
- Déploiement : **ne pas assimiler un push à une mise en ligne validée**. Certaines procédures CI/CD historiques nécessitent encore une revue avant réactivation.
- Avant toute intervention : identifier l'application ciblée, vérifier les volumes, valider l'image et prévoir un retour arrière.

## Documentation

- [Vue d'ensemble et navigation](docs/README.md)
- [Architecture](docs/01-architecture/ARCHITECTURE.md)
- [Workflows GitHub Actions](.github/workflows/README.md)
- [Procédures et limites de déploiement](docs/02-deployment/README.md)
- [Exploitation et diagnostic](docs/04-operations/TROUBLESHOOTING.md)
- [Sécurité](SECURITY.md) · [Contributions](CONTRIBUTING.md)

## Projet

Maintenu par [Christophe FREIJANES](https://www.linkedin.com/in/christophe-freijanes/), spécialiste Plateforme AWS, SRE, DevSecOps et AIOps.

[Portfolio professionnel](https://portfolio.freijstack.com/) · [GitHub](https://github.com/christophe-freijanes)

Licence : consulter [LICENSE](LICENSE) et les éventuelles mentions propres aux composants.
