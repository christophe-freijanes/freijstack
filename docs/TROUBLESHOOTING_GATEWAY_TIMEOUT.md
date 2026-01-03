# Troubleshooting: Gateway Timeout

## Symptôme

Les URLs du portfolio retournent **Gateway Timeout** :
- https://portfolio-staging.freijstack.com → 504 Gateway Timeout
- https://portfolio.freijstack.com → 504 Gateway Timeout

## Cause

Traefik n'est pas connecté au réseau Docker `freijstack`, il ne peut donc pas router le trafic vers les conteneurs portfolio.

## Diagnostic

```bash
# Vérifier si Traefik est sur le réseau freijstack
docker network inspect freijstack | grep -A 5 traefik

# Si vide ou pas de "IPAddress", Traefik n'est pas connecté
```

## Solution Automatique

Le workflow de déploiement vérifie et corrige automatiquement ce problème à chaque déploiement.

Si vous voulez corriger manuellement :

```bash
# Méthode 1: Script automatique
./scripts/check-traefik-network.sh

# Méthode 2: Manuel
docker network connect freijstack traefik
docker restart traefik
sleep 5

# Vérifier
docker network inspect freijstack | grep traefik
```

## Prévention

### 1. Configuration Docker Compose

Le fichier `base-infra/docker-compose.yml` configure Traefik avec le réseau `freijstack` :

```yaml
services:
  traefik:
    networks:
      - web
      - freijstack
```

### 2. Vérification Automatique dans les Workflows

Les workflows GitHub Actions incluent maintenant une étape de vérification :

```yaml
- name: Ensure Traefik is connected to freijstack network
  run: |
    ssh user@vps 'docker network connect freijstack traefik || true'
```

### 3. Script de Diagnostic

Utilisez `scripts/check-traefik-network.sh` pour diagnostiquer et corriger automatiquement.

## Pourquoi ce problème se produit ?

1. **Redémarrage du VPS** : Les connexions réseau peuvent ne pas être restaurées
2. **Mise à jour de Traefik** : Recréation du conteneur sans restaurer toutes les connexions réseau
3. **Changement de configuration** : Modification de `docker-compose.yml` et recréation

## Vérifications supplémentaires

### Vérifier tous les conteneurs sur le réseau

```bash
docker network inspect freijstack --format '{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{println}}{{end}}'
```

Devrait afficher :
- `traefik: 172.25.0.x/16`
- `portfolio-staging: 172.25.0.x/16`
- `portfolio-prod: 172.25.0.x/16`

### Vérifier les logs Traefik

```bash
docker logs traefik 2>&1 | grep -i portfolio
```

Si Traefik voit les conteneurs, vous verrez des logs comme :
```
Adding route for portfolio-staging.freijstack.com
Adding route for portfolio.freijstack.com
```

### Test de connectivité depuis Traefik

```bash
# Depuis le conteneur Traefik, ping les conteneurs portfolio
docker exec traefik ping -c 2 portfolio-staging
docker exec traefik ping -c 2 portfolio-prod
```

## Solution Permanente

Pour éviter complètement ce problème, redéployez Traefik avec la configuration mise à jour :

```bash
# Sur le VPS
cd /srv/www/base-infra
docker compose down
docker compose up -d

# Vérifier que Traefik démarre avec les deux réseaux
docker inspect traefik | grep -A 30 Networks
```

## Référence

- Workflow de déploiement : [`.github/workflows/portfolio-deploy.yml`](../.github/workflows/portfolio-deploy.yml)
- Script de diagnostic : [`scripts/check-traefik-network.sh`](../scripts/check-traefik-network.sh)
- Configuration Traefik : [`base-infra/docker-compose.yml`](../base-infra/docker-compose.yml)
