// Prints the folders under packages/ in topological PUBLISH order — every
// package's internal @atomic-testing/* dependencies are printed before it — one
// folder name per line.
//
// Why dependency order matters: `pnpm publish` rewrites `workspace:*` deps to an
// EXACT version pin at publish time, so a dependency must already exist on npm
// before the packages that pin it. Publishing deps-first means a failed/partial
// publish can never strand an already-published package that references a
// version of a dependency which was never published.
//
// Folders to skip are passed as CLI args (the exclude list lives in publish.sh;
// passing it in keeps a single source of truth instead of a second copy here).
// Only runtime edges (dependencies / peerDependencies / optionalDependencies)
// are considered — devDependencies are irrelevant to a published artifact's
// resolvability and would introduce spurious cycles (test fixtures dev-depend on
// the very drivers that depend on core). Exits non-zero on a dependency cycle so
// a release aborts loudly rather than publishing in an undefined order.

const fs = require('fs');
const path = require('path');

const exclude = new Set(process.argv.slice(2));
const packagesDir = path.join(process.cwd(), 'packages');

const folders = fs.readdirSync(packagesDir).filter(folder => {
  if (exclude.has(folder)) return false;
  return fs.existsSync(path.join(packagesDir, folder, 'package.json'));
});

const nameToFolder = {};
const internalDeps = {};
for (const folder of folders) {
  const pkg = JSON.parse(fs.readFileSync(path.join(packagesDir, folder, 'package.json'), 'utf8'));
  nameToFolder[pkg.name] = folder;
  const runtimeDeps = { ...pkg.dependencies, ...pkg.peerDependencies, ...pkg.optionalDependencies };
  internalDeps[folder] = Object.keys(runtimeDeps).filter(name => name.startsWith('@atomic-testing/'));
}

const VISITING = 1;
const DONE = 2;
const state = {};
const order = [];

function visit(folder, trail) {
  if (state[folder] === DONE) {
    return;
  }
  if (state[folder] === VISITING) {
    console.error(`Dependency cycle detected: ${[...trail, folder].join(' -> ')}`);
    process.exit(1);
  }
  state[folder] = VISITING;
  for (const depName of internalDeps[folder]) {
    const depFolder = nameToFolder[depName];
    // Edges to excluded (frozen / already-published) packages resolve to no
    // folder and are intentionally ignored.
    if (depFolder && depFolder !== folder) {
      visit(depFolder, [...trail, folder]);
    }
  }
  state[folder] = DONE;
  order.push(folder);
}

// Sort first so the order is deterministic among independent packages.
for (const folder of [...folders].sort()) {
  visit(folder, []);
}

process.stdout.write(`${order.join('\n')}\n`);
