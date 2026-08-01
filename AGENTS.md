# AGENTS.md

Guidance for AI agents and developers working in this repository.

## Repository status

This repository is currently an **empty scaffold**. The only tracked file besides this document is `README.md` (title: `new`). There is no application source code, dependency manifests, tests, lint configuration, or service definitions yet.

When application code is added, update this file with concrete start/test/lint commands.

## Cursor Cloud specific instructions

### Environment overview

The Cloud Agent VM provides standard development tooling out of the box. No repository-specific dependency install step is required until manifests such as `package.json`, `pyproject.toml`, or `go.mod` are added.

| Tool | Version (typical) | Path / notes |
|------|-------------------|--------------|
| Node.js | v22.x | via nvm (`/home/ubuntu/.nvm`) |
| npm / pnpm / yarn | bundled with Node | prefer the lockfile's package manager when deps exist |
| Python | 3.12.x | `/usr/bin/python3` |
| Git | 2.43+ | `/usr/bin/git` |
| Make | available | `/usr/bin/make` |

Docker is **not** pre-installed on the default Cloud Agent VM unless added via a custom environment build.

### Services

No services are defined. There is nothing to start, no ports to bind, and no end-to-end application flow to test until code is scaffolded.

### Lint, test, and build

Not applicable yet. Once tooling is added, document commands here (for example `npm test`, `npm run lint`) and reference the manifest scripts rather than duplicating them.

### Update script behavior

The VM startup update script is a no-op (`true`) because this repo has no installable dependencies. When dependency manifests are introduced, update the environment's update script to run the appropriate install command (for example `npm ci`, `pnpm install`, or `pip install -r requirements.txt`).

### Git workflow

- Default branch: `main`
- Remote: `origin` → `github.com/shivamongit/new`
- Feature branches for agents should use the `cursor/<descriptive-name>-b8ff` pattern when making changes.
