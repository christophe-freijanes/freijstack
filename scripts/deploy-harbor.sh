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

# TLS certs: prefer values from .env; fallback to deploy-local self-signed paths
CERT_PATH=$(grep -E "^CERT_PATH=" "$ENV_FILE" 2>/dev/null | cut -d'=' -f2- || echo "$DEPLOY_DIR/certs/fullchain.pem")
CERT_KEY_PATH=$(grep -E "^CERT_KEY_PATH=" "$ENV_FILE" 2>/dev/null | cut -d'=' -f2- || echo "$DEPLOY_DIR/certs/privkey.pem")

# Save admin password if generated
if ! grep -q "^HARBOR_ADMIN_PASSWORD=" "$ENV_FILE" 2>/dev/null; then
  echo "HARBOR_ADMIN_PASSWORD=$ADMIN_PASS" >> "$ENV_FILE"
  echo "🔑 Generated Harbor admin password (saved in $ENV_FILE)"
fi

# Persist cert paths if they were defaulted
if ! grep -q "^CERT_PATH=" "$ENV_FILE" 2>/dev/null; then
  echo "CERT_PATH=$CERT_PATH" >> "$ENV_FILE"
fi
if ! grep -q "^CERT_KEY_PATH=" "$ENV_FILE" 2>/dev/null; then
  echo "CERT_KEY_PATH=$CERT_KEY_PATH" >> "$ENV_FILE"
fi

# Ensure TLS certs exist (generate self-signed if missing)
mkdir -p "$(dirname "$CERT_PATH")"
if [ ! -f "$CERT_PATH" ] || [ ! -f "$CERT_KEY_PATH" ]; then
  echo "⚠️ TLS cert/key not found; generating self-signed certificate for $REGISTRY_DOM"
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -subj "/CN=$REGISTRY_DOM" \
    -keyout "$CERT_KEY_PATH" \
    -out "$CERT_PATH"
fi

# Persist cert paths if they were defaulted
if ! grep -q "^CERT_PATH=" "$ENV_FILE" 2>/dev/null; then
  echo "CERT_PATH=$CERT_PATH" >> "$ENV_FILE"
fi
if ! grep -q "^CERT_KEY_PATH=" "$ENV_FILE" 2>/dev/null; then
  echo "CERT_KEY_PATH=$CERT_KEY_PATH" >> "$ENV_FILE"
fi

# Generate harbor.yml from template
echo "📝 Generating harbor.yml..."
cat > harbor.yml <<EOF
hostname: $REGISTRY_DOM

http:
  port: $HTTP_PORT

https:
  port: 443
  certificate: $CERT_PATH
  private_key: $CERT_KEY_PATH

harbor_admin_password: $ADMIN_PASS

database:
  password: $DB_PASS
  max_idle_conns: 100
  max_open_conns: 900

data_volume: /data

storage_service:
  filesystem:
    rootdirectory: /storage

trivy:
  ignore_unfixed: false
  skip_update: false
  insecure: false

jobservice:
  max_job_workers: 10
  job_loggers:
    - STD_OUTPUT
    - FILE
  logger_sweeper_duration: 1h

notification:
  webhook_job_max_retry: 10
  webhook_job_http_client_timeout: 3

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
set +e  # Allow prepare script to fail initially
if [ -f "./prepare" ]; then
  chmod +x ./prepare
  ./prepare
  PREPARE_RESULT=$?
  if [ $PREPARE_RESULT -ne 0 ]; then
    echo "❌ Prepare script failed with code $PREPARE_RESULT"
    echo "📄 Checking harbor.yml..."
    cat harbor.yml
    exit 1
  fi
else
  echo "⚠️  prepare script not found, attempting to continue..."
fi
set -e

# Verify harbor.yml was created
if [ ! -f "harbor.yml" ]; then
  echo "❌ ERROR: harbor.yml was not generated!"
  exit 1
fi
echo "✅ harbor.yml generated successfully"

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

    # Get default Harbor network name (usually 'harbor' or similar)
    harbor_net = None
    for svc in compose['services'].values():
        if 'networks' in svc:
            if isinstance(svc['networks'], list) and svc['networks']:
                harbor_net = svc['networks'][0]
                break
            elif isinstance(svc['networks'], dict):
                harbor_net = list(svc['networks'].keys())[0]
                break
    
    if not harbor_net:
        harbor_net = 'harbor'  # fallback

    # Rename services with prefix and add network aliases for internal DNS
    services_copy = dict(compose['services'])
    compose['services'] = {}
    for svc_name, svc_config in services_copy.items():
        new_name = f"{prefix}-{svc_name}"
        compose['services'][new_name] = svc_config
        if 'container_name' in svc_config:
            svc_config['container_name'] = f"{prefix}-{svc_config['container_name']}"
        if 'depends_on' in svc_config:
            svc_config['depends_on'] = [f"{prefix}-{dep}" for dep in svc_config['depends_on']]
        
        # Ensure networks is a dict and add aliases to Harbor internal network
        if 'networks' not in svc_config or not svc_config['networks']:
            svc_config['networks'] = {harbor_net: {}}
        
        # Convert networks list to dict with aliases
        if isinstance(svc_config['networks'], list):
            nets = svc_config['networks']
            svc_config['networks'] = {}
            for net in nets:
                svc_config['networks'][net] = {'aliases': [svc_name]}
        else:
            # Add alias to each existing network (dict format)
            for net_name in list(svc_config['networks'].keys()):
                if svc_config['networks'][net_name] is None:
                    svc_config['networks'][net_name] = {}
                if 'aliases' not in svc_config['networks'][net_name]:
                    svc_config['networks'][net_name]['aliases'] = []
                if svc_name not in svc_config['networks'][net_name]['aliases']:
                    svc_config['networks'][net_name]['aliases'].append(svc_name)

    # Add Traefik labels to nginx (proxy)
    proxy_service = f"{prefix}-proxy"
    if proxy_service in compose['services']:
        svc = compose['services'][proxy_service]
        
        # Ensure proxy is on both Harbor internal network AND web network
        if 'networks' not in svc or not svc['networks']:
            svc['networks'] = {}
        
        # Convert list to dict if needed
        if isinstance(svc['networks'], list):
            nets = svc['networks']
            svc['networks'] = {}
            for net in nets:
                svc['networks'][net] = {'aliases': ['proxy']}
        
        # Ensure proxy has alias on Harbor internal network
        if harbor_net in svc['networks']:
            if svc['networks'][harbor_net] is None:
                svc['networks'][harbor_net] = {}
            if 'aliases' not in svc['networks'][harbor_net]:
                svc['networks'][harbor_net]['aliases'] = []
            if 'proxy' not in svc['networks'][harbor_net]['aliases']:
                svc['networks'][harbor_net]['aliases'].append('proxy')
        
        # Add web network for Traefik with alias
        svc['networks']['web'] = {'aliases': ['proxy']}
        
        # Remove host port bindings to avoid 80/443 conflicts (Traefik handles ingress)
        if 'ports' in svc:
            svc.pop('ports', None)
        # Ensure container port exposed for Traefik target
        svc.setdefault('expose', [])
        if str(http_port) not in [str(p) for p in svc['expose']]:
            svc['expose'].append(int(http_port))
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
sleep 15

echo "🏥 Checking service status:"
docker compose ps

echo ""
echo "🔍 Diagnostic info:"
echo "- Checking if core is reachable from proxy..."
docker compose exec -T proxy sh -c "nc -zv core 8080 2>&1 || wget -qO- http://core:8080/api/v2.0/health 2>&1 | head -5" || echo "❌ Cannot reach core from proxy"

echo "- Checking if proxy is listening on port $HTTP_PORT..."
docker compose exec -T proxy sh -c "netstat -tlnp 2>/dev/null | grep $HTTP_PORT || ss -tlnp | grep $HTTP_PORT" || echo "⚠️  netstat/ss not available in proxy"

echo "- Testing proxy directly..."
docker compose exec -T proxy sh -c "curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://localhost:$HTTP_PORT/ 2>&1" || echo "❌ Proxy not responding"

echo ""
echo "📊 Container health summary:"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "📄 Core logs (last 20 lines):"
docker compose logs --tail=20 core 2>/dev/null || echo "Core not running"

echo ""
echo "📄 Proxy logs (last 20 lines):"
docker compose logs --tail=20 proxy 2>/dev/null || echo "Proxy not running"

# Check for unhealthy containers (with fallback if jq not available)
UNHEALTHY=$(docker compose ps --format json 2>/dev/null | jq -r 'select(.State != "running") | .Name' 2>/dev/null || docker compose ps | grep -v "Up" | tail -n +2 || true)
if [ -n "$UNHEALTHY" ]; then
  echo ""
  echo "⚠️ Some containers are not running:"
  echo "$UNHEALTHY"
else
  echo ""
  echo "✅ All services running"
fi

echo ""
echo "✅ Harbor deployment complete!"
echo "🌐 Access Harbor at: https://$REGISTRY_DOM"
echo "👤 Username: admin"
echo "🔑 Password: (check $ENV_FILE)"
echo ""
echo "🔧 Troubleshooting commands:"
echo "  docker compose logs -f              # View all logs"
echo "  docker compose logs -f proxy core   # View proxy + core logs"
echo "  docker compose ps                   # Check container status"
echo "  docker network inspect ${CONTAINER_PREFIX}_harbor  # Check network"
