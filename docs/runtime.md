# Runtime

NovaDock's **Windows Service Runtime** manages application processes as Windows services so workloads survive restarts, run under consistent identities, and integrate with standard Windows operations tooling.

## Service model

Each registered application maps to one Windows service:

| Property | Pattern |
|----------|---------|
| Service name | `NovaDock-{slug}` |
| Application path | `{appsRoot}/{slug}` |
| Process | Configured executable + arguments |
| Health | HTTP probe against configured URL |

Example: application **Inventory API** with slug `inventory-api` becomes service `NovaDock-inventory-api`.

## NSSM (technical reference)

NovaDock uses [NSSM](https://nssm.cc/) as the service wrapper on Windows. NSSM handles:

- Process supervision and restart policies
- stdout/stderr redirection
- Service registration with the Windows Service Control Manager

NSSM is referenced in configuration and agent scripts only; product UI and primary documentation use **Windows Service Runtime** terminology.

### Typical NSSM layout

```
C:\NovaDock\
├── bin\nssm.exe
└── apps\
    └── inventory-api\
        └── (application files)
```

## Lifecycle operations

| Operation | UI | API |
|-----------|-----|-----|
| Deploy / start | Redeploy | `POST /api/apps/{id}/deploy` |
| Stop | Stop | `POST /api/apps/{id}/stop` |
| Remove | Remove | `DELETE /api/apps/{id}` |

Deploy orchestration calls NSSM (or the simulator) to register, start, and verify services.

## Simulation mode

When simulation mode is enabled:

- No NSSM commands execute.
- A in-process simulator tracks virtual service state.
- Health checks still run against configured URLs when reachable.

Use simulation mode for development on macOS/Linux and in CI pipelines.

## Host agent

PowerShell scripts in `novadock/agent/windows/` prepare the host:

- Create `C:\NovaDock\apps` and `C:\NovaDock\bin`
- Optional NSSM download via `Install-Agent.ps1`

See `agent/windows/README.md` for script parameters.

## Process identity

NSSM runs services under the account configured during registration. Production deployments should follow your organization's service account standards. Fine-grained identity configuration in the UI is planned.

## Roadmap

| Capability | Status |
|------------|--------|
| Windows service registration via NSSM | Implemented |
| Stop and remove lifecycle | Implemented |
| Simulation for non-Windows dev | Implemented |
| Linux container runtime | Planned |
| Multi-host agent fleet | Planned |
| Centralized log streaming | Planned |
