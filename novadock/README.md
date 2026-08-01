<div align="center">

<img src="public/logo.png" alt="NovaDock" width="180" />

# NovaDock

**Snap POCs to Windows**

[![platform](https://img.shields.io/badge/platform-Windows%20%7C%20Dev%20simulate-00f5ff)]()
[![loop](https://img.shields.io/badge/deploy-loop-engineered-571bc1)]()
[![ui](https://img.shields.io/badge/UI-Stitch%20design-63f7ff)]()

</div>

Premium internal platform for one-click Windows POC deployment. Wraps **NSSM** with **loop engineering**: deploy → verify → retry until healthy (max 3 attempts).

## Screens

| Dashboard | Deploy wizard |
|:---:|:---:|
| Dark aurora shell with live stats | Template picker + one-click deploy |

Reference HTML from Stitch: `stitch-designs/dashboard.html`, `stitch-designs/deploy.html`.

## Quick start

```bash
pnpm install
pnpm db:push
pnpm db:seed   # optional demo data
pnpm dev
```

→ **http://localhost:3000**

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server (port 3000) |
| `pnpm build` | Production build |
| `pnpm test` | Vitest — deploy loop tests |
| `pnpm lint` | ESLint |
| `pnpm db:push` | Apply Prisma schema to SQLite |
| `pnpm db:seed` | Seed demo application |

## E2E test (4 POC deployments)

```bash
node scripts/test-deployments.mjs http://localhost:3000
```

Creates four apps (Node, Python, .NET-style, custom) and deploys each through the API until **RUNNING**.

## Windows production setup

1. Run `agent/windows/Install-Agent.ps1` on your Windows server
2. Place `nssm.exe` in `C:\NovaDock\bin\`
3. In NovaDock **Settings**, disable **Simulate mode**
4. Set NSSM path to `C:\NovaDock\bin\nssm.exe`
5. Deploy POCs from the UI — services auto-register as `NovaDock-{slug}`

Default app path: `C:\NovaDock\apps\`

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Dashboard
│   ├── apps/new/           # Deploy wizard
│   ├── apps/[id]/          # App detail + actions
│   ├── settings/           # Simulate mode, NSSM path
│   └── api/                # REST API
├── lib/
│   ├── deploy-loop/        # Loop engineering engine
│   ├── nssm/               # simulator.ts + windows-executor.ts
│   └── apps-service.ts     # Prisma-backed app CRUD
└── components/stitch/      # Aurora shader, sidebar, orbital graphic
```

### Deploy loop phases

1. **Install** — dependencies (`npm ci` on Windows)
2. **Register** — NSSM service creation
3. **Start** — service start
4. **Health check** — HTTP probe with retry
5. **Complete** or **halt** with auditable reason

## Simulate mode

Default **ON** on non-Windows hosts. The simulator mimics NSSM lifecycle so you can develop and demo on Linux/macOS without a Windows agent.

## Google Stitch

UI and logo were designed in Stitch and ported to React.

- Project ID: `1486094693945406754`
- Logo: `public/logo.png`
- Reference screens: `stitch-designs/`

Connect Stitch MCP in Cursor:

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

## Agent scripts

See [agent/windows/README.md](agent/windows/README.md) for the PowerShell installation agent.
