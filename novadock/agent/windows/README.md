# NovaDock Windows Host Agent

PowerShell scripts for preparing Windows hosts and managing the Windows Service Runtime.

## Install-Agent.ps1

Run once on a Windows server to prepare NovaDock directories:

```powershell
.\Install-Agent.ps1 -AppsRoot "C:\NovaDock\apps" -NssmUrl "https://nssm.cc/release/nssm-2.24.zip"
```

This creates:

- `C:\NovaDock\apps` — application workloads root
- `C:\NovaDock\bin` — Windows Service Runtime (NSSM) binary
- `C:\NovaDock\logs` — service logs

## Register-Service.ps1

Registers an application as a Windows service via NSSM:

```powershell
.\Register-Service.ps1 `
  -ServiceName "NovaDock-partner-portal" `
  -AppDirectory "C:\NovaDock\apps\partner-portal" `
  -Executable "npm" `
  -Arguments "start" `
  -Port 3000 `
  -NssmPath "C:\NovaDock\bin\nssm.exe"
```

## Health-Check.ps1

Polls a health URL until success or timeout (used by the deployment orchestrator):

```powershell
.\Health-Check.ps1 -Url "http://127.0.0.1:3000/" -TimeoutSeconds 30 -IntervalMs 500
```

## Integration

The NovaDock control plane (`novadock/`) invokes these operations through its Windows executor.

In simulation mode (default for development), a local simulator exercises the same orchestration pipeline without registering real Windows services.
