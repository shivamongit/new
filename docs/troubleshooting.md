# Troubleshooting

Common issues when operating NovaDock and guidance for resolution.

## Deployment fails immediately

**Symptoms:** Status `FAILED`, halt reason in deploy logs.

**Checks:**

1. Confirm **simulation mode** matches your environment (enabled on Linux/macOS, disabled on Windows production).
2. Verify **working directory** exists on the host and contains required files.
3. Confirm **executable** and **arguments** are correct for the template.
4. Review deploy logs on the application detail page.

## Health check never succeeds

**Symptoms:** Retries exhaust; halt reason mentions health check.

**Checks:**

1. Ensure the application listens on the configured **port**.
2. Confirm **health URL** matches an endpoint that returns HTTP success when ready.
3. On Windows, allow time for slow startups (orchestrator retries up to three times).
4. Test the health URL manually from the host: `curl http://127.0.0.1:{port}/`

## NSSM / service registration errors

**Symptoms:** Halt during register or start phase on Windows.

**Checks:**

1. `nssmPath` in Settings points to a valid `nssm.exe`.
2. Run PowerShell agent setup: `Install-Agent.ps1`.
3. Service name conflicts — remove orphaned `NovaDock-*` services manually if needed.
4. Permissions — account running NovaDock can execute NSSM and write to apps root.

## Simulation mode on production host

**Symptoms:** Deploys succeed but no real Windows service appears.

**Fix:** Open **Settings**, disable **Simulation mode**, save, and redeploy.

## Database errors

**Symptoms:** API 500, Prisma errors on startup.

**Checks:**

1. Run `pnpm db:push` after pulling schema changes.
2. Verify `DATABASE_URL` in `.env`.
3. Ensure the SQLite file is writable.

## Build or test failures

```bash
cd novadock
pnpm install
pnpm db:push
pnpm test
pnpm build
```

## Getting help

1. Review [FAQ](faq.md) and [Best practices](best-practices.md).
2. Search [GitHub issues](https://github.com/shivamongit/novadock/issues).
3. Open a bug report with deploy logs, settings (redact secrets), and host OS version.
