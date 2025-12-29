# Pull Request Checklist

## Description
- Summary of changes:
- Context/Issue link:

## Folder Changes
- [ ] Updated README in each changed folder:
  - [ ] docs/
  - [ ] portfolio/
  - [ ] saas/
  - [ ] saas/app1/
  - [ ] saas/app2/

## Security & Compliance
- [ ] No secrets committed (.env*, keys, certs, tokens)
- [ ] Reviewed [.github/SECURITY.md](../.github/SECURITY.md) for disclosure and practices
- [ ] If security-impacting, label PR `security` and describe risk/mitigation

## CI & Quality
- [ ] Lint/Build pass locally (optional)
- [ ] CI checks pass (CodeQL, Gitleaks, Trivy, README consistency)
- [ ] Minified assets handled:
  - [ ] CSS minified by CI (`style.min.css`) and referenced in `portfolio/index.html`
  - [ ] JS minified by CI (`script.min.js`) and referenced when applicable

## UX & Accessibility (Portfolio)
- [ ] Responsive verified at breakpoints (≤480px, ≤360px, ≤768px)
- [ ] WCAG AA contrast and semantics preserved
- [ ] CSP remains valid for new assets/domains

## Deployment
- [ ] Target branch correct (`develop` → staging, `master` → production)
- [ ] Changelog/notes added if user-facing changes

---

### Additional Notes
- Provide screenshots or links to staging if applicable.
