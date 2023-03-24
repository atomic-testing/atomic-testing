#!/bin/bash
# Bulk publish all packages
# Use inconjunction with pnpm bumpVersion #.#.# to update all package versions

pnpm -r build

cd packages/core
pnpm publish --access=public

cd ../dom-core
pnpm publish --access=public

cd ../test-runner
pnpm publish --access=public

cd ../jest
pnpm publish --access=public

cd ../playwright
pnpm publish --access=public

cd ../react
pnpm publish --access=public

cd ../component-driver-html
pnpm publish --access=public

cd ../component-driver-mui-v5
pnpm publish --access=public

cd ../../
echo "Done!"

