#!/bin/bash
# Bulk publish all packages
# Use inconjunction with pnpm bumpVersion #.#.# to update all package versions

declare -a packages=("core" "dom-core" "test-runner" "jest" "playwright" "react" "component-driver-html" "component-driver-mui-v5" "component-driver-mui-v6")

cd packages

for package in "${packages[@]}"
do
    cd $package
    rm -rf build
    rm -rf dist
    pnpm build
    pnpm publish --access=public
    cd ..
done

cd ../
echo "Done!"

