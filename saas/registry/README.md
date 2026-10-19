# Docker Registry

Registre privé d'images Docker avec une interface web Joxit, publié derrière Traefik.

## Fichiers

- [`docker-compose.yml`](docker-compose.yml) : configuration de référence.
- [`docker-compose.prod.yml`](docker-compose.prod.yml) : configuration de production versionnée.
- [`config.yml`](config.yml) : configuration du registre.
- [`generate-htpasswd-dynamic.sh`](generate-htpasswd-dynamic.sh) : utilitaire d'authentification.

## Points de contrôle

- Le registre contient des **données persistantes** : les conserver lors des mises à jour.
- Le fichier `.htpasswd` et les variables de connexion ne doivent pas être divulgués.
- La configuration de production versionnée n'est pas nécessairement identique aux corrections appliquées localement sur le VPS.
- **Attention :** le port `5000:5000` du Compose versionné expose potentiellement l'écoute sur toutes les interfaces. Vérifier le binding réellement utilisé sur l'hôte avant tout redéploiement.
- Préserver le stockage du Registry et les images utilisées par Portfolio et SecureVault.

## Diagnostic non destructif

```bash
docker ps --filter name=registry
docker inspect registry --format '{{.Image}}'
docker logs --tail 50 registry
```

Ces commandes servent à examiner l'état ; elles ne modifient ni conteneurs ni volumes. Ne pas lancer `docker compose down -v` ou un nettoyage d'images sans procédure de sauvegarde et inventaire des références.

[Infrastructure](../../base-infra/README.md) · [Sécurité](../../SECURITY.md)
