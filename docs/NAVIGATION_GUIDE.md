<a id="-freijstack-documentation-navigation-guide"></a>
# FreijStack Documentation Navigation Guide

**Purpose**: Help users find the right documentation quickly  

---

<a id="-start-here-based-on-your-role"></a>
## Start Here Based on Your Role

<a id="-new-user--getting-started"></a>
### New User / Getting Started
```
START → docs/00-overview/QUICK_DEPLOY_GUIDE.md
        ↓
        docs/00-overview/README.md
        ↓
        docs/01-architecture/ARCHITECTURE.md
        ↓
        docs/02-deployment/DEPLOYMENT.md
```

<a id="-infrastructure-engineer"></a>
### Infrastructure Engineer
```
START → docs/01-architecture/DOCKER_STRUCTURE.md
        ↓
        docs/01-architecture/CI_CD_ARCHITECTURE.md
        ↓
        docs-private/00-phases/PHASE_1_COMPLETION.md
        ↓
        docs/02-deployment/PRO_DEPLOYMENT.md
```

<a id="-devops--operations"></a>
### DevOps / Operations
```
START → docs/01-architecture/CI_CD_ARCHITECTURE.md
        ↓
        docs-private/00-phases/PHASE_2_COMPLETION.md (workflows)
        ↓
        docs-private/00-phases/PHASE_3_COMPLETION.md (deploy queue)
        ↓
        docs/03-guides/AUTOMATION_GUIDE.md
        ↓
        docs/04-operations/TROUBLESHOOTING.md
```

<a id="-security--compliance"></a>
### Security / Compliance
```
START → docs/SECURITY.md (root level)
        ↓
        docs-private/00-phases/PHASE_5_COMPLETION.md (security)
        ↓
        docs-private/00-phases/PHASE_6_COMPLETION.md (audit)
        ↓
        docs/03-guides/MONITORING.md
```

<a id="-manager--project-lead"></a>
### Manager / Project Lead
```
START → docs/00-overview/README.md
        ↓
        docs-private/00-phases/README.md (all phases)
        ↓
        ROADMAP / STATUS
        ↓
        docs/05-reference/FEATURES_ROADMAP.md
```

---

<a id="-documentation-map"></a>
## Documentation Map

### Category: 00-overview
**Level**: Beginner  
**Purpose**: Get started and understand the basics

| Document | Best For | When to Read |
|----------|----------|--------------|
| **INDEX.md** | Guided tour | First time |
| **QUICK_DEPLOY_GUIDE.md** | Initial setup | Initial deployment |
| **USER_GUIDE.md** | End user documentation | Daily operations |
| **README.md** | Project overview | Context setting |

**Flow**: INDEX → QUICK_DEPLOY → USER_GUIDE → Move to next category

---

### Category: 01-architecture
**Level**: Intermediate  
**Purpose**: Understand how the system is built

| Document | Best For | When to Read |
|----------|----------|--------------|
| **ARCHITECTURE.md** | System design | Understanding design |
| **DOCKER_STRUCTURE.md** | Container organization | Container questions |
| **CI_CD_ARCHITECTURE.md** | Pipeline design | Deployment questions |

**Flow**: ARCHITECTURE → DOCKER_STRUCTURE → CI_CD_ARCHITECTURE

---

### Category: 02-deployment
**Level**: Intermediate-Advanced  
**Purpose**: How to deploy applications

| Document | Best For | When to Read |
|----------|----------|--------------|
| **DEPLOYMENT.md** | Standard deployment | Initial deployments |
| **PRO_DEPLOYMENT.md** | Production procedures | Before prod deploy |
| **SECUREVAULT_DEPLOYMENT.md** | App-specific guide | Deploying SecureVault |

**Flow**: DEPLOYMENT → PRO_DEPLOYMENT → App-specific guides

---

### Category: 03-guides
**Level**: Intermediate-Advanced  
**Purpose**: How to operate and manage systems

| Document | Best For | When to Read |
|----------|----------|--------------|
| **AUTOMATION_GUIDE.md** | GitHub Actions guidance | Creating workflows |
| **CLOUD_BACKUP.md** | Backup procedures | Setting up backups |
| **MONITORING.md** | Monitoring setup | Setting up monitoring |

**Flow**: Pick guide for your task → Follow procedures

---

### Category: 04-operations
**Level**: Advanced  
**Purpose**: Troubleshooting and maintenance

| Document | Best For | When to Read |
|----------|----------|--------------|
| **TROUBLESHOOTING.md** | General issue diagnosis | Something broken |
| **TROUBLESHOOTING_GATEWAY_TIMEOUT.md** | Specific 504 errors | 504 Gateway Timeout |

**Flow**: TROUBLESHOOTING → Find issue → Follow solution

---

### Category: 05-reference
**Level**: Advanced  
**Purpose**: Detailed specifications and checklists

| Document | Best For | When to Read |
|----------|----------|--------------|
| **RELEASE_WORKFLOW.md** | Release procedures | Releasing version |
| **CHECKLIST_AUTOMATION.md** | Automation checklists | Before automation |
| **FEATURES_ROADMAP.md** | Planned features | Planning features |
| **AUDIT_SYSTEM.md** | Audit procedures | Auditing system |
| **DOCUMENTATION_AUDIT.md** | Documentation standards | Maintaining docs |

**Flow**: Search for what you need → Read specific document

---

### Archive: 00-phases
**Level**: Historical Reference  
**Purpose**: Implementation history and context

| Document | Focus | When to Read |
|----------|-------|--------------|
| **PHASE_1_COMPLETION.md** | Foundation & infrastructure | Understanding base |
| **PHASE_2_COMPLETION.md** | CI/CD automation | Understanding workflows |
| **PHASE_3_COMPLETION.md** | Deploy queue system | Understanding coordination |
| **PHASE_4_COMPLETION.md** | Health checking | Understanding monitoring |
| **PHASE_5_COMPLETION.md** | Security integration | Understanding security |
| **PHASE_6_COMPLETION.md** | Consolidation | Understanding current state |
| **PHASE_7_COMPLETION.md** | Organization | Understanding structure |
| **README.md** | Phase index | Navigating phases |

**Flow**: README → Pick phase → Read completion

---

<a id="-quick-search-by-topic"></a>
## Quick Search by Topic

### Need to...

#### Deploy an application?
1. Read: `docs/02-deployment/DEPLOYMENT.md` (general)
2. Read: `docs/02-deployment/PRO_DEPLOYMENT.md` (production)
3. Reference: `docs-private/00-phases/PHASE_2_COMPLETION.md` (how workflows work)

#### Fix a broken deployment?
1. Read: `docs/04-operations/TROUBLESHOOTING.md` (diagnose)
2. Check: `docs-private/00-phases/PHASE_3_COMPLETION.md` (deploy queue)
3. Check: `docs-private/00-phases/PHASE_4_COMPLETION.md` (health checks)

#### Create a new workflow?
1. Read: `docs/03-guides/AUTOMATION_GUIDE.md` (guide)
2. Reference: `docs/01-architecture/CI_CD_ARCHITECTURE.md` (design)
3. Reference: `docs-private/00-phases/PHASE_2_COMPLETION.md` (examples)

#### Monitor the system?
1. Read: `docs/03-guides/MONITORING.md` (setup)
2. Reference: `docs-private/00-phases/PHASE_4_COMPLETION.md` (health checks)
3. Reference: `docs-private/00-phases/PHASE_5_COMPLETION.md` (security)

#### Understand system security?
1. Read: `SECURITY.md` (root level)
2. Reference: `docs-private/00-phases/PHASE_5_COMPLETION.md` (DevSecOps)
3. Reference: `docs-private/00-phases/PHASE_6_COMPLETION.md` (audit)

#### Prepare for production?
1. Read: `docs/02-deployment/PRO_DEPLOYMENT.md` (checklist)
2. Reference: `docs-private/00-phases/PHASE_6_COMPLETION.md` (production readiness)
3. Reference: `docs/05-reference/CHECKLIST_AUTOMATION.md` (verification)

#### Release a new version?
1. Read: `docs/05-reference/RELEASE_WORKFLOW.md` (process)
2. Reference: `docs-private/00-phases/PHASE_7_COMPLETION.md` (workflow organization)

---

<a id="-documentation-path-by-experience-level"></a>
## Documentation Path by Experience Level

### Level 1: Complete Beginner (0-1 weeks)
```
00-overview/INDEX.md (15 min)
    ↓
00-overview/QUICK_DEPLOY_GUIDE.md (10 min)
    ↓
01-architecture/ARCHITECTURE.md (30 min)
    ↓
00-overview/USER_GUIDE.md (15 min)
    ↓
02-deployment/DEPLOYMENT.md (20 min)

Total: ~90 minutes to basic competency
```

### Level 2: Intermediate (1-4 weeks)
```
01-architecture/ (full, 60 min)
    ↓
02-deployment/ (full, 40 min)
    ↓
03-guides/ (30 min)
    ↓
docs-private/00-phases/PHASE_2_COMPLETION.md (30 min)
    ↓
04-operations/TROUBLESHOOTING.md (20 min)

Total: ~180 minutes to operational competency
```

### Level 3: Advanced (4-12 weeks)
```
All documentation (full review)
    ↓
docs-private/00-phases/ (all phases, 270 min)
    ↓
05-reference/ (full, variable)
    ↓
Source code review
    ↓
Production readiness assessment

Total: 500+ minutes to expert competency
```

---

<a id="-finding-things"></a>
## Finding Things

### By Feature
- **Portfolio**: `docs/02-deployment/DEPLOYMENT.md`
- **SecureVault**: `docs/02-deployment/SECUREVAULT_DEPLOYMENT.md`
- **Registry**: `docs/02-deployment/DEPLOYMENT.md`
- **Traefik**: `docs/01-architecture/DOCKER_STRUCTURE.md`
- **n8n**: `docs/01-architecture/DOCKER_STRUCTURE.md`

### By Task
- **Setup**: `docs/00-overview/QUICK_DEPLOY_GUIDE.md`
- **Deploy**: `docs/02-deployment/DEPLOYMENT.md`
- **Monitor**: `docs/03-guides/MONITORING.md`
- **Backup**: `docs/03-guides/CLOUD_BACKUP.md`
- **Troubleshoot**: `docs/04-operations/TROUBLESHOOTING.md`
- **Secure**: `SECURITY.md` (root)

### By Technology
- **Docker**: `docs/01-architecture/DOCKER_STRUCTURE.md`
- **GitHub Actions**: `docs/01-architecture/CI_CD_ARCHITECTURE.md`
- **SSH**: `docs-private/00-phases/PHASE_3_COMPLETION.md`
- **Health Checks**: `docs-private/00-phases/PHASE_4_COMPLETION.md`
- **Security Scanning**: `docs-private/00-phases/PHASE_5_COMPLETION.md`

---

<a id="-reading-order-recommendations"></a>
## Reading Order Recommendations

### For Deployment Team
```
1. docs/00-overview/QUICK_DEPLOY_GUIDE.md
2. docs/02-deployment/DEPLOYMENT.md
3. docs/02-deployment/PRO_DEPLOYMENT.md
4. docs/04-operations/TROUBLESHOOTING.md
5. docs-private/00-phases/PHASE_2_COMPLETION.md
```

### For Operations Team
```
1. docs/01-architecture/ARCHITECTURE.md
2. docs/01-architecture/CI_CD_ARCHITECTURE.md
3. docs/03-guides/MONITORING.md
4. docs/04-operations/TROUBLESHOOTING.md
5. docs-private/00-phases/ (all phases)
```

### For Security Team
```
1. SECURITY.md (root)
2. docs-private/00-phases/PHASE_5_COMPLETION.md
3. docs-private/00-phases/PHASE_6_COMPLETION.md
4. docs/02-deployment/PRO_DEPLOYMENT.md
5. docs/03-guides/MONITORING.md
```

---

<a id="-tips-for-using-this-documentation"></a>
## Tips for Using This Documentation

### Tip 1: Start with Overview
New users should always start with `00-overview/` category first.

### Tip 2: Use Phase Documents for Context
If something confuses you, check the corresponding phase document for deeper context.

### Tip 3: Follow Learning Path
Don't jump to 05-reference. Build knowledge progressively: 00 → 01 → 02 → 03 → 04 → 05.

### Tip 4: Check Related Files
Each document links to related documents. Follow those links when curious.

### Tip 5: When Stuck
1. Check TROUBLESHOOTING.md first (04-operations)
2. Then check phase documents (docs-private/00-phases)
3. Then check source code comments

---

<a id="-learning-outcomes-by-category"></a>
## Learning Outcomes by Category

### After Reading 00-overview
Project purpose, initial deployment and documentation entry points.

### After Reading 01-architecture
System design and components.

### After Reading 02-deployment
Deployment procedures and production checklist.

### After Reading 03-guides
Automation, backups and monitoring.

### After Reading 04-operations
Diagnosis, common problems and escalation.

### After Reading 05-reference
Specifications and change planning.

### After Reading 00-phases
Implementation history and design decisions.

---

**Last Updated**: January 2026  
**Maintained By**: FreijStack Team  
**Version**: 1.0 (Phase 7 Reorganization)
