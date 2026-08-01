# Configuration

NovaDock configuration spans **platform settings** (stored in the database), **application definitions** (per workload), and **host preparation** (Windows directories and runtime binary).

## Platform settings

Open **Settings** (`/settings`) or use the API.

| Setting | Description | Default |
|---------|-------------|---------|
| Applications root | Base directory for application files on Windows | `C:\NovaDock\apps` |
| Windows Service Runtime path | Path to the NSSM executable on the host | `nssm` |
| Simulation mode | Run orchestration without real Windows services | `true` (recommended for dev) |

### API

```bash
curl http://localhost:3000/api/settings

curl -X PUT http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "nssmPath": "C:\\NovaDock\\bin\\nssm.exe",
    "appsRoot": "C:\\NovaDock\\apps",
    "simulateMode": false
  }'
```

## Application configuration

Each application stores:

- **Identity** — name, slug, optional description
- **Runtime** — template, command, arguments, working directory, port
- **Health** — health check URL
- **Service** — Windows service name (`NovaDock-{slug}`)
- **Status** — current operational state and last error

Environment variables are stored as JSON (`envVars`) on the application model. UI editing for env vars is planned; API creation accepts `envVars` as a key-value object.

## Host preparation (Windows)

Before production deployments:

1. Run `novadock/agent/windows/Install-Agent.ps1` on the target host.
2. Place the NSSM binary at `C:\NovaDock\bin\nssm.exe` (or your configured path).
3. Ensure application directories exist under the applications root.

See [Runtime](runtime.md) for service naming and NSSM details.

## Environment variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `DATABASE_URL` | SQLite connection string | `file:./dev.db` |

Configure in `novadock/.env` for local development.

## Recommended production values

| Setting | Recommendation |
|---------|----------------|
| Simulation mode | `false` on Windows production hosts |
| NSSM path | Absolute path to verified binary |
| Applications root | Dedicated disk path with appropriate ACLs |
| Health URLs | Use `127.0.0.1` or internal hostnames |

See [Best practices](best-practices.md) for operational guidance.
