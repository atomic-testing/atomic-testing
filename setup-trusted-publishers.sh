#!/usr/bin/env bash
# Reconcile npm Trusted Publishers (GitHub Actions OIDC) for every published
# @atomic-testing/* package. Idempotent — safe to re-run anytime (e.g. after
# adding a package; re-applying an existing config is a no-op/update).
#
# The package set is derived from packages/* to mirror publish.sh, so new
# packages are picked up automatically — no list to maintain. The EXCLUDE list
# below MUST stay in sync with the one in publish.sh.
#
# Requires: npm CLI >= 11.10.0, and `npm login` (account-level 2FA enabled).
set -uo pipefail   # intentionally NOT -e: one failure shouldn't abort the batch

cd "$(dirname "$0")"

REPO="atomic-testing/atomic-testing"
WORKFLOW="publish.yml"            # filename only — must match the trigger workflow

# Folders publish.sh does NOT publish — keep in sync with publish.sh
EXCLUDE=(temp)

is_excluded() { local d="$1" e; for e in "${EXCLUDE[@]}"; do [[ "$d" == "$e" ]] && return 0; done; return 1; }

# Pre-flight: `npm trust` exists only on npm >= 11.10.0
if ! npm trust --help >/dev/null 2>&1; then
  echo "ERROR: 'npm trust' not available (your npm: $(npm -v))."
  echo "Upgrade:  npm install -g npm@latest    # or run via:  npx -y npm@latest trust ..."
  exit 1
fi

failed=(); count=0
for dir in packages/*/; do
  folder="$(basename "$dir")"
  is_excluded "$folder" && continue
  [[ -f "$dir/package.json" ]] || continue
  # skip private (unpublished) packages
  [[ "$(node -p "require('./$dir/package.json').private === true")" == "true" ]] && continue

  pkg="$(node -p "require('./$dir/package.json').name")"
  count=$((count + 1))
  echo "→ $pkg"
  if npm trust github "$pkg" --file "$WORKFLOW" --repo "$REPO" --allow-publish -y; then
    echo "  ✓ configured"
  else
    echo "  ✗ FAILED"
    failed+=("$pkg")
  fi
  sleep 2   # avoid registry rate limiting
done

echo
if (( ${#failed[@]} )); then
  echo "Completed with ${#failed[@]} failure(s):"
  printf '   - %s\n' "${failed[@]}"
  echo "Re-run the script to retry (idempotent)."
  exit 1
fi
echo "All $count package(s) configured. ✓"
