# Deployment

NovaDock deployments turn a registered application definition into a **running, health-verified Windows service** (or a simulated equivalent in development).

## What a deployment accomplishes

When you deploy an application, NovaDock:

1. Records a new **deploy run** with phase tracking and logs.
2. Executes the orchestration pipeline (prepare → register → start → verify).
3. Updates application status (`RUNNING`, `FAILED`, `DEPLOYING`, etc.).
4. Preserves **halt reasons** and log output for operations review.

## Deployment wizard

Navigate to **Deployments** (`/apps/new`) or click **Deploy** in the sidebar.

### Step 1 — Choose a template

| Template | Typical use |
|----------|-------------|
| Node.js | npm-based web apps |
| Python | uvicorn / FastAPI workloads |
| .NET | ASP.NET Core applications |
| Custom | Any executable and arguments |

Templates pre-fill command, port, and health check defaults.

### Step 2 — Application details

| Field | Description |
|-------|-------------|
| Application name | Display name; used to generate slug and service name |
| Target port | Port the workload listens on |
| Working directory | Host path to application files |
| Executable | Process to run (e.g. `npm`, `python`) |
| Startup arguments | Command-line arguments |
| Health check URL | HTTP endpoint used to verify readiness |

### Step 3 — Deploy

**Review & deploy** creates the application record and immediately starts orchestration. You are redirected to the application detail page for live status, logs, and history.

## Orchestration phases

| Phase | Purpose |
|-------|---------|
| Init | Begin deploy run, reset attempt counter |
| Install | Install dependencies (e.g. `npm ci` on Windows) |
| Register | Create Windows service registration |
| Start | Start the service process |
| Health check | Probe health URL until success or timeout |
| Complete / Halt | Mark success or record failure reason |

Failed health checks trigger retries up to **three attempts** before the deploy halts.

## Redeploy and lifecycle actions

From the application detail page:

- **Redeploy** — run orchestration again for the same definition.
- **Stop** — stop the running service (when status is `RUNNING`).
- **Remove** — delete the application record and remove the Windows service.

## API deployment

```bash
# Create application
curl -X POST http://localhost:3000/api/apps \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Inventory API",
    "template": "node",
    "workDir": "C:\\NovaDock\\apps\\inventory-api",
    "command": "npm",
    "arguments": "start",
    "port": 3000,
    "healthUrl": "http://127.0.0.1:3000/"
  }'

# Deploy (use id from create response)
curl -X POST http://localhost:3000/api/apps/{id}/deploy
```

See [API](api.md) for full endpoint reference.

## Simulation mode

When simulation mode is enabled (default in development), orchestration runs against a **local simulator** that mimics service lifecycle without NSSM. Disable simulation mode in **Settings** before production Windows deployments.

## Automated verification

Run the included E2E script against a running dev server:

```bash
cd novadock
node scripts/test-deployments.mjs http://localhost:3000
```

This creates four sample applications and deploys each through the API.
