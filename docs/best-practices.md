# Best Practices

Operational guidance for running NovaDock in production-like environments.

## Platform setup

1. **Dedicated host paths** — Use `C:\NovaDock\apps` (or a dedicated volume) with restricted ACLs.
2. **Verified runtime binary** — Install NSSM from a trusted source into `C:\NovaDock\bin`.
3. **Disable simulation** — Turn off simulation mode only on hosts that should register real services.
4. **TLS termination** — Place NovaDock behind a reverse proxy with HTTPS for operator access.

## Application design

1. **Health endpoints** — Expose a lightweight HTTP route that returns success only when the app is ready (not merely process-started).
2. **Stable ports** — Assign explicit ports per application; document them in your service catalog.
3. **Idempotent installs** — Ensure dependency install steps (`npm ci`, etc.) work on clean and existing directories.
4. **Logs on disk** — Redirect application logs to files NSSM can capture; NovaDock stores orchestration logs separately.

## Deployment workflow

1. **Register then deploy** — Create the application definition before triggering orchestration (wizard does both).
2. **Review halt reasons** — Failed deploys record why orchestration stopped; fix root cause before redeploying.
3. **Redeploy for config changes** — Update application fields then redeploy rather than manually editing services.
4. **Smoke test after upgrades** — Run `node scripts/test-deployments.mjs` against staging before promoting.

## Security

1. **Network isolation** — Never expose the API publicly without authentication.
2. **Least privilege** — Run workload services under dedicated accounts.
3. **Secrets** — Prefer host-level secret injection until vault integration ships; avoid committing secrets to app directories.
4. **Backups** — Backup the NovaDock database alongside application data.

## Observability

1. **Dashboard KPIs** — Monitor running vs failed counts on the home dashboard.
2. **Deploy history** — Use per-application history to correlate incidents with deploy attempts.
3. **API stats** — Poll `GET /api/stats` for lightweight monitoring integration until metrics export ships.

## Development

1. **Simulation on CI** — Keep simulation mode enabled in Linux CI runners.
2. **Match production paths** — Use realistic `workDir` patterns even in simulation to catch path issues early.
3. **Run tests** — `pnpm test` covers orchestrator behavior; add integration tests for your templates as needed.

## Scaling considerations

NovaDock today is a **single control-plane instance** with SQLite. For higher availability:

- Plan for PostgreSQL (roadmap) and redundant control-plane hosts.
- Distribute Windows workloads across multiple service hosts (multi-host fleet management is planned).
- Use API automation rather than manual console operations at scale.
