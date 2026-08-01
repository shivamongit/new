# AGENTS.md

## NovaDock

Windows application deployment platform in **`novadock/`**.

```bash
cd novadock && pnpm install && pnpm db:push && pnpm dev
```

Documentation: [`docs/README.md`](docs/README.md)

## Cursor Cloud

- Dev server: `cd novadock && pnpm dev` → port 3000
- Simulation mode default ON (no Windows Service Runtime on Linux VMs)
- Tests: `cd novadock && pnpm test`
- E2E smoke test: `cd novadock && node scripts/test-deployments.mjs http://localhost:3000`
- VM update script: `cd novadock && pnpm install`
- Branding assets: `novadock/public/logo.png`
