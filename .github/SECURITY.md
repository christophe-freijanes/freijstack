# Security Policy

## Supported Versions
This repository is continuously maintained. Security updates are shipped as needed.

## Reporting a Vulnerability
- Please open a private disclosure by emailing freijstack@gmx.ca.
- Include a clear description, steps to reproduce, and potential impact.
- Do not open public issues for vulnerabilities.

## Responsible Disclosure
We ask researchers to:
- Avoid privacy violations and data destruction.
- Not perform Denial of Service.
- Give us reasonable time to remediate before public disclosure.

## Security Hardening Practices
- Secrets are never committed (.env*, keys, certs ignored).
- CI runs CodeQL, Gitleaks, and Trivy.
- CSP is enabled in `portfolio/index.html`.
- Prefer HTTPS-only endpoints and least-privilege access.
