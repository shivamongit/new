# NovaDock Documentation

NovaDock is a **Windows application deployment platform** that gives teams a control plane for registering workloads, orchestrating deployments, and operating services with confidence.

## Start here

| Guide | Description |
|-------|-------------|
| [Architecture](architecture.md) | Platform components and data flow |
| [Deployment](deployment.md) | How deployments work end to end |
| [Configuration](configuration.md) | Settings, paths, and environment |
| [Runtime](runtime.md) | Windows Service Runtime and lifecycle |
| [API](api.md) | REST endpoints for automation |
| [Security](security.md) | Security posture and hardening guidance |
| [Best practices](best-practices.md) | Production recommendations |
| [Troubleshooting](troubleshooting.md) | Common issues and resolutions |
| [FAQ](faq.md) | Frequently asked questions |
| [CLI](cli.md) | Command-line interface (planned) |

## Product surfaces

| Surface | Path | Purpose |
|---------|------|---------|
| Dashboard | `/` | Fleet overview, KPIs, application list |
| Deploy wizard | `/apps/new` | Register and deploy a new application |
| Application detail | `/apps/[id]` | Configuration, deploy logs, history |
| Settings | `/settings` | Platform and runtime configuration |

## Quick reference

```bash
cd novadock
pnpm install && pnpm db:push && pnpm dev
```

Default URL: **http://localhost:3000**

For the full product overview and roadmap, see the [repository README](../README.md).
