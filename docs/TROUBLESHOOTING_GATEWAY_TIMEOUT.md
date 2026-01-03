# Troubleshooting: Gateway Timeout

## Symptôme

Les URLs de vos services retournent **Gateway Timeout** :
- Portfolio : https://portfolio-staging.freijstack.com, https://portfolio.freijstack.com → 504
- SecureVault : https://vault.freijstack.com, https://vault-api.freijstack.com → 504
- Registry : https://registry.freijstack.com → 504
- n8n : https://automation.freijstack.com → 504

## Cause

Traefik n'est pas connecté aux réseaux Docker critiques, il ne peut donc pas router le trafic vers les conteneurs.

**Réseaux critiques** :
- `web` : SecureVault, Docker Registry, n8n
- `freijstack` : Portfolio (staging + production)

## Diagnostic

```bash
# Vérifier tous les réseaux critiques
for network in web freijstack; do
  echo "=== Network: $network ==="
  docker network inspect $network | grep -A 5 traefik
done

# Si vide ou pas d'"IPAddress", Traefik n'est pas connecté
```

## Solution Automatique

Les workflows de monitoring vérifient et corrigent automatiquement ce problème :
- **Production** : Toutes les 30 minutes
- **Développement** : Toutes les heures

Si vous voulez corriger manuellement :

```bash
# Méthode 1: Script automatique (recommandé)
./scripts/check-traefik-network.sh

# Méthode 2: Manuel
docker network connect web traefik || echo "Already connected"
docker network connect freijstack traefik || echo "Already connected"
docker restart traefik
sleep 5

# Vérifier toutes les connexions
for network in web freijstack; do
  echo "Network: $network"
  docker network inspect $network | grep -q traefik && echo "✅ Connected" || echo "❌ Not connected"
done
```

## Prévention

### 1. Configuration Docker Compose

Le fichier `base-infra/docker-compose.yml` configure Traefik avec tous les réseaux critiques :

```yaml
services:
  traefik:
    networks:
      - web          # SecureVault, Registry, n8n
      - freijstack   # Portfolio
```

### 2. Vérification Automatique dans les Workflows

Tous les workflows incluent une vérification multi-réseaux :

**Workflows concernés** :
- `.github/workflows/portfolio-deploy.yml` : Vérifie avant chaque déploiement
- `.github/workflows/healthcheck-prod.yml` : Surveillance toutes les 30 min avec auto-heal
- `.github/workflows/healthcheck-dev.yml` : Surveillance horaire avec auto-heal

```yaml
- name: Ensure Traefik is connected to all networks
  run: |
    for network in web freijstack; do
      docker network connect $network traefik || echo "Already connected"
    done
    docker restart traefik
```

### 3. Script de Diagnostic

Utilisez `scripts/check-traefik-network.sh` pour diagnostiquer et corriger automatiquement tous les réseaux.

## Pourquoi ce problème se produit ?

1. **Redémarrage du VPS** : Les connexions réseau peuvent ne pas être restaurées
  automatiquement
2. **Mise à jour de Traefik** : Recréation du conteneur sans restaurer toutes les connexions réseau
3. **Changement de configuration** : Modification de `docker-compose.yml` et recréation

## Vérifications supplémentaires
4. **Déconnexion inattendue** : Bug Docker ou crash système

### Vérifier tous les conteneurs sur chaque réseau

```bash
# Réseau web (SecureVault, Registry, n8n)
docker network inspect web --format '{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{println}}{{end}}'

# Réseau freijstack (Portfolio)
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
