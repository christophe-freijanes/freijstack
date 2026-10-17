
# 📊 Guide Monitoring & Observabilité - FreijStack

---

## 📝 Résumé

Ce guide explique comment surveiller et analyser l’infrastructure FreijStack : installation, dashboards, alertes et bonnes pratiques.

- **Public visé** : DevOps, administrateurs, contributeurs
- **Objectif** : Mettre en place un monitoring complet et proactif
- **Points clés** : Stack Prometheus/Grafana/Loki, alertes, logs, SLA

---

**Dernière mise à jour**: Décembre 2025

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Stack Monitoring](#stack-monitoring)
3. [Installation Prometheus](#installation-prometheus)
4. [Installation Grafana](#installation-grafana)
5. [Installation Loki](#installation-loki)
6. [Configuration Dashboards](#configuration-dashboards)
7. [Métriques Clés](#métriques-clés)
8. [Alertes](#alertes)
9. [Logs Aggregation](#logs-aggregation)
10. [Best Practices](#best-practices)

---

## Vue d'ensemble


### Objectifs principaux
- Surveiller uptime et disponibilité (SLA 99.9%)
- Monitorer la performance (temps de réponse <500ms)
- Détecter les anomalies et incidents
- Analyser les logs centralisés
- Recevoir des alertes proactives

### Architecture Monitoring

```
┌─────────────────────────────────────────────┐
│         Applications & Infrastructure       │
│  - nginx (portfolio-prod, portfolio-staging)│
│  - Traefik (reverse proxy)                  │
│  - Node Exporter (system metrics)           │
│  - cAdvisor (container metrics)             │
└────────────┬────────────────────────────────┘
             │ Scrape metrics
             ▼
┌─────────────────────────────────────────────┐
│           Prometheus (TSDB)                 │
│  - Collecte métriques                       │
│  - Stockage time-series                     │
│  - Évaluation alertes                       │
└────────────┬────────────────────────────────┘
             │ Query
             ▼
┌─────────────────────────────────────────────┐
│            Grafana (Visualisation)          │
│  - Dashboards interactifs                   │
│  - Graphes temps réel                       │
│  - Alerting visuel                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         Loki (Logs Aggregation)             │
│  - Collecte logs Docker                     │
│  - Indexation label-based                   │
│  - Requêtes LogQL                           │
└─────────────────────────────────────────────┘
```

---

## Stack Monitoring

### Composants

| Outil | Usage | Port |
|-------|-------|------|
| **Prometheus** | Métriques time-series | 9090 |
| **Grafana** | Dashboards & visualisation | 3000 |
| **Node Exporter** | Métriques système (CPU, RAM, disk) | 9100 |
| **cAdvisor** | Métriques containers Docker | 8080 |
| **Loki** | Agrégation logs | 3100 |
| **Promtail** | Collecteur logs → Loki | - |
| **Alertmanager** | Gestion alertes | 9093 |

---

## Installation Prometheus

### 1. Créer docker-compose-monitoring.yml

```bash
cd /srv/docker
mkdir monitoring
cd monitoring
vim docker-compose.yml
```

**Contenu** (`docker-compose.yml`):

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
    ports:
      - "9090:9090"
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning:ro
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=ChangeMe123!
      - GF_USERS_ALLOW_SIGN_UP=false
    ports:
      - "3000:3000"
    networks:
      - monitoring
    depends_on:
      - prometheus

  node_exporter:
    image: prom/node-exporter:latest
    container_name: node_exporter
    restart: unless-stopped
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    ports:
      - "9100:9100"
    networks:
      - monitoring

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: cadvisor
    restart: unless-stopped
    privileged: true
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
    ports:
      - "8080:8080"
    networks:
      - monitoring

volumes:
  prometheus_data:
  grafana_data:

networks:
  monitoring:
    driver: bridge
```

### 2. Créer Configuration Prometheus

```bash
mkdir -p prometheus
vim prometheus/prometheus.yml
```

**Contenu** (`prometheus/prometheus.yml`):

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  # Prometheus self-monitoring
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Node Exporter (système)
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node_exporter:9100']

  # cAdvisor (containers)
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']

  # Traefik metrics (si activé)
  - job_name: 'traefik'
    static_configs:
      - targets: ['traefik:8080']
    # Décommenter si metrics Traefik activées
    # metrics_path: /metrics

  # Nginx Exporter (optionnel)
  # - job_name: 'nginx'
  #   static_configs:
  #     - targets: ['nginx-exporter:9113']
```

### 3. Lancer Stack Monitoring

```bash
cd /srv/docker/monitoring
docker-compose up -d

# Vérifier containers
docker-compose ps

# Vérifier logs
docker-compose logs -f
```

### 4. Accéder Prometheus

```
http://IP_VPS:9090
```

**Tester requête**:
- Aller sur **Graph**
- Query: `up`
- Exécuter → Doit montrer tous les targets "up"

---

## Installation Grafana

### 1. Accéder Grafana

```
http://IP_VPS:3000
```

**Credentials par défaut**:
- Username: `admin`
- Password: `ChangeMe123!` (à changer immédiatement)

### 2. Ajouter Data Source Prometheus

1. **Settings** (⚙️) → **Data Sources** → **Add data source**
2. Sélectionner **Prometheus**
3. URL: `http://prometheus:9090`
4. **Save & Test**

✅ Vous devriez voir "Data source is working"

### 3. Importer Dashboards Préconfigurés

**Dashboard Node Exporter** (ID: 1860):
1. **Dashboards** (+) → **Import**
2. ID: `1860`
3. **Load**
4. Data Source: **Prometheus**
5. **Import**

**Dashboard Docker** (ID: 193):
1. **Dashboards** (+) → **Import**
2. ID: `193`
3. **Load**
4. Data Source: **Prometheus**
5. **Import**

**Dashboard Traefik** (ID: 4475):
1. **Dashboards** (+) → **Import**
2. ID: `4475`
3. **Load**
4. Data Source: **Prometheus**
5. **Import**

---

## Installation Loki

### 1. Ajouter Loki au docker-compose

**Éditer** `docker-compose.yml` et ajouter:

```yaml
  loki:
    image: grafana/loki:latest
    container_name: loki
    restart: unless-stopped
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - monitoring

  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    restart: unless-stopped
    volumes:
      - /var/log:/var/log:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - ./promtail/promtail-config.yml:/etc/promtail/config.yml:ro
    command: -config.file=/etc/promtail/config.yml
    networks:
      - monitoring
    depends_on:
      - loki
```

### 2. Créer Config Promtail

```bash
mkdir promtail
vim promtail/promtail-config.yml
```

**Contenu**:

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: system
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*.log

  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    relabel_configs:
      - source_labels: ['__meta_docker_container_name']
        regex: '/(.*)'
        target_label: 'container'
```

### 3. Relancer Stack

```bash
cd /srv/docker/monitoring
docker-compose up -d

# Vérifier Loki
docker logs loki --tail 20
```

### 4. Ajouter Loki dans Grafana

1. **Settings** → **Data Sources** → **Add data source**
2. Sélectionner **Loki**
3. URL: `http://loki:3100`
4. **Save & Test**

---

## Configuration Dashboards

### Dashboard Custom Portfolio

Créer un dashboard personnalisé pour le portfolio :

**Panels recommandés**:

1. **Uptime Portfolio**
   - Query: `up{job="cadvisor",container="portfolio-prod"}`
   - Type: Stat
   - Thresholds: <1 = red, ≥1 = green

2. **Response Time (P95)**
   - Query: `histogram_quantile(0.95, rate(traefik_service_request_duration_seconds_bucket{service="portfolio"}[5m]))`
   - Type: Graph
   - Unit: seconds

3. **Request Rate**
   - Query: `rate(traefik_service_requests_total{service="portfolio"}[5m])`
   - Type: Graph
   - Unit: req/s

4. **CPU Usage**
   - Query: `rate(container_cpu_usage_seconds_total{container="portfolio-prod"}[5m]) * 100`
   - Type: Graph
   - Unit: percent

5. **Memory Usage**
   - Query: `container_memory_usage_bytes{container="portfolio-prod"} / 1024 / 1024`
   - Type: Graph
   - Unit: MB

6. **HTTP Status Codes**
   - Query: `sum(rate(traefik_service_requests_total{service="portfolio"}[5m])) by (code)`
   - Type: Graph (Stacked)

---

## Métriques Clés

### SLI/SLO

| Métrique | SLI (Indicateur) | SLO (Objectif) | Query Prometheus |
|----------|------------------|----------------|------------------|
| **Availability** | Uptime | 99.9% | `avg_over_time(up{job="portfolio"}[30d]) * 100` |
| **Latency** | P95 response time | <500ms | `histogram_quantile(0.95, rate(traefik_service_request_duration_seconds_bucket[5m]))` |
| **Error Rate** | 5xx errors | <0.1% | `sum(rate(traefik_service_requests_total{code=~"5.."}[5m])) / sum(rate(traefik_service_requests_total[5m])) * 100` |
| **Throughput** | Requests/sec | >10 req/s | `rate(traefik_service_requests_total[5m])` |

### Queries Utiles

**CPU Usage Total**:
```promql
100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

**Memory Available**:
```promql
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100
```

**Disk Usage**:
```promql
100 - ((node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100)
```

**Container Restart Count**:
```promql
changes(container_start_time_seconds{container="portfolio-prod"}[1h])
```

---

## Alertes

### Configuration Alertmanager

**Ajouter au docker-compose**:

```yaml
  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    restart: unless-stopped
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
    networks:
      - monitoring
```

**Créer config Alertmanager**:

```bash
mkdir alertmanager
vim alertmanager/alertmanager.yml
```

```yaml
global:
  resolve_timeout: 5m

route:
  receiver: 'email'
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h

receivers:
  - name: 'email'
    email_configs:
      - to: 'contact@freijstack.com'
        from: 'alerts@freijstack.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'alerts@freijstack.com'
        auth_password: 'APP_PASSWORD_HERE'
        headers:
          Subject: '🚨 Alert: {{ .GroupLabels.alertname }}'
```

### Règles d'Alertes

**Créer** `prometheus/alerts.yml`:

```yaml
groups:
  - name: portfolio_alerts
    interval: 30s
    rules:
      # Portfolio down
      - alert: PortfolioDown
        expr: up{container="portfolio-prod"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Portfolio production est DOWN"
          description: "Le container portfolio-prod ne répond plus depuis {{ $value }} minutes."

      # High response time
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(traefik_service_request_duration_seconds_bucket{service="portfolio"}[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Temps de réponse élevé (P95 > 1s)"

      # High error rate
      - alert: HighErrorRate
        expr: sum(rate(traefik_service_requests_total{code=~"5..",service="portfolio"}[5m])) / sum(rate(traefik_service_requests_total{service="portfolio"}[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Taux d'erreur 5xx > 5%"

      # Disk space low
      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Espace disque < 10%"

      # Certificate expiration
      - alert: SSLCertExpiringSoon
        expr: (probe_ssl_earliest_cert_expiry - time()) / 86400 < 7
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Certificat SSL expire dans < 7 jours"
```

**Ajouter dans** `prometheus/prometheus.yml`:

```yaml
rule_files:
  - 'alerts.yml'

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']
```

---

## Logs Aggregation

### Explore Logs dans Grafana

1. **Explore** (🧭) → Data Source: **Loki**
2. Query examples:

**Logs container portfolio**:
```logql
{container="portfolio-prod"}
```

**Erreurs uniquement**:
```logql
{container="portfolio-prod"} |= "error"
```

**Requêtes HTTP 5xx**:
```logql
{container="traefik"} |= "502" or "503" or "504"
```

**Logs dernières 5 minutes**:
```logql
{container="portfolio-prod"} [5m]
```

---

## Best Practices

### 1. Retention Données

- **Prometheus**: 30 jours (configurable via `--storage.tsdb.retention.time`)
- **Loki**: 30 jours (configurable)
- **Backups**: Exporter métriques critiques vers stockage long terme

### 2. Performance

- Limiter nombre de metrics scrappées
- Utiliser recording rules pour queries complexes
- Indexation Loki label-based (pas full-text)

### 3. Sécurité

```bash
# Firewall: bloquer ports monitoring depuis internet
sudo ufw deny 9090  # Prometheus
sudo ufw deny 3000  # Grafana
sudo ufw deny 3100  # Loki

# Accès via SSH tunnel
ssh -L 3000:localhost:3000 deploy@IP_VPS
# Puis accéder: http://localhost:3000
```

### 4. Dashboards

- Organiser par thématique (Infra, Apps, Business)
- Utiliser variables pour filtrage dynamique
- Annoter incidents sur graphes
- Exporter JSON pour versionning

---

## 📞 Resources

- **Prometheus Docs**: https://prometheus.io/docs/
- **Grafana Dashboards**: https://grafana.com/grafana/dashboards/
- **Loki Docs**: https://grafana.com/docs/loki/

---

**Voir aussi**:
- [Architecture](architecture.md)
- [Deployment](DEPLOYMENT.md)
- [Troubleshooting](TROUBLESHOOTING.md)

---

**Version**: 1.0  
**Auteur**: Christophe FREIJANES  
**Date**: Décembre 2025
