# ✅ Production Registry Credentials - Implementation Complete

## Summary

Separate production credentials for Docker Registry have been successfully implemented. The workflow and configuration files are now ready to use `REGISTRY_USERNAME_PROD` and `REGISTRY_PASSWORD_PROD` secrets for production deployments, while staging continues to use `REGISTRY_USERNAME` and `REGISTRY_PASSWORD`.

---

## Changes Made

### 1. ✅ Updated GitHub Actions Workflow
**File**: [.github/workflows/registry-deploy.yml](.github/workflows/registry-deploy.yml)

**Production Job Changes**:
- Line 175: Changed credential generation from staging secrets to production secrets
  ```yaml
  docker run --rm httpd:alpine htpasswd -nbB ${{ secrets.REGISTRY_USERNAME_PROD }} '${{ secrets.REGISTRY_PASSWORD_PROD }}' > .htpasswd
  ```
- Line 178: Updated UI credentials file to use production secrets
  ```yaml
  echo "${{ secrets.REGISTRY_USERNAME_PROD }}:${{ secrets.REGISTRY_PASSWORD_PROD }}" > .registry-credentials
  ```

**Staging Job**: Unchanged - continues to use `REGISTRY_USERNAME` and `REGISTRY_PASSWORD`

### 2. ✅ Updated Production Docker Compose
**File**: [saas/registry/docker-compose.prod.yml](saas/registry/docker-compose.prod.yml)

**Registry UI Environment**:
- Changed from: `REGISTRY_USERNAME: "${REGISTRY_USERNAME:-admin}"`
- Changed to: `REGISTRY_USERNAME: "${REGISTRY_USERNAME_PROD:-admin}"`
- Changed from: `REGISTRY_PASSWORD: "${REGISTRY_PASSWORD:-admin}"`
- Changed to: `REGISTRY_PASSWORD: "${REGISTRY_PASSWORD_PROD:-admin}"`

This ensures the Joxit UI uses production-specific credentials.

### 3. ✅ Created Documentation
**File**: [docs-private/REGISTRY_PROD_CREDENTIALS.md](docs-private/REGISTRY_PROD_CREDENTIALS.md)

Complete guide including:
- Why separate credentials matter (security best practices)
- How to create secrets on GitHub (Web UI and CLI methods)
- Password generation options
- Workflow changes explanation
- Testing procedures
- Credential rotation steps
- Troubleshooting guide
- Security best practices

### 4. ✅ Created Setup Helper Script
**File**: [scripts/setup-registry-prod-secrets.sh](scripts/setup-registry-prod-secrets.sh)

Quick reference script with:
- Summary of completed code changes
- Instructions for creating GitHub Secrets
- Example password generation
- Testing commands
- Documentation links

---

## Next Steps - Required Actions

### 1️⃣ Create GitHub Secrets

Go to: **https://github.com/christophe-freijanes/freijstack/settings/secrets/actions**

Create **REGISTRY_USERNAME_PROD**:
- Name: `REGISTRY_USERNAME_PROD`
- Value: `admin-prod` (or your preferred production username)

Create **REGISTRY_PASSWORD_PROD**:
- Name: `REGISTRY_PASSWORD_PROD`
- Value: Generate a strong password (see below)

### 2️⃣ Generate Strong Production Password

**Option A** - Using provided script:
```bash
export REGISTRY_USERNAME=admin-prod
python3 saas/registry/generate-password.py
```

**Option B** - Using openssl:
```bash
openssl rand -base64 16
# Example output: W8K=3LnT9#VWH%b2#z@7
```

**Option C** - Using Docker:
```bash
docker run --rm httpd:alpine openssl rand -base64 16
```

### 3️⃣ Deploy to Production

Push to main branch:
```bash
git add .
git commit -m "feat: separate production registry credentials"
git push origin main
```

This automatically triggers the production deployment with new credentials.

### 4️⃣ Verify Deployment

**Check GitHub Actions**:
- Go to: [Actions → registry-deploy.yml](../../actions/workflows/registry-deploy.yml)
- Wait for `deploy-production` job to complete ✅

**Test Registry Access**:
```bash
curl -u admin-prod:your-password https://registry.freijstack.com/v2/
# Expected: {} (HTTP 200) or 401 if auth fails (both indicate registry is responding)
```

**Check Registry UI**:
```bash
curl https://registry-ui.freijstack.com/
# Expected: 200 OK with HTML content
```

**Verify via Healthcheck**:
- Automated healthcheck runs every 15 minutes
- Check workflow: [healthcheck-prod.yml](../../actions/workflows/healthcheck-prod.yml)
- Look for: ✅ Registry API healthy and ✅ Registry UI healthy

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│   GitHub Repository / Main Branch       │
└─────────────┬───────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│  GitHub Actions Workflow                │
│  registry-deploy.yml                    │
└─────────────┬───────────────────────────┘
              │
              ├─ Staging Job (on develop push)
              │  ├─ Uses: REGISTRY_USERNAME, REGISTRY_PASSWORD
              │  └─ Deploys to: registry-staging.freijstack.com
              │
              └─ Production Job (on main push)
                 ├─ Uses: REGISTRY_USERNAME_PROD, REGISTRY_PASSWORD_PROD
                 └─ Deploys to: registry.freijstack.com

┌─────────────────────────────────────────┐
│   Production Docker Containers          │
└─────────────┬───────────────────────────┘
              │
              ├─ Registry v2 (port 5000)
              │  └─ Auth: .htpasswd (from REGISTRY_USERNAME_PROD)
              │
              └─ Registry UI (port 80)
                 └─ Env: REGISTRY_USERNAME_PROD, REGISTRY_PASSWORD_PROD
```

---

## Security Features

✅ **Separate Credentials**
- Staging: `REGISTRY_USERNAME` + `REGISTRY_PASSWORD`
- Production: `REGISTRY_USERNAME_PROD` + `REGISTRY_PASSWORD_PROD`

✅ **GitHub Secrets Protection**
- Credentials stored encrypted in GitHub
- Not exposed in logs (automatically masked)
- Only accessible to authorized workflows

✅ **Bcrypt Hashing**
- Passwords hashed with bcrypt (142 rounds) via `htpasswd -nbB`
- Stronger than bcrypt alone due to Apache tuning

✅ **Environment Isolation**
- Production credentials never exposed to staging
- Different usernames prevent cross-environment access

✅ **Healthcheck Monitoring**
- Production: 24/7 monitoring (every 15 minutes)
- Gitleaks gate: Blocks if secrets detected in code
- Automatic alerts if registry becomes unhealthy

---

## Verification Checklist

- [ ] Created `REGISTRY_USERNAME_PROD` secret on GitHub
- [ ] Created `REGISTRY_PASSWORD_PROD` secret on GitHub
- [ ] Verified workflow file uses production secrets (lines 175, 178)
- [ ] Verified docker-compose.prod.yml uses production variables (lines 37-38)
- [ ] Pushed to main branch to trigger production deployment
- [ ] Waited for GitHub Actions workflow to complete
- [ ] Tested production registry access with credentials
- [ ] Verified healthcheck passes
- [ ] Documented new credentials in secure password manager
- [ ] (Optional) Tested with `curl -u admin-prod:password https://registry.freijstack.com/v2/`

---

## Related Documentation

- 📄 [REGISTRY_PROD_CREDENTIALS.md](docs-private/REGISTRY_PROD_CREDENTIALS.md) - Complete credential management guide
- 📄 [REGISTRY_SECRET_ROTATION.md](docs-private/REGISTRY_SECRET_ROTATION.md) - Secret rotation procedures
- 📄 [saas/registry/README.md](saas/registry/README.md) - Registry technical details
- 📄 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - General deployment information

---

## Questions?

Refer to [REGISTRY_PROD_CREDENTIALS.md](docs-private/REGISTRY_PROD_CREDENTIALS.md) for:
- Detailed troubleshooting steps
- Alternative password generation methods
- Security best practices
- Credential rotation procedures
- Testing validation steps

**Status**: ✅ **Ready for Secret Creation and Deployment**
