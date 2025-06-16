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

declare -a packages=(
  "core"
  "dom-core"
  "test-runner"
  "jest"
  "vitest"
  "playwright"
  "react"
  "react-19"
  "component-driver-html"
  "component-driver-mui-v5"
  "component-driver-mui-v6"
  "component-driver-mui-v7"
  "component-driver-mui-x-v5"
  "component-driver-mui-x-v6"
  "component-driver-mui-x-v7"
  "component-driver-mui-x-v8"
)

cd packages

for pkg in "${packages[@]}"; do
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