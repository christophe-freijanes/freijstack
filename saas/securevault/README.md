# SecureVault

Application web de gestion de secrets, composée d'une API Node.js, d'un frontend React et d'une base PostgreSQL.

## Composition

| Service | Rôle |
| --- | --- |
| `postgres` | Persistance des données |
| `backend` | API et logique applicative |
| `frontend` | Interface web |

Les images et paramètres sont définis dans [`docker-compose.yml`](docker-compose.yml). Les variables d'environnement requises doivent être définies hors du contrôle de version.

## Développement et validation

- Examiner les dépendances et les fichiers d'environnement d'exemple avant exécution.
- Tester séparément API, frontend et migrations sur une base non productive.
- Ne pas présumer des garanties cryptographiques ou de conformité sans test et revue du code concernés.
- Vérifier la configuration Traefik, les secrets d'authentification et les routes réseau.

## Exploitation

La base PostgreSQL utilise un volume persistant. **Ne pas supprimer ou recréer les volumes lors d'une mise à jour applicative.** Conserver un plan de restauration et valider les migrations avant déploiement.

[Procédures historiques](../../docs/02-deployment/SECUREVAULT_DEPLOYMENT.md) · [Politique de sécurité](../../SECURITY.md)
