# Portfolio Deployment Guide

## Overview

The portfolio is a static website served by nginx in Docker containers, managed by Traefik as a reverse proxy.

**Current Setup:**
- Staging: `https://portfolio-staging.freijstack.com` (port 3000)
- Production: `https://portfolio.freijstack.com` (port 3001)
- Docker Registry: `registry.freijstack.com` (private)

## How Updates Work

### Automated Pipeline (Ideal)

When you push changes to the `develop` or `master` branch:

1. **GitHub Actions triggers `03-app-portfolio-build.yml`**
   - Builds Docker image from `saas/portfolio/Dockerfile`
   - Tags: `latest-beta` (staging) or `latest` (production)
   - Pushes to private Docker registry
   
2. **GitHub Actions triggers `03-app-portfolio-deploy.yml`**
   - Pulls new image from registry
   - Restarts containers on VPS
   - Verifies health checks

### Manual Workflow

If workflows don't trigger automatically, SSH to your VPS and run:

```bash
# Update environment variables first
export VPS_HOST="your-vps-hostname-or-ip"
export VPS_USER="root"

# Deploy staging
ssh ${VPS_USER}@${VPS_HOST} "cd /srv/www/portfolio && docker compose -p staging pull && docker compose -p staging up -d"

# Deploy production
ssh ${VPS_USER}@${VPS_HOST} "cd /srv/www/portfolio && docker compose -p production -f docker-compose.prod.yml pull && docker compose -p production -f docker-compose.prod.yml up -d"
```

## Making Updates

### Simple Content Changes (HTML/CSS/JS)

**Recommended approach:** Just push code, workflows handle the rest.

1. **Edit files** in `saas/portfolio/`
2. **Commit and push** to `develop` (staging) or `master` (production)
3. **GitHub Actions automatically:**
   - Builds Docker image
   - Pushes to registry
   - Deploys to VPS
4. **Changes live in 2-3 minutes**

Example:
```bash
cd saas/portfolio
# Edit index.html, style.css, script.js, etc.
git add .
git commit -m "Update portfolio content"
git push origin develop  # Staging
# or
git push origin master   # Production
```

Then monitor deployment in GitHub Actions → "🏗️ Build & Push Portfolio" and "📄 SaaS • Portfolio Deploy"

### Docker Configuration Changes

If you change `Dockerfile` or `nginx.conf`:

1. **Edit files** in `saas/portfolio/`
2. **Commit and push** to branch
3. **Workflow** automatically:
   - Rebuilds Docker image from scratch
   - Deploys new version
4. **Changes live in 2-3 minutes**

## Destroying and Redeploying

### Complete Destruction

```bash
# WARNING: Removes everything (containers, images, directories)
export VPS_HOST="your-vps-hostname-or-ip"
export VPS_USER="root"

ssh ${VPS_USER}@${VPS_HOST} "cd /srv/www/portfolio && \
  docker compose -f docker-compose.yml down -v && \
  docker compose -f docker-compose.prod.yml down -v && \
  docker rmi registry.freijstack.com/portfolio:latest -f && \
  docker rmi registry.freijstack.com/portfolio:latest-beta -f"
```

### Clean Redeploy from Scratch

```bash
# Pull latest images and restart all containers
export VPS_HOST="your-vps-hostname-or-ip"
export VPS_USER="root"

ssh ${VPS_USER}@${VPS_HOST} "cd /srv/www/portfolio && \
  docker compose -p staging pull && \
  docker compose -p staging up -d && \
  docker compose -p production -f docker-compose.prod.yml pull && \
  docker compose -p production -f docker-compose.prod.yml up -d"
```

## File Structure

```
saas/portfolio/
├── Dockerfile              # nginx Alpine image with portfolio
├── docker-compose.yml      # Staging (develop branch)
├── docker-compose.prod.yml # Production (master branch)
├── nginx.conf             # nginx configuration (SPA routing)
├── index.html             # Main portfolio file
├── style.css              # Styling
├── script.js              # JavaScript
└── favicon.svg            # Icon
```

## Workflows

### Build Workflow (`.github/workflows/03-app-portfolio-build.yml`)

**Triggers:**
- Push to `saas/portfolio/**` on `develop` or `master`
- Manual trigger via `workflow_dispatch`

**Jobs:**
1. Security scan (gitleaks, SARIF)
2. Build staging image (`:latest-beta`)
3. Build production image (`:latest`)

**Output:**
- Images pushed to `registry.freijstack.com/portfolio`

### Deploy Workflow (`.github/workflows/03-app-portfolio-deploy.yml`)

**Triggers:**
- Auto-triggers when `03-app-portfolio-build.yml` completes successfully

**Jobs:**
1. Deploy to staging VPS (develop branch)
2. Deploy to production VPS (master branch)
3. Health checks and verification

## Important Notes

### Network Configuration

Traefik must be connected to the `freijstack` network to route traffic:

```bash
docker network connect freijstack traefik
```

This is configured in `base-infra/docker-compose.yml`.

### Health Checks

Containers use `curl` to verify health (Alpine has no `wget`):

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/"]
  interval: 30s
  timeout: 5s
  retries: 3
```

Traefik only routes to healthy containers.

### Updating base-infra

After modifying `base-infra/docker-compose.yml`, SSH to your VPS:

```bash
export VPS_HOST="your-vps-hostname-or-ip"
export VPS_USER="root"

ssh ${VPS_USER}@${VPS_HOST} "cd /srv/www && docker compose -f base-infra/docker-compose.yml up -d"
```

## Troubleshooting

### Gateway Timeout

Usually means Traefik can't reach containers. Check:

```bash
docker network inspect freijstack
# Verify traefik, portfolio-staging, portfolio-prod are listed
```

### Containers Not Healthy

```bash
docker logs portfolio-staging  # Check for errors
docker exec portfolio-staging curl http://localhost/  # Test locally
```

### Build Not Triggering

Push changes to `saas/portfolio/**`:

```bash
echo "<!-- Update -->" >> saas/portfolio/index.html
git add saas/portfolio/index.html
git commit -m "Trigger build"
git push origin develop
```

Then check GitHub Actions tab.

## Rollback

If an update breaks things, GitHub Actions keeps a history of all deployed images. Redeploy a previous version:

```bash
export VPS_HOST="your-vps-hostname-or-ip"
export VPS_USER="root"

# Check available image tags in registry:
# registry.freijstack.com/portfolio:latest-beta
# registry.freijstack.com/portfolio:latest
# Or specific SHA tags for versioning

# To rollback to a specific image version:
ssh ${VPS_USER}@${VPS_HOST} "cd /srv/www/portfolio && \
  docker pull registry.freijstack.com/portfolio:SPECIFIC_TAG && \
  docker compose -p staging up -d"
```

## Next Steps

1. **Test workflow triggers** - push a small change to `saas/portfolio/**`
2. **Monitor GitHub Actions** - ensure `03-app-portfolio-build.yml` and `03-app-portfolio-deploy.yml` complete
3. **Verify deployment** - access portfolio URLs and confirm changes
4. **Enable auto-deploy** - once workflows work, deployments are fully automated
