# Repository setup — `novadock`

NovaDock should live in a GitHub repository named **`novadock`** to match the product. If your copy is still under another name (for example `new`), create a new repository and push this codebase there.

The Cloud Agent integration cannot create repositories on your personal account (API returns 403). Use the steps below as the repository owner.

## Option A — New repository + push (recommended)

### 1. Create an empty repository

1. Open [Create a new repository](https://github.com/new).
2. Owner: **shivamongit** (or your org).
3. Repository name: **`novadock`**
4. Visibility: Public (or Private).
5. **Do not** add README, .gitignore, or license (this repo already includes them).
6. Click **Create repository**.

### 2. Push all branches

From your local clone of this project:

```bash
chmod +x scripts/migrate-to-novadock-repo.sh
./scripts/migrate-to-novadock-repo.sh https://github.com/shivamongit/novadock.git
```

Or manually:

```bash
git remote add novadock https://github.com/shivamongit/novadock.git
git push novadock --all
git push novadock --tags   # if you use tags
```

### 3. Point `origin` at the new repo

```bash
git remote set-url origin https://github.com/shivamongit/novadock.git
git remote remove novadock   # optional cleanup
```

### 4. GitHub settings (new repo)

- **Settings → General → Default branch** → `main`
- **Settings → General → Features** — enable Issues/Discussions as needed
- **Settings → Pages** — only if you plan to publish docs (not required for the app)

### 5. Retire the old repository

On the **old** repo (e.g. `shivamongit/new`):

1. Replace README with a short notice:

   ```markdown
   # Moved to NovaDock

   This project now lives at **https://github.com/shivamongit/novadock**
   ```

2. **Settings → General → Archive this repository** (optional but recommended).

## Option B — Rename existing repository

If you prefer not to create a new repo, rename in place:

```bash
gh repo rename novadock
```

Or: **Settings → General → Repository name → `novadock`**.

GitHub redirects old URLs to the new name. No push required.

## Option C — GitHub transfer (change owner)

To move the repo to an organization:

1. Old repo → **Settings → General → Danger Zone → Transfer ownership**
2. Enter the target org and confirm.

Transfer requires owner permissions on both sides.

## Verify migration

```bash
git clone https://github.com/shivamongit/novadock.git
cd novadock/novadock
pnpm install && pnpm db:push && pnpm dev
```

Open http://localhost:3000

## CI and integrations

After migration, update:

- Cursor Cloud / environment repo links
- Any `git clone` URLs in internal runbooks
- Deploy keys or GitHub Actions `origin` URLs

Canonical clone URL:

```bash
git clone https://github.com/shivamongit/novadock.git
cd novadock/novadock
```
