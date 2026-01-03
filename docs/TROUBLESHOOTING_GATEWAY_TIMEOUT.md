# Troubleshooting: Gateway Timeout

## Symptôme

Accès à `portfolio-staging.freijstack.com` ou `portfolio.freijstack.com` retourne **Gateway Timeout** (504).

## Cause

Traefik n'est pas connecté au réseau Docker `freijstack`, il ne peut donc pas router le trafic vers les conteneurs portfolio.

## Diagnostic

```bash
# Vérifier si Traefik est sur le réseau freijstack
ssh root@VPS_HOST "docker inspect traefik -f '{{.NetworkSettings.Networks.freijstack.IPAddress}}'"

# Si vide ou erreur → Traefik n'est pas connecté
```

## Solution Rapide

### Option 1: Script Automatique

```bash
# Sur le VPS
curl -fsSL https://raw.githubusercontent.com/christophe-freijanes/freijstack/develop/scripts/fix-traefik-network.sh | bash
```

### Option 2: Manuelle

```bash
# Connecter Traefik au réseau freijstack
ssh root@VPS_HOST "docker network connect freijstack traefik"

# Si déjà connecté mais sans IP, redémarrer
ssh root@VPS_HOST "docker restart traefik"

# Attendre 5 secondes puis vérifier
ssh root@VPS_HOST "docker inspect traefik -f '{{.NetworkSettings.Networks.freijstack.IPAddress}}'"
# Doit afficher une IP comme: 172.25.0.4
```

## Prévention

### 1. Workflow de Déploiement

Le workflow `portfolio-deploy.yml` vérifie automatiquement la connexion réseau avant chaque déploiement :

```yaml
- name: Ensure Traefik network connectivity
  run: |
    if ! docker inspect traefik -f "{{.NetworkSettings.Networks.freijstack.IPAddress}}" | grep -q "."; then
      docker network connect freijstack traefik || docker restart traefik
    fi
```

### 2. Cron Job (Recommandé)

Ajoutez un cron job qui vérifie toutes les heures :

```bash
# Sur le VPS
crontab -e

# Ajouter cette ligne :
0 * * * * /srv/www/scripts/fix-traefik-network.sh >> /var/log/traefik-network-check.log 2>&1
```

### 3. Systemd Service (Alternative)

Créer un service qui vérifie au démarrage du VPS :

```bash
# /etc/systemd/system/traefik-network-fix.service
[Unit]
Description=Ensure Traefik is connected to freijstack network
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
ExecStart=/srv/www/scripts/fix-traefik-network.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

Activer :
```bash
systemctl daemon-reload
systemctl enable traefik-network-fix.service
```

## Vérification Post-Fix

```bash
# 1. Vérifier que Traefik a une IP sur freijstack
ssh root@VPS_HOST "docker inspect traefik -f '{{.NetworkSettings.Networks.freijstack.IPAddress}}'"
# Output attendu: 172.25.0.X

# 2. Vérifier que les conteneurs portfolio sont visibles
ssh root@VPS_HOST "docker network inspect freijstack | grep -A 3 portfolio"

# 3. Tester l'accès
curl -I https://portfolio-staging.freijstack.com/
# Output attendu: HTTP/2 200 ou HTTP/2 301
```

## Cause Racine

Le problème survient quand :
1. Traefik est redémarré sans la configuration réseau persistante
2. Le VPS redémarre et Traefik démarre avant que le réseau `freijstack` soit recréé
3. `docker-compose` recrée Traefik sans inclure le réseau `freijstack`

## Solution Permanente

Assurer que `base-infra/docker-compose.yml` inclut toujours :

```yaml
services:
  traefik:
    networks:
      - web
      - freijstack  # ← Important!

networks:
  freijstack:
    external: true
```

Et redéployer avec :
```bash
cd /srv/www/base-infra && docker compose up -d
```
