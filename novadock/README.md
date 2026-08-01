# NovaDock Application

This directory contains the NovaDock **control plane**—the web console, REST API, deployment orchestrator, and datastore.

For the full product overview, architecture, and roadmap, see the [repository README](../README.md).

## Quick start

```bash
pnpm install
pnpm db:push
pnpm dev
```

→ http://localhost:3000

## Documentation

All guides live in the repository [`docs/`](../docs/README.md) folder:

- [Deployment](../docs/deployment.md)
- [API](../docs/api.md)
- [Configuration](../docs/configuration.md)
- [Runtime](../docs/runtime.md)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm test` | Orchestrator tests |
| `pnpm lint` | ESLint |
| `pnpm db:push` | Apply database schema |
| `pnpm db:seed` | Seed sample application |

## Structure

```
src/app/           # UI routes and API handlers
src/lib/deploy-loop/   # Deployment orchestrator
src/lib/nssm/          # Runtime executor and simulator
agent/windows/     # Host installation scripts
prisma/            # SQLite schema
```
