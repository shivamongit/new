# NovaDock

**One-click Windows POC deployment** — a premium internal platform that wraps NSSM with loop engineering: deploy → verify → retry until healthy.

![NovaDock](https://img.shields.io/badge/platform-Windows%20%7C%20Dev%20simulate-violet)

## Features

- **Premium SaaS dashboard** — dark UI for managing POC applications
- **One-click deploy** — template wizard for Node, Python, .NET, or custom
- **Loop engineering deploy loop** — bounded phases with verification and retry (max 3 attempts)
- **NSSM integration** — real Windows service registration on production hosts
- **Simulate mode** — safe dev/demo without NSSM (default)
- **Deploy logs & history** — auditable halt reasons and phase tracking

## Quick start

```bash
cd novadock
pnpm install
pnpm db:push
pnpm db:seed   # optional demo data
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm test` | Run Vitest tests |
| `pnpm lint` | ESLint |
| `pnpm db:push` | Apply Prisma schema to SQLite |
| `pnpm db:seed` | Seed demo application |

## Windows production setup

1. Run `agent/windows/Install-Agent.ps1` on your Windows server
2. Place `nssm.exe` in `C:\NovaDock\bin\`
3. In NovaDock **Settings**, disable **Simulate mode**
4. Set NSSM path to `C:\NovaDock\bin\nssm.exe`
5. Deploy POCs from the UI — services auto-register via NSSM

## Architecture

```
novadock/
├── src/app/           # Next.js App Router (dashboard, deploy wizard, API)
├── src/lib/
│   ├── deploy-loop/   # Loop engineering engine
│   └── nssm/          # Windows executor + simulator
├── agent/windows/     # PowerShell agent scripts
└── prisma/            # SQLite persistence
```

## Loop engineering

Each deployment runs a bounded loop:

1. **Install** — dependencies (npm ci on Windows)
2. **Register** — NSSM service creation
3. **Start** — service start
4. **Health check** — HTTP probe with retry
5. **Complete** or **halt** with reason

## Design (Google Stitch)

UI is implemented from Stitch-generated designs (project `1486094693945406754`). Reference HTML lives in `stitch-designs/`.

To connect Stitch MCP in Cursor, add to your MCP config:

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "@_davideast/stitch-mcp", "proxy"],
      "env": { "STITCH_API_KEY": "your-key" }
    }
  }
}
```

## Test deployments

```bash
node scripts/test-deployments.mjs http://localhost:3000
```
