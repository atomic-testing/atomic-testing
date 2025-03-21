#!/bin/bash
# Bulk publish all packages
# Use in conjunction with pnpm bumpVersion #.#.# to update all package versions

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
    "component-driver-mui-x-v5"
    "component-driver-mui-x-v6"
    "component-driver-mui-x-v7"
)

cd packages

for package in "${packages[@]}"
do
    cd $package
    rm -rf build
    rm -rf dist
    pnpm build
    pnpm publish --access=public --no-git-checks
    cd ..
done

cd ../
echo "Done!"

