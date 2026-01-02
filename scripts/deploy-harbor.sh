#!/bin/bash
set -euo pipefail

# Harbor deployment script
# Called by GitHub Actions workflow with environment variables

echo "🚀 Starting Harbor deployment..."
echo "🎯 Env: $TARGET_ENV"
echo "📂 Deploy dir: $DEPLOY_DIR"
echo "🌐 Domain: $REGISTRY_DOM"
echo "🏷️ Prefix: $CONTAINER_PREFIX"
echo "📦 Harbor version: $HARBOR_VERSION"

# Ensure traefik network exists
if ! docker network ls --format '{{.Name}}' | grep -qx "web"; then
  echo "ℹ️ Creating docker network 'web'..."
  docker network create web
fi

# Create deploy directory if not exists
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Download Harbor installer if not present
INSTALLER_FILE="harbor-offline-installer-${HARBOR_VERSION}.tgz"
if [ ! -f "$INSTALLER_FILE" ]; then
  echo "📥 Downloading Harbor $HARBOR_VERSION installer..."
  wget -q "https://github.com/goharbor/harbor/releases/download/${HARBOR_VERSION}/${INSTALLER_FILE}"
fi

# Extract installer
echo "📦 Extracting installer..."
rm -rf harbor
tar xzf "$INSTALLER_FILE"
cd harbor

# Read secrets from VPS .env
echo "🔐 Loading secrets from $ENV_FILE..."
DB_PASS=$(grep -E "^DB_PASSWORD=" "$ENV_FILE" 2>/dev/null | cut -d'=' -f2- || openssl rand -hex 32)
ADMIN_PASS=$(grep -E "^HARBOR_ADMIN_PASSWORD=" "$ENV_FILE" 2>/dev/null | cut -d'=' -f2- || openssl rand -hex 32)

# Save admin password if generated
if ! grep -q "^HARBOR_ADMIN_PASSWORD=" "$ENV_FILE" 2>/dev/null; then
  echo "HARBOR_ADMIN_PASSWORD=$ADMIN_PASS" >> "$ENV_FILE"
  echo "🔑 Generated Harbor admin password (saved in $ENV_FILE)"
fi

# Generate harbor.yml from template
echo "📝 Generating harbor.yml..."
cat > harbor.yml <<EOF
hostname: $REGISTRY_DOM

http:
  port: $HTTP_PORT

harbor_admin_password: $ADMIN_PASS

database:
  password: $DB_PASS
  max_idle_conns: 100
  max_open_conns: 900

data_volume: /data

trivy:
  ignore_unfixed: false
  skip_update: false
  insecure: false

jobservice:
  max_job_workers: 10
  job_loggers:
    - STD_OUTPUT
    - FILE

notification:
  webhook_job_max_retry: 10

log:
  level: info
  local:
    rotate_count: 50
    rotate_size: 200M
    location: /var/log/harbor

external_url: https://$REGISTRY_DOM

_version: 2.10.0
EOF

# Run prepare script to generate configs
echo "🔧 Running prepare script..."
./prepare

# Modify generated docker-compose.yml to work with Traefik
echo "🔨 Adapting docker-compose for Traefik integration..."

# Backup original
cp docker-compose.yml docker-compose.yml.backup

# Create Python script to adapt compose file
cat > adapt_compose.py <<'PYTHON_SCRIPT'
import yaml
import os
import sys

try:
    with open('docker-compose.yml', 'r') as f:
        compose = yaml.safe_load(f)

    prefix = os.environ['CONTAINER_PREFIX']
    registry_dom = os.environ['REGISTRY_DOM']
    http_port = os.environ['HTTP_PORT']

    # Rename services with prefix
    services_copy = dict(compose['services'])
    compose['services'] = {}
    for svc_name, svc_config in services_copy.items():
        new_name = f"{prefix}-{svc_name}"
        compose['services'][new_name] = svc_config
        if 'container_name' in svc_config:
            svc_config['container_name'] = f"{prefix}-{svc_config['container_name']}"
        if 'depends_on' in svc_config:
            svc_config['depends_on'] = [f"{prefix}-{dep}" for dep in svc_config['depends_on']]

    # Add Traefik labels to nginx (proxy)
    proxy_service = f"{prefix}-proxy"
    if proxy_service in compose['services']:
        svc = compose['services'][proxy_service]
        if 'networks' not in svc:
            svc['networks'] = []
        if isinstance(svc['networks'], list):
            svc['networks'].append('web')
        svc['labels'] = [
            'traefik.enable=true',
            f'traefik.http.routers.{prefix}.rule=Host(`{registry_dom}`)',
            f'traefik.http.routers.{prefix}.entrypoints=websecure',
            f'traefik.http.routers.{prefix}.tls=true',
            f'traefik.http.routers.{prefix}.tls.certresolver=mytlschallenge',
            f'traefik.http.services.{prefix}.loadbalancer.server.port={http_port}',
        ]

    # Add external web network
    if 'networks' not in compose:
        compose['networks'] = {}
    compose['networks']['web'] = {'external': True}

    # Rename volumes with prefix
    if 'volumes' in compose:
        volumes_copy = dict(compose['volumes'])
        compose['volumes'] = {}
        for vol_name in volumes_copy.keys():
            compose['volumes'][f"{prefix}_{vol_name}"] = {'name': f"{prefix}_{vol_name}"}
        for svc_config in compose['services'].values():
            if 'volumes' in svc_config:
                updated_vols = []
                for vol in svc_config['volumes']:
                    if isinstance(vol, str) and ':' in vol:
                        vol_name, mount = vol.split(':', 1)
                        if vol_name in volumes_copy:
                            updated_vols.append(f"{prefix}_{vol_name}:{mount}")
                        else:
                            updated_vols.append(vol)
                    else:
                        updated_vols.append(vol)
                svc_config['volumes'] = updated_vols

    with open('docker-compose.yml', 'w') as f:
        yaml.dump(compose, f, default_flow_style=False, sort_keys=False)

    print("✅ Docker Compose file adapted successfully")
except Exception as e:
    print(f"❌ Error adapting docker-compose.yml: {e}")
    sys.exit(1)
PYTHON_SCRIPT

python3 adapt_compose.py

echo "🔧 Starting Harbor..."
docker compose up -d

echo "⏳ Waiting for services to initialize..."
sleep 30

echo "🏥 Checking service status:"
docker compose ps

# Check for unhealthy containers (with fallback if jq not available)
UNHEALTHY=$(docker compose ps --format json 2>/dev/null | jq -r 'select(.State != "running") | .Name' 2>/dev/null || docker compose ps | grep -v "Up" | tail -n +2 || true)
if [ -n "$UNHEALTHY" ]; then
  echo "⚠️ Some containers are not running:"
  echo "$UNHEALTHY"
  echo ""
  echo "📄 Recent logs:"
  docker compose logs --tail=100
else
  echo "✅ All services running"
fi

echo ""
echo "✅ Harbor deployment complete!"
echo "🌐 Access Harbor at: https://$REGISTRY_DOM"
echo "👤 Username: admin"
echo "🔑 Password: (check $ENV_FILE)"
