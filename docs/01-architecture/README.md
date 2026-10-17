# 🏗️ 01-architecture: Understanding FreijStack Design

**Purpose**: Understand system design and architecture  
**Time to read**: 30-60 minutes  
**Previous step**: [../00-overview/](../00-overview/)  
**Next step after reading**: [../02-deployment/](../02-deployment/)

---

## 🎯 What You'll Learn

After reading this directory:
- ✅ How FreijStack is architected
- ✅ What Docker containers are used
- ✅ How the CI/CD pipeline works
- ✅ How components interact
- ✅ System design decisions

---

## 📚 Files in This Directory

### ARCHITECTURE.md
**Best for**: Understanding overall system design  
**Time**: 30 minutes  
**Covers**:
- System architecture overview
- Component relationships
- Infrastructure topology
- Design decisions and rationale

### DOCKER_STRUCTURE.md
**Best for**: Understanding containerization  
**Time**: 20 minutes  
**Covers**:
- Docker container organization
- Service networking
- Volume management
- Container dependencies

### CI_CD_ARCHITECTURE.md
**Best for**: Understanding deployment automation  
**Time**: 20 minutes  
**Covers**:
- GitHub Actions workflow design
- Deployment pipeline flow
- Automation patterns
- Integration points

---

## 🔄 Reading Order

### For Developers
1. **ARCHITECTURE.md** - Get overall picture
2. **CI_CD_ARCHITECTURE.md** - Understand automation
3. **DOCKER_STRUCTURE.md** - Deep dive into containers

### For Operations
1. **ARCHITECTURE.md** - Get overall picture
2. **DOCKER_STRUCTURE.md** - Understand services
3. **CI_CD_ARCHITECTURE.md** - Understand deployment

### For Architects
1. **ARCHITECTURE.md** - Full design
2. **CI_CD_ARCHITECTURE.md** - Pipeline design
3. **DOCKER_STRUCTURE.md** - Implementation details

---

## 🧠 Key Concepts

### System Components
- **Frontend**: Portfolio (static HTML/CSS/JS)
- **Backend**: SecureVault (Node.js + Express)
- **Database**: PostgreSQL
- **Container Registry**: Docker Registry
- **Reverse Proxy**: Traefik
- **Automation**: n8n

### Deployment Strategy
- **Orchestration**: Docker Compose
- **Automation**: GitHub Actions (22 workflows)
- **Queue System**: SSH-based concurrency management
- **Health Checks**: Automated 24/7 monitoring

### Security
- **DevSecOps**: Integrated security scanning
- **Secrets**: GitHub Secrets + environment variables
- **SSL/TLS**: Let's Encrypt via Traefik
- **Scanning**: Gitleaks, CodeQL, Trivy

---

## 📊 System Overview

```
Internet
    ↓
Traefik (Reverse Proxy + SSL)
    ├── Portfolio (Frontend)
    ├── SecureVault (App)
    ├── Registry (Docker)
    └── n8n (Automation)
    ↓
Docker Networking
    ├── Services
    ├── Volumes
    └── Databases
    ↓
GitHub Actions (Automation)
    ├── Security scanning
    ├── Building
    ├── Deployment
    ├── Health checks
    └── Monitoring
```

---

## 🔗 Related Sections

### For Deployment Details
→ [../02-deployment/](../02-deployment/)

### For Operational Guides
→ [../03-guides/](../03-guides/)

### For Implementation History
→ [../../docs-private/00-phases/](../../docs-private/00-phases/)

---

## ⏱️ Time Estimates

| Document | Time | Difficulty |
|----------|------|-----------|
| ARCHITECTURE.md | 30 min | Intermediate |
| DOCKER_STRUCTURE.md | 20 min | Beginner-Intermediate |
| CI_CD_ARCHITECTURE.md | 20 min | Intermediate-Advanced |
| **Total** | **70 min** | **Mixed** |

---

## ✅ Checklist

After reading this directory, you should be able to:
- [ ] Explain the overall system architecture
- [ ] Describe what each Docker container does
- [ ] Explain the GitHub Actions workflow structure
- [ ] Understand how components interact
- [ ] Answer: "Why is it designed this way?"

---

## 🚀 What's Next?

Once you understand the architecture:
1. **To deploy**: Go to [../02-deployment/](../02-deployment/)
2. **To operate**: Go to [../03-guides/](../03-guides/)
3. **For more details**: Go to [../05-reference/](../05-reference/)

---

**Status**: ✅ Complete  
**Updated**: January 2026  
**Level**: Intermediate
