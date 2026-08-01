# API Reference

NovaDock exposes a **REST API** on the same origin as the web console (default `http://localhost:3000`).

All endpoints return JSON. Errors return `{ "error": "message" }` with an appropriate HTTP status.

> **Note:** Authentication is not enforced in the current release. Protect the API at the network layer until auth ships.

## Applications

### List applications

`GET /api/apps`

Returns an array of application records (without nested deploy runs).

### Create application

`POST /api/apps`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Display name (1–64 chars) |
| `description` | string | no | Optional description |
| `template` | string | no | `node`, `python`, `dotnet`, `custom` |
| `workDir` | string | yes | Host working directory |
| `command` | string | yes | Executable |
| `arguments` | string | no | Startup arguments |
| `port` | integer | yes | 1–65535 |
| `healthUrl` | string | no | HTTP health endpoint |
| `envVars` | object | no | Key-value environment variables |

**Response:** `201` with application object.

### Get application

`GET /api/apps/{id}`

Returns application with nested `deployRuns` (ordered by `startedAt`).

### Delete application

`DELETE /api/apps/{id}`

Removes the application and its Windows service (or simulated service).

**Response:** `{ "ok": true }`

## Deployment

### Deploy application

`POST /api/apps/{id}/deploy`

Runs the deployment orchestrator for the application.

**Response:**

```json
{
  "success": true,
  "phase": "COMPLETE",
  "attempts": 1,
  "logs": "..."
}
```

## Lifecycle

### Stop application

`POST /api/apps/{id}/stop`

Stops the running Windows service.

## Platform

### Dashboard statistics

`GET /api/stats`

```json
{
  "total": 5,
  "running": 4,
  "deploying": 0,
  "failed": 1
}
```

### Settings

`GET /api/settings`

`PUT /api/settings`

| Field | Type | Description |
|-------|------|-------------|
| `nssmPath` | string | Windows Service Runtime (NSSM) path |
| `appsRoot` | string | Applications root directory |
| `simulateMode` | boolean | Simulation mode flag |

## Application status values

| Status | Meaning |
|--------|---------|
| `PENDING` | Registered, not yet deployed |
| `DEPLOYING` | Orchestration in progress |
| `RUNNING` | Service healthy |
| `FAILED` | Deploy or health check failed |
| `STOPPED` | Service stopped |
| `UNHEALTHY` | Running but health check failing |

## Example workflow

```bash
BASE=http://localhost:3000

APP=$(curl -s -X POST "$BASE/api/apps" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Partner Portal",
    "template": "node",
    "workDir": "C:\\NovaDock\\apps\\partner-portal",
    "command": "npm",
    "arguments": "start",
    "port": 3000
  }')

ID=$(echo "$APP" | jq -r .id)

curl -X POST "$BASE/api/apps/$ID/deploy"
curl "$BASE/api/apps/$ID"
```

## Roadmap

| Capability | Status |
|------------|--------|
| OpenAPI / JSON Schema export | Planned |
| Pagination and filtering on list endpoints | Planned |
| Webhooks for deploy events | Planned |
| API key authentication | Planned |
