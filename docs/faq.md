# FAQ

## What is NovaDock?

NovaDock is a deployment and operations platform for **Windows application workloads**. It provides a web console and API to register applications, orchestrate deployments, and manage services with health verification and full deploy history.

## Who is NovaDock for?

Teams that run internal web services, APIs, and line-of-business applications on Windows servers and want **deployment confidence** without building custom service-install scripts for every project.

## Does NovaDock replace IIS?

No. NovaDock manages **long-running application processes** as Windows services. You can run Node, Python, .NET, or custom executables alongside—or behind—IIS or other edge proxies.

## Can I use NovaDock on Linux?

The **control plane** runs on Linux, macOS, or Windows for development. **Production service registration** targets Windows hosts. Simulation mode lets you develop and test orchestration on non-Windows machines.

## Is authentication required?

Not in the current release. Treat NovaDock as an internal tool behind your network perimeter until authentication ships. See [Security](security.md).

## What is simulation mode?

Simulation mode runs the full deployment orchestrator against a **local simulator** instead of registering real Windows services. Default for development; disable for Windows production.

## How many retries does a deploy attempt?

Up to **three attempts** when health verification fails before the deploy halts with a recorded reason.

## Where are logs stored?

Deploy logs and history are stored in the SQLite database and shown on each application's detail page. Centralized log streaming is planned.

## Can I deploy via CI/CD?

Yes. Use the REST API to create applications and trigger deploys. See [API](api.md) and [Deployment](deployment.md).

## Is there a CLI?

Not yet. Use the API or web console. See [CLI](cli.md) for the roadmap.

## What database does NovaDock use?

SQLite by default, suitable for single-node deployments. PostgreSQL support is planned for multi-instance control planes.

## Repository

This project is published as **[github.com/shivamongit/novadock](https://github.com/shivamongit/novadock)**.
