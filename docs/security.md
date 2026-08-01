# Security

NovaDock is designed for **trusted internal networks** today. This document describes the current security posture and recommended hardening as you move toward production.

## Current posture

| Area | Status |
|------|--------|
| Authentication | Not implemented — console and API are open on the bound port |
| Authorization / RBAC | Not implemented |
| API tokens | `agentToken` field exists in settings schema; not enforced in API routes yet |
| Encryption in transit | Depends on your deployment (TLS termination via reverse proxy) |
| Audit logging | Deploy runs and application history stored in SQLite |
| Secrets management | Environment variables stored in DB; no vault integration |

**Do not expose an unauthenticated NovaDock instance to the public internet.**

## Recommended hardening

### Network

- Bind NovaDock behind a reverse proxy with TLS (IIS, nginx, Caddy, etc.).
- Restrict access with firewall rules or private network segmentation.
- Use VPN or zero-trust access for operator consoles.

### Host (Windows)

- Run application services under dedicated service accounts with least privilege.
- Restrict write access to `C:\NovaDock\apps` to deployment principals only.
- Verify NSSM binary integrity and source (official release or internal artifact).

### Data

- Back up the SQLite database regularly in production.
- Plan migration to PostgreSQL or managed database for HA deployments (roadmap).
- Avoid storing secrets in application `envVars` until vault integration ships; use host-level secret injection where possible.

### Operations

- Review deploy logs and halt reasons after failed deployments.
- Disable simulation mode only on hosts intended for real service registration.
- Rotate any credentials used by workloads independently of NovaDock.

## Auditability

NovaDock records:

- **Deploy runs** — phase, attempt count, success flag, logs, halt reason, timestamps
- **Application state** — status transitions, `lastError`, PID when available
- **Settings changes** — via API (UI save); centralized audit stream planned

Export deploy history through the API (`GET /api/apps/{id}` includes `deployRuns`).

## Reporting vulnerabilities

Please report security issues privately to repository maintainers rather than opening public issues. See [CONTRIBUTING.md](../CONTRIBUTING.md).

## Roadmap

| Capability | Status |
|------------|--------|
| Authentication (SSO / API keys) | Planned |
| Role-based access control | Planned |
| Enforced agent tokens | Planned |
| Secrets vault integration | Planned |
| Signed deployment artifacts | Planned |
