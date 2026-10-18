# Infrastructure partagée

Ce répertoire définit les services d'infrastructure via [Docker Compose](docker-compose.yml).

## Composants

| Service | Usage |
| --- | --- |
| Traefik | Routage HTTP(S), terminaison TLS et découverte des services Docker |
| n8n | Orchestration de workflows |
| Réseaux Docker | Connexion aux services applicatifs concernés |
| Volumes | Persistance des données et paramètres des services |

Les applications sont décrites séparément dans [`saas/`](../saas/README.md). Les réseaux et leurs noms doivent être cohérents avec les configurations Compose des applications.

## Prérequis

- Docker Engine et Docker Compose.
- Domaines, certificats et configuration Traefik adaptés à l'environnement.
- Variables d'environnement et secrets fournis **hors du dépôt**.
- Inventaire des conteneurs et volumes déjà présents sur l'hôte.

## Vérification

```bash
docker compose -f base-infra/docker-compose.yml config
docker compose -f base-infra/docker-compose.yml ps
```

Ces commandes s'exécutent depuis la racine du dépôt ; la seconde nécessite l'accès au Docker Engine.

**Ne pas démarrer ou recréer la stack depuis un simple exemple de documentation.** Avant une intervention de production, comparer les fichiers locaux, les réseaux et les volumes à la configuration réellement en service.

[Architecture](../docs/01-architecture/ARCHITECTURE.md) · [Sécurité](../SECURITY.md)
