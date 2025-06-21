#!/usr/bin/env bash
set -euo pipefail

# Bulk publish all packages (or just build if --build-only)
# Use in conjunction with pnpm bumpVersion #.#.# to update all package versions

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
