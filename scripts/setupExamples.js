// Installs every examples/* app. Each one is its own standalone pnpm workspace
// (own pnpm-workspace.yaml + lockfile, pinned to published @atomic-testing/* versions)
// so it must be installed from within its own directory rather than via the root
// workspace install.
//
// A plain `for d in examples/*/; do (cd "$d" && pnpm install); done` in the
// package.json "setup:examples" script silently fails: this repo's .npmrc sets
// shell-emulator=true, and pnpm's cross-platform script shell doesn't support
// subshells. Spawning each install from Node sidesteps that limitation.

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const examplesDir = path.join(__dirname, '..', 'examples');

const exampleDirs = fs
  .readdirSync(examplesDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => path.join(examplesDir, entry.name))
  .filter(dir => fs.existsSync(path.join(dir, 'package.json')));

for (const dir of exampleDirs) {
  console.warn(`\n> pnpm install (${path.relative(process.cwd(), dir)})`);
  const result = spawnSync('pnpm', ['install'], { cwd: dir, stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
