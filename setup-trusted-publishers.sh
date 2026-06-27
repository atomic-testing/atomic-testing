#!/usr/bin/env bash
# Configure npm Trusted Publishers (GitHub Actions OIDC) for all published
# @atomic-testing/* packages. Run once. Requires npm CLI >= 11.10.0 and an
# authenticated npm session (`npm login`) with write access + account 2FA.
set -uo pipefail   # intentionally NOT -e: one failure shouldn't abort the batch

REPO="atomic-testing/atomic-testing"
WORKFLOW="publish.yml"          # filename only — must match the trigger workflow
SCOPE="@atomic-testing"

PACKAGES=(
  core
  dom-core
  react-core
  react-18
  react-19
  react-legacy
  vue-3
  playwright
  component-driver-html
  component-driver-mui-v6
  component-driver-mui-v7
  component-driver-mui-x-v6
  component-driver-mui-x-v7
  component-driver-mui-x-v8
  internal-test-runner
  internal-test-runner-jest-adapter
  internal-test-runner-vitest-adapter
  internal-mui-x-test-fixture
  internal-react-example
)

# Pre-flight: `npm trust` exists only on npm >= 11.10.0
if ! npm trust --help >/dev/null 2>&1; then
  echo "ERROR: 'npm trust' not available (your npm: $(npm -v))."
  echo "Upgrade:  npm install -g npm@latest    # or run via:  npx -y npm@latest trust ..."
  exit 1
fi

failed=()
for pkg in "${PACKAGES[@]}"; do
  full="$SCOPE/$pkg"
  echo "→ $full"
  if npm trust github "$full" --file "$WORKFLOW" --repo "$REPO" --allow-publish -y; then
    echo "  ✓ configured"
  else
    echo "  ✗ FAILED"
    failed+=("$full")
  fi
  sleep 2   # avoid registry rate limiting
done

echo
if (( ${#failed[@]} )); then
  echo "Completed with ${#failed[@]} failure(s):"
  printf '   - %s\n' "${failed[@]}"
  echo "Re-run the script to retry — re-applying an existing config is a no-op/update."
  exit 1
fi
echo "All ${#PACKAGES[@]} packages configured. ✓"
