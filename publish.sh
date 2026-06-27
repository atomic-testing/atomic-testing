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


cd packages

for dir in */; do
  pkg="${dir%/}"  # strip trailing slash

  # check if $pkg is in the exclude list
  skip=false
  for ex in "${exclude[@]}"; do
    if [[ "$pkg" == "$ex" ]]; then
      skip=true
      break
    fi
  done
  $skip && continue

  echo "→ Processing $pkg"
  pushd "$pkg" > /dev/null

    rm -rf build dist
    pnpm build

    if [[ "$BUILD_ONLY" == false ]]; then
      echo "→ Publishing $pkg"
      pnpm publish --access=public --no-git-checks
    else
      echo "→ Skipping publish for $pkg"
    fi

  popd > /dev/null
done

echo "Done!"
