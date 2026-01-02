# 🐳 Docker Registry Privé - Freijstack

Registre Docker **privé, simple et léger** pour stocker vos images conteneur.

## Architecture

```
Registry (Docker Registry v2) ← Stockage d'images
    ↓
Registry-UI (Joxit) ← Interface web pour gérer les images
    ↓
Traefik ← Reverse proxy avec HTTPS/TLS Let's Encrypt
```

## Installation

### 1️⃣ Sur votre VPS

```bash
cd /srv/www/registry-staging
docker compose up -d
```

### 2️⃣ Créer un utilisateur d'authentification (optionnel)

```bash
# Générer un hash htpasswd pour l'authentification
docker run --entrypoint htpasswd registry:2 -Bbn admin yourpassword > data/auth/htpasswd

# Redémarrer le registre
docker compose restart registry
```

## Utilisation

### 🔨 Builder une image

```bash
# Depuis votre portfolio
docker build -t registry-staging.freijstack.com/portfolio:latest ./saas/portfolio
```

### 📤 Pusher vers le registre

```bash
docker push registry-staging.freijstack.com/portfolio:latest
```

### 🔓 Se connecter (si authentification activée)

```bash
docker login registry-staging.freijstack.com
# Username: admin
# Password: yourpassword
```

### 🌐 Interface Web

- **URL** : https://registry-ui-staging.freijstack.com
- Voir toutes les images en un coup d'œil
- Supprimer des images
- Voir les détails de chaque image

## Configuration de Production

Pour produire, créer `/srv/www/registry/`:

```bash
# Variables dans .env
REGISTRY_DOMAIN=registry.freijstack.com
REGISTRY_UI_DOMAIN=registry-ui.freijstack.com
```

Puis adapter `docker-compose.yml` pour prod et relancer.

## Endpoints

| Service | URL | Port |
|---------|-----|------|
| Registry API | https://registry-staging.freijstack.com | 5000 (interne) |
| Registry UI | https://registry-ui-staging.freijstack.com | 80 (interne) |

## Dépannage

### Vérifier la santé

```bash
curl -k https://registry-staging.freijstack.com/v2/
# Doit retourner 200 OK
```

### Voir les logs

```bash
docker compose logs -f registry registry-ui
```

### Lister les images stockées

```bash
# Via API
curl -k https://registry-staging.freijstack.com/v2/_catalog
```

## Limitations

- Pas de gestion d'utilisateurs avancée (htpasswd basique)
- Pas de replication/clustering
- Pas de scanning de vulnérabilités

Pour plus de features, voir [Harbor](https://goharbor.io/) ou [Nexus](https://www.sonatype.com/products/nexus-repository).

## Documentation Officielle

- [Docker Registry v2](https://docs.docker.com/registry/)
- [Joxit Registry UI](https://github.com/Joxit/docker-registry-ui)
