# AGENTS.md

## NovaDock

Windows POC deployment platform in **`novadock/`**.

```bash
cd novadock && pnpm install && pnpm db:push && pnpm dev
```

## Cursor Cloud

- Dev server: `cd novadock && pnpm dev` → port 3000
- Simulate mode default ON (no NSSM on Linux VMs)
- Tests: `cd novadock && pnpm test`
- VM update script: `cd novadock && pnpm install`
