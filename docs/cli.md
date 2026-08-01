# CLI

NovaDock does not ship an official command-line interface in the current release.

## Current alternatives

### REST API

Automate deployments with `curl`, your CI system, or any HTTP client. See [API reference](api.md).

### E2E verification script

```bash
cd novadock
node scripts/test-deployments.mjs http://localhost:3000
```

Creates four sample applications and deploys each through the API—useful for smoke testing after upgrades.

### Database scripts

```bash
pnpm db:push    # Apply schema
pnpm db:seed    # Seed sample application
```

## Planned CLI (`novadock`)

A unified CLI is on the roadmap with commands such as:

| Command | Purpose |
|---------|---------|
| `novadock apps list` | List registered applications |
| `novadock deploy <name>` | Deploy from definition file |
| `novadock logs <name>` | Stream deploy logs |
| `novadock settings` | View and update platform settings |

Until the CLI ships, use the API and web console for all operations.

## Roadmap status

| Item | Status |
|------|--------|
| Official `novadock` CLI package | Planned |
| Declarative app manifests (`novadock.yaml`) | Planned |
| CI/CD integration templates | Planned |
