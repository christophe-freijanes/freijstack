# 🤖 n8n - Automation Workflows

[![n8n](https://img.shields.io/badge/platform-n8n-orange?style=flat-square&logo=n8n)](https://n8n.io/)
[![Workflows](https://img.shields.io/badge/workflows-automation-blue?style=flat-square&logo=automation)](https://docs.n8n.io/)
[![Integrations](https://img.shields.io/badge/integrations-400%2B-green?style=flat-square)](https://docs.n8n.io/integrations/)
[![Docker](https://img.shields.io/badge/docker-compose-2496ED?style=flat-square&logo=docker)](./docker-compose.yml)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](../../LICENSE)

**Application SaaS de démonstration** - Plateforme d'automation et de gestion de workflows.

Application de démo pour le portfolio DevSecOps de **Christophe FREIJANES**.

---

## 📋 Fichiers

```
saas/n8n/
├── docker-compose.yml      # Configuration Docker n8n standalone
├── .env.example            # Variables d'environnement
├── init-n8n.sh             # Script d'initialisation
└── README.md               # Ce fichier
```

---

## 🎯 Fonctionnalités

### Automation & Workflows
- ✅ **Visual Workflow Builder** - Interface drag-and-drop
- ✅ **400+ Intégrations natives** - APIs, webhooks, bases de données
- ✅ **Scheduling** - Exécution planifiée (cron, intervals)
- ✅ **Webhooks** - Déclencher workflows via HTTP
- ✅ **Variables & Expressions** - Logique conditionnelle avancée
- ✅ **Error Handling** - Gestion des erreurs et retry
- ✅ **Logging** - Traçabilité complète des exécutions

### Intégrations Clés
- 📊 **Data**: Spreadsheets, Databases (PostgreSQL, MySQL)
- 📧 **Communication**: Email, Slack, Teams, Discord
- 💰 **Finance**: Stripe, PayPal, Square
- ☁️ **Cloud**: AWS, Google Cloud, Azure
- 🔐 **Security**: Vault, n8n Credentials

### Cas d'Usage Démontrés
- **ETL** - Extract, Transform, Load de données
- **Data Sync** - Synchronisation multi-sources
- **Notifications** - Alertes et webhooks
- **Approvals** - Workflows d'approbation
- **Automation** - Tâches récurrentes sans code

---

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│      Internet / DNS             │
│  https://n8n.freijstack.com     │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Traefik (Reverse Proxy + TLS)  │
│  Ports: 80→443, 443→5678        │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│       n8n Web UI                │
│  - Workflow Builder             │
│  - Credentials Manager          │
│  - Execution Dashboard          │
│  - Admin Panel                  │
│  Port: 5678 (interne)           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   n8n Backend Services          │
│  - Workflow Engine              │
│  - Webhook Server               │
│  - Job Processor                │
│  - Credentials Vault            │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  n8n Data Volume (SQLite)       │
│  /home/node/.n8n                │
│  (peut utiliser PostgreSQL)     │
└─────────────────────────────────┘
```

### Stack Technique

| Composant | Technologie | Usage |
|-----------|------------|-------|
| **Platform** | n8n (Node.js) | Automation & workflows |
| **Proxy** | Traefik v2 | Reverse proxy + SSL/TLS |
| **Storage** | SQLite (local) | Database workflows |
| **Volumes** | Docker volumes | Data persistence |
| **Network** | Docker (web) | Communication Traefik |
| **Port** | 5678 | Service interne |

---

## 🚀 Installation & Déploiement

### Prérequis

- Docker 20.10+
- Docker Compose v2+
- Network Docker `web` créé (via Traefik)
- Traefik configuré et en cours d'exécution
- DNS configuré: `n8n.freijstack.com`

### 1. Configuration

```bash
cd saas/n8n

# Copier le fichier d'environnement
cp .env.example .env

# Éditer avec vos valeurs
nano .env
```

### 2. Variables d'Environnement

Le fichier `.env` doit contenir :

```env
# Domaine et SSL
DOMAIN_NAME=freijstack.com
SUBDOMAIN_N8N=n8n
SSL_EMAIL=your-email@example.com

# Timezone (pour scheduling)
GENERIC_TIMEZONE=Europe/Paris

# Sécurité (générer des valeurs sécurisées)
N8N_ENCRYPTION_KEY=$(openssl rand -hex 32)
N8N_JWT_SECRET=$(openssl rand -hex 32)
N8N_DEFAULT_USER_PASSWORD=your-secure-password
```

### 3. Démarrer n8n

```bash
# Rendre le script exécutable
chmod +x init-n8n.sh

# Initialiser et démarrer
./init-n8n.sh
```

**Ou manuellement** :

```bash
# Créer le network Docker s'il n'existe pas
docker network create web || true

# Créer le volume n8n_data
docker volume create n8n_data || true

# Démarrer les services
docker-compose up -d

# Vérifier le status
docker-compose ps
```

### 4. Accès

```bash
# Web UI
https://n8n.freijstack.com

# En local (dev)
http://localhost:5678

# API
https://n8n.freijstack.com/api/
```

---

## 📊 Gestion & Maintenance

### Logs

```bash
# Logs en temps réel
docker-compose logs -f n8n

# Voir les 100 dernières lignes
docker-compose logs --tail=100 n8n

# Exporter les logs
docker-compose logs n8n > n8n.log
```

### Mise à jour

```bash
# Vérifier la version installée
docker-compose exec n8n n8n --version

# Mettre à jour l'image
docker-compose pull n8n
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps
```

### Backup des Données

```bash
# Backup du volume n8n_data
docker run --rm \
  -v n8n_n8n_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/n8n-backup-$(date +%Y%m%d).tar.gz -C /data .

# Restaurer un backup
docker run --rm \
  -v n8n_n8n_data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/n8n-backup-*.tar.gz -C /data
```

### Arrêter n8n

```bash
# Arrêter les services
docker-compose down

# Arrêter et supprimer les données (attention!)
docker-compose down -v
```

---

## 🔐 Sécurité

✅ **Données Sensibles**:
- Credentials stockés chiffrés dans la base
- Encryption key configurée via variables d'environnement
- JWT tokens pour API authentication
- Support HTTPS via Traefik + Let's Encrypt

✅ **Réseau**:
- Isolation Docker via network `web`
- HTTPS/TLS obligatoire (redirige HTTP)
- Security headers via Traefik
- Firewall rules sur le VPS

✅ **Accès**:
- Port 5678 accessible uniquement en local (127.0.0.1)
- Web UI derrière authentification n8n
- API keys pour webhooks configurables

---

## 📚 Workflows Disponibles

### Créer un Workflow

1. Ouvrir https://n8n.freijstack.com
2. Cliquer sur "+ New Workflow"
3. Ajouter des nodes en drag-and-drop
4. Configurer credentials pour intégrations
5. Tester et activer

### Exemples de Workflows

Quelques cas d'usage classiques :

```
1. Data Sync Workflow
   Trigger → SQL → Transform → Email
   
2. Notification Alert
   Webhook → Condition → Slack
   
3. ETL Pipeline
   API Fetch → Parse JSON → Database Insert
   
4. Approval Workflow
   Trigger → Send Email → Wait for Response → Update Record
```

### Exporter/Importer

```bash
# Depuis l'UI
Workflow → Menu (⋮) → Download as JSON

# Importer
Workflow → Menu → Import from URL/JSON
```

---

## 🛠️ Développement

### Variables d'Environnement Avancées

```env
# Webhooks
WEBHOOK_TUNNEL_URL=https://n8n.freijstack.com/

# Database (optionnel)
DB_TYPE=postgres
DB_POSTGRE_HOST=postgres
DB_POSTGRE_PORT=5432
DB_POSTGRE_DB=n8n
DB_POSTGRE_USER=n8n
DB_POSTGRE_PASSWORD=password

# Redis (optionnel - pour job queue)
QUEUE_TYPE=redis
REDIS_HOST=redis
REDIS_PORT=6379

# Logging
LOG_LEVEL=info
```

### Webhooks

Les webhooks n8n sont accessibles publiquement :

```bash
# Format
POST https://n8n.freijstack.com/webhook/{workflow-id}

# Exemple
curl -X POST https://n8n.freijstack.com/webhook/my-webhook \
  -H "Content-Type: application/json" \
  -d '{"data": "value"}'
```

### Credentials Management

Créer des credentials de manière sécurisée :

1. Dashboard → Credentials
2. Create → Sélectionner type (Slack, Gmail, etc.)
3. Entrer les credentials
4. Utiliser dans workflows: `{{ $credentials.credential_name }}`

---

## 📞 Support

- **n8n Documentation**: https://docs.n8n.io/
- **n8n Community**: https://community.n8n.io/
- **GitHub Issues**: Déposer un issue dans le repo principal
- **Workflows Gallery**: https://n8n.io/workflows/

---

## 📝 Notes

- **Persistence**: Données stockées dans volume `n8n_data`
- **Timezone**: Important pour scheduling correct (configurable)
- **Performance**: Considérer PostgreSQL pour production haute charge
- **Encryption**: Clés générées aléatoirement pour chaque déploiement
- **Webhooks**: Accès public, sécuriser avec authentication

---

**Créé par**: Christophe FREIJANES | **Dernière mise à jour**: Décembre 2025
