#!/usr/bin/env bash
set -euo pipefail

# Bulk publish all packages (or just build if --build-only)
# Use in conjunction with pnpm bumpVersion #.#.# to update all package versions
#
# Auth is npm Trusted Publishing (OIDC) — see .github/workflows/publish.yml.
# Adding a NEW package? npm can't attach a trusted publisher to a package that
# doesn't exist yet, so its first publish can't use OIDC. Bootstrap it once:
#     ./bootstrap-new-package.sh <package-folder-name>
# After that it publishes here automatically. To (re)apply every trusted-publisher
# config at once: ./setup-trusted-publishers.sh
#
# Versioning (ADR-009): the frozen CORE GROUP (core, dom-core, the react/vue
# adapters, playwright, component-driver-html) versions in lockstep — `pnpm
# bumpVersion <ver>` bumps exactly that group. The published component-driver-*
# drivers version INDEPENDENTLY (`pnpm bumpVersion <ver> <folder>`). This script
# needs no version logic: it publishes each package at the version in its own
# package.json and skips versions already on npm, so a core release leaves the
# unchanged drivers untouched (already-published → skipped) and vice versa.

BUILD_ONLY=false

# simple flags parser
while [[ $# -gt 0 ]]; do
  case "$1" in
    -b|--build-only)
      BUILD_ONLY=true
      shift
      ;;
    *)
      echo "Usage: $0 [--build-only|-b]"
      exit 1
      ;;
  esac
done

# list of folders to skip
declare -a exclude=(
  # add any others here...
  "temp"
  # MUI 5 / MUI-X 5 reached end of support (2026-06-27); frozen, not republished.
  # See agent-docs/adr/005-drop-mui-5-support.md
  "component-driver-mui-v5"
  "component-driver-mui-x-v5"
)


# Publish dependencies before dependents (topological order). pnpm rewrites
# workspace:* deps to EXACT version pins at publish time, so a dependency must be
# on npm before the packages that pin it — otherwise a partial publish strands a
# dependent referencing a version that was never published. publishOrder.js
# derives the order from packages/*; the exclude list is passed in so it stays a
# single source of truth (no second copy to keep in sync).
order_raw="$(node scripts/publishOrder.js "${exclude[@]}")"
publish_order=()
while IFS= read -r folder; do
  [[ -n "$folder" ]] && publish_order+=("$folder")
done <<< "$order_raw"

if (( ${#publish_order[@]} == 0 )); then
  echo "ERROR: publishOrder.js produced no packages — aborting." >&2
  exit 1
fi

# Preflight (publish mode only): every package must ALREADY exist on npm. OIDC
# trusted publishing can't attach to a package that doesn't exist yet, so a
# brand-new package's first publish fails with ENEEDAUTH. Catch that here and
# fail fast BEFORE touching the registry, instead of aborting mid-loop and
# leaving a half-published, broken release. Bootstrap new packages once with
# ./bootstrap-new-package.sh (see header).
if [[ "$BUILD_ONLY" == false ]]; then
  echo "→ Preflight: verifying every package exists on npm…"
  missing=()
  for pkg in "${publish_order[@]}"; do
    # Private packages (internal test runners, fixtures, examples) are built for
    # the monorepo's own tests but never published, so they need not exist on npm.
    if [[ "$(node -p "require('./packages/$pkg/package.json').private === true")" == "true" ]]; then
      continue
    fi
    pkgName="$(node -p "require('./packages/$pkg/package.json').name")"
    if ! npm view "$pkgName" version > /dev/null 2>&1; then
      missing+=("$pkg  ($pkgName)")
    fi
  done
  if (( ${#missing[@]} )); then
    {
      echo "ERROR: these package(s) are not on npm yet, so OIDC publishing will fail (ENEEDAUTH):"
      printf '   - %s\n' "${missing[@]}"
      echo
      echo "Bootstrap each NEW package once (creates it + attaches the trusted publisher):"
      echo "    ./bootstrap-new-package.sh <package-folder-name>"
      echo "Aborting before any package is published to avoid a partial release."
    } >&2
    exit 1
  fi
  echo "  ✓ all ${#publish_order[@]} package(s) exist on npm"
fi

cd packages

for pkg in "${publish_order[@]}"; do
  echo "→ Processing $pkg"
  pushd "$pkg" > /dev/null

    rm -rf build dist
    pnpm build

    if [[ "$BUILD_ONLY" == false ]]; then
      # Private packages are built above (the monorepo's own tests consume their
      # dist) but are never published to npm.
      if [[ "$(node -p "require('./package.json').private === true")" == "true" ]]; then
        echo "↷ Skipping publish for $pkg (private)"
      else
        pkgName="$(node -p "require('./package.json').name")"
        pkgVer="$(node -p "require('./package.json').version")"
        # Idempotent: skip versions already on the registry so a re-run after a
        # partial publish resumes instead of failing on "cannot publish over".
        if npm view "${pkgName}@${pkgVer}" version > /dev/null 2>&1; then
          echo "↷ Skipping $pkgName@$pkgVer (already published)"
        else
          echo "→ Publishing $pkgName@$pkgVer"
          pnpm publish --access=public --no-git-checks
        fi
      fi
    else
      echo "→ Skipping publish for $pkg"
    fi

  popd > /dev/null
done

echo "Done!"
