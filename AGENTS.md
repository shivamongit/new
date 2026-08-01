# AGENTS.md

Guidance for AI agents working in this repository.

## LoopForge

The main application lives in **`loopforge/`** — a Next.js dashboard for one-click Windows POC deployment via NSSM with loop-engineered deploy loops.

```bash
cd loopforge
pnpm install
pnpm db:push
pnpm db:seed   # optional
pnpm dev
```

Open http://localhost:3000

## Cursor Cloud specific instructions

### Services

| Service | Command | Port |
|---------|---------|------|
| LoopForge UI + API | `cd loopforge && pnpm dev` | 3000 |

### Simulate mode

Default **simulate mode** is enabled in Settings — deploy loops run against a simulated NSSM executor (safe on Linux Cloud VMs). On Windows production hosts, disable simulate mode and set the NSSM path.

### Lint, test, build

Run from `loopforge/`:

- `pnpm lint`
- `pnpm test`
- `pnpm build`

### Database

SQLite at `loopforge/prisma/dev.db`. Schema changes: `pnpm db:push`.

### Windows agent

PowerShell scripts in `loopforge/agent/windows/` — run `Install-Agent.ps1` on Windows servers before production deploys.
