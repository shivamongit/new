#!/usr/bin/env bash
# Push this codebase to a new GitHub repository (e.g. shivamongit/novadock).
#
# Prerequisites:
#   1. Create an empty repo on GitHub: https://github.com/new
#      Name: novadock (no README, .gitignore, or license — we already have them)
#   2. Run from the repository root:
#      ./scripts/migrate-to-novadock-repo.sh
#      # or with a custom URL:
#      ./scripts/migrate-to-novadock-repo.sh https://github.com/YOUR_ORG/novadock.git

set -euo pipefail

NEW_REPO_URL="${1:-https://github.com/shivamongit/novadock.git}"
REMOTE_NAME="novadock"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Error: not inside a git repository."
  exit 1
fi

echo "NovaDock repository migration"
echo "  Target: $NEW_REPO_URL"
echo ""

if git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
  git remote set-url "$REMOTE_NAME" "$NEW_REPO_URL"
else
  git remote add "$REMOTE_NAME" "$NEW_REPO_URL"
fi

echo "Pushing all branches..."
git push "$REMOTE_NAME" --all

if git tag -l | grep -q .; then
  echo "Pushing tags..."
  git push "$REMOTE_NAME" --tags
fi

echo ""
echo "Done. Next steps:"
echo "  1. Open $NEW_REPO_URL/settings — set default branch to main if needed"
echo "  2. Update local origin (optional):"
echo "     git remote set-url origin $NEW_REPO_URL"
echo "  3. Archive the old repository or add a redirect notice in its README"
echo "  4. Update bookmarks and CI to use the new URL"
