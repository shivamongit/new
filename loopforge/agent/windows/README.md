# LoopForge Windows Agent
# PowerShell scripts for NSSM service management on Windows hosts.

## Install-Agent.ps1

Run once on a Windows server to prepare LoopForge agent directories:

```powershell
.\Install-Agent.ps1 -AppsRoot "C:\LoopForge\apps" -NssmUrl "https://nssm.cc/release/nssm-2.24.zip"
```

This creates:
- `C:\LoopForge\apps` — POC application root
- `C:\LoopForge\bin` — NSSM binary
- `C:\LoopForge\logs` — service logs

## Register-Service.ps1

Registers an application as an NSSM Windows service:

```powershell
.\Register-Service.ps1 `
  -ServiceName "LoopForge-my-poc" `
  -AppDirectory "C:\LoopForge\apps\my-poc" `
  -Executable "npm" `
  -Arguments "start" `
  -Port 3000 `
  -NssmPath "C:\LoopForge\bin\nssm.exe"
```

## Health-Check.ps1

Polls a health URL until success or timeout (used by deploy loop):

```powershell
.\Health-Check.ps1 -Url "http://127.0.0.1:3000/" -TimeoutSeconds 30 -IntervalMs 500
```

## Integration

The LoopForge web UI (`loopforge/`) calls these operations via its Node.js executor on Windows.
In simulate mode (default for dev), the simulator runs the same loop without NSSM.
