# 🔧 04-operations: Troubleshooting & Problem Solving

**Purpose**: Diagnose and fix system issues  
**Time to read**: Variable (per issue)  
**Previous step**: [../03-guides/](../03-guides/)  
**Next step after reading**: [../05-reference/](../05-reference/)

---

## 🎯 What You'll Learn

After reading this directory:
- ✅ How to diagnose common problems
- ✅ How to interpret error messages
- ✅ How to fix broken deployments
- ✅ How to restore service quickly
- ✅ When to escalate issues

---

## 📚 Files in This Directory

### TROUBLESHOOTING.md
**Best for**: General problem diagnosis  
**Time**: 20-30 minutes (per issue)  
**Covers**:
- Common issues and solutions
- Diagnostic procedures
- Log interpretation
- Service restart procedures
- Escalation guidelines

### TROUBLESHOOTING_GATEWAY_TIMEOUT.md
**Best for**: Fixing 504 Gateway Timeout errors  
**Time**: 10-15 minutes  
**Covers**:
- Why 504 errors happen
- Diagnosis procedures
- Quick fixes
- Long-term solutions
- Prevention strategies

---

## 🆘 Problem Diagnosis Flow

```
Something is broken
    ↓
Check health status
    ├─ Green → Check if it's user-facing
    └─ Red → See TROUBLESHOOTING.md
    ↓
Identify which service/component
    ├─ Portfolio → Frontend issue
    ├─ SecureVault → Backend/DB issue
    ├─ Registry → Storage issue
    └─ Infrastructure → System issue
    ↓
Check logs for error messages
    ↓
Match error to solution in docs
    ↓
Execute fix procedure
    ↓
Verify fix worked
    ↓
Success! Or escalate if not
```

---

## 🚨 Common Issues Quick Links

| Issue | Solution |
|-------|----------|
| 504 Gateway Timeout | TROUBLESHOOTING_GATEWAY_TIMEOUT.md |
| Service not responding | TROUBLESHOOTING.md |
| Deployment failed | TROUBLESHOOTING.md + [../02-deployment/](../02-deployment/) |
| Out of disk space | TROUBLESHOOTING.md |
| Database connection error | TROUBLESHOOTING.md |
| SSL certificate issue | TROUBLESHOOTING.md |

---

## 🔍 Diagnostic Tools

### Checking System Health
```bash
# Via dashboard
Dashboard → Health Status

# Via logs
Docker logs [container-name]

# Via curl
curl https://service.freijstack.com/health
```

### Identifying Issues
```bash
# Check container status
docker ps

# View recent logs
docker logs --tail 100 [container]

# Check disk space
df -h

# Check memory usage
free -m
```

### Verifying Fixes
```bash
# Restart service
docker-compose restart [service]

# Check health
curl https://service.freijstack.com

# Verify deployment
docker ps | grep [service]
```

---

## 📋 Troubleshooting Checklist

### For Any Problem
- [ ] Verify which service is affected
- [ ] Check health dashboard
- [ ] Review recent logs
- [ ] Note exact error message
- [ ] Check if recent deployment caused it
- [ ] Review TROUBLESHOOTING.md

### For 504 Errors Specifically
- [ ] Check if service is running
- [ ] Check if service is responding
- [ ] Check Traefik logs
- [ ] Follow TROUBLESHOOTING_GATEWAY_TIMEOUT.md

### Before Escalating
- [ ] Verified the issue
- [ ] Attempted simple fix (restart)
- [ ] Checked documentation
- [ ] Collected logs
- [ ] Noted timeline of events

---

## 🔄 Common Fix Procedures

### Restart a Service
```bash
# SSH to VPS
ssh ubuntu@[vps-ip]

# Go to compose directory
cd /path/to/docker-compose

# Restart service
docker-compose restart [service-name]

# Verify health
curl https://[service].freijstack.com
```

### View Service Logs
```bash
# Most recent logs
docker logs [container-name]

# Follow logs in real-time
docker logs -f [container-name]

# Last 100 lines
docker logs --tail 100 [container-name]

# Timestamps included
docker logs --timestamps [container-name]
```

### Check Service Status
```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Inspect container
docker inspect [container-name]

# Check health
docker ps --format "table {{.Names}}\t{{.Status}}"
```

---

## ⏱️ Response Times

### Critical Issues (Red)
- Diagnosis: 1-2 minutes
- Fix attempt: 5-10 minutes
- Escalation: Immediately if not fixed in 10 min

### High Priority (Orange)
- Diagnosis: 5-10 minutes
- Fix attempt: 15-30 minutes
- Escalation: If not fixed in 30 min

### Medium Priority (Yellow)
- Diagnosis: 10-15 minutes
- Fix attempt: 30-60 minutes
- Escalation: Next business day

### Low Priority (Green)
- Diagnosis: When available
- Fix attempt: Within 24-48 hours
- Escalation: As resource allows

---

## 📞 Escalation Path

### Level 1: Self-Service
- Check documentation
- Restart service
- Clear caches
- Retry operation

### Level 2: Team Support
- Provide logs to team
- Ask for pair debugging
- Run team diagnostics

### Level 3: Expert Consultation
- Consult with architect
- Review phase documentation
- Deep system analysis

### Level 4: Emergency
- All hands on deck
- Page on-call engineer
- Activate incident response

---

## 🔗 Related Sections

### For Understanding Why Issues Happen
→ [../01-architecture/](../01-architecture/)

### For Deployment Issues
→ [../02-deployment/](../02-deployment/)

### For Prevention Strategies
→ [../03-guides/](../03-guides/)

### For Implementation Details
→ [../../docs-private/00-phases/](../../docs-private/00-phases/)

---

## 📊 Time Estimates

| Document | Issue Complexity | Time | Recovery Time |
|----------|-----------------|------|----------------|
| TROUBLESHOOTING.md | General | 20-30 min | 5-30 min |
| TROUBLESHOOTING_GATEWAY_TIMEOUT.md | Specific | 10-15 min | 2-10 min |
| **Typical incident** | **Moderate** | **30 min** | **10 min** |

---

## ✅ When to Escalate

Escalate immediately if:
- [ ] Service is completely down (Red)
- [ ] Multiple services affected
- [ ] Users reporting widespread issues
- [ ] Issue affecting production
- [ ] Unknown error message
- [ ] Attempted fix didn't work

---

## 💡 Prevention Tips

### Tip 1: Monitor Proactively
Don't wait for issues to be reported - monitor metrics continuously

### Tip 2: Test Changes First
Always test in staging before production deployment

### Tip 3: Keep Backups Fresh
Verify backups work by testing restore procedures

### Tip 4: Update Documentation
Keep runbooks current as systems evolve

### Tip 5: Learn from Incidents
Document lessons learned from each incident

---

## 🚀 What's Next?

After troubleshooting:
1. **For detailed specs**: Go to [../05-reference/](../05-reference/)
2. **For implementation details**: Go to [../../docs-private/00-phases/](../../docs-private/00-phases/)
3. **For prevention**: Go to [../03-guides/](../03-guides/)

---

**Status**: ✅ Complete  
**Updated**: January 2026  
**Level**: Intermediate-Advanced
