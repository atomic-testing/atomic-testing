#!/usr/bin/env bash
# One-time bootstrap for a NEW @atomic-testing/* package so it can use Trusted
# Publishing.
#
# Why this exists: npm requires a package to already exist on the registry before
# a trusted publisher can be attached, so a brand-new package's FIRST publish
# can't use OIDC. This script does that first publish with your `npm login`
# session (publishing a throwaway 0.0.0 placeholder), then attaches the trusted
# publisher. After this, CI (publish.sh) publishes the real version via OIDC like
# every other package — and setup-trusted-publishers.sh auto-discovers it, so
# there's no list to edit.
#
# Usage:  ./bootstrap-new-package.sh <package-folder-name>      e.g. react-20
set -euo pipefail

cd "$(dirname "$0")"

REPO="atomic-testing/atomic-testing"
WORKFLOW="publish.yml"
PLACEHOLDER_VERSION="0.0.0"   # low on purpose: CI publishes the real (higher) version next release

[[ $# -eq 1 ]] || { echo "Usage: $0 <package-folder-name>"; exit 1; }
DIR="packages/$1"
[[ -f "$DIR/package.json" ]] || { echo "ERROR: no package.json at $DIR"; exit 1; }

# Preflight
npm trust --help >/dev/null 2>&1 || { echo "ERROR: need npm >= 11.10.0 (yours: $(npm -v)). Upgrade: npm install -g npm@latest"; exit 1; }
npm whoami >/dev/null 2>&1        || { echo "ERROR: not logged in to npm. Run: npm login"; exit 1; }

PKG="$(node -p "require('./$DIR/package.json').name")"
echo "Bootstrapping $PKG  ($DIR)"

# 1. Build the package and its workspace dependencies (correct order)
echo "→ Building (with deps)…"
pnpm --filter "${PKG}..." build

# 2. First publish (placeholder) — only if the package doesn't exist on npm yet
if npm view "$PKG" version >/dev/null 2>&1; then
  echo "→ $PKG already exists on npm — skipping placeholder publish."
else
  echo "→ Publishing placeholder $PLACEHOLDER_VERSION to create the package…"
  ORIG="$(node -p "require('./$DIR/package.json').version")"
  (
    cd "$DIR"
    npm version "$PLACEHOLDER_VERSION" --no-git-tag-version --allow-same-version >/dev/null
    # restore the original version whatever happens next
    trap 'npm version "$ORIG" --no-git-tag-version --allow-same-version >/dev/null 2>&1 || true' EXIT
    pnpm publish --access public --no-git-checks
  )
  echo "  ✓ placeholder published"
fi

# 3. Attach the trusted publisher (package now exists)
echo "→ Configuring trusted publisher…"
npm trust github "$PKG" --file "$WORKFLOW" --repo "$REPO" --allow-publish -y
echo "  ✓ trusted publisher configured"

echo
echo "Done. $PKG is OIDC-ready — CI will publish the real version on the next release."
echo "(setup-trusted-publishers.sh auto-discovers it; no list to update.)"
