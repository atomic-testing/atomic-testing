const fs = require('fs');
const path = require('path');

const skipPostBuildPackages = [];

function isFolder(p) {
  return fs.statSync(p).isDirectory();
}

function adjustFolderPackageJson(dir, version) {
  const fileName = path.join(dir, 'package.json');
  if (!fs.existsSync(fileName)) {
    return;
  }
  const fileContent = fs.readFileSync(fileName).toString();
  const newContent = fileContent.replace(/("version":\s+").*(")/g, `$1${version}$2`);
  fs.writeFileSync(fileName, newContent);
}

// examples/* apps and docs/ are standalone pnpm workspaces pinned to PUBLISHED
// @atomic-testing/* versions (not workspace:*), so a release must float them forward
// too or they silently freeze on the version that was current when they were written.
// Only the @atomic-testing/* specifiers are rewritten — the app's own "version" field
// (its unpublished 0.0.0) is left untouched. Manifests only: this script stays pure (no
// network, no child process), so the lockfiles it invalidates are regenerated as a
// separate step of the release ritual — see {@link bumpConsumers} and
// agent-docs/RELEASING.md.
function adjustPinnedAtomicSpecifiers(dir, version) {
  const fileName = path.join(dir, 'package.json');
  if (!fs.existsSync(fileName)) {
    return;
  }
  const fileContent = fs.readFileSync(fileName).toString();
  const newContent = fileContent.replace(
    /("@atomic-testing\/[a-zA-Z0-9_-]+":\s*"\^?)\d+\.\d+\.\d+(")/g,
    `$1${version}$2`
  );
  fs.writeFileSync(fileName, newContent);
}

/**
 * The packages that are about to be published. This is what the RELEASE PR
 * contains, so CI verifies the exact manifests that ship.
 */
function bumpPackages(dir, version) {
  const packageDirs = ['packages'];
  const children = packageDirs.flatMap(p => {
    const full = path.join(dir, p);
    return fs.existsSync(full) ? fs.readdirSync(full).map(c => path.join(p, c)) : [];
  });
  for (const child of children) {
    const pkgName = path.basename(child);
    if (skipPostBuildPackages.includes(pkgName)) {
      continue;
    }
    const childPath = path.join(dir, child);
    if (isFolder(childPath)) {
      adjustFolderPackageJson(childPath, version);
    }
  }
}

/**
 * The standalone projects that CONSUME the published packages from npm.
 *
 * Deliberately separate from {@link bumpPackages}, and deliberately not part of
 * the release PR: these install the published versions, so floating them to
 * X.Y.Z before X.Y.Z exists on the registry makes their jobs unresolvable — and
 * since CI installs them with a frozen lockfile, the lockfiles cannot be
 * regenerated either. Run this AFTER the release publishes, regenerate the
 * lockfiles alongside it, and land both in a follow-up PR.
 */
function bumpConsumers(dir, version) {
  const examplesDir = path.join(dir, 'examples');
  if (fs.existsSync(examplesDir)) {
    for (const child of fs.readdirSync(examplesDir)) {
      const childPath = path.join(examplesDir, child);
      if (isFolder(childPath)) {
        adjustPinnedAtomicSpecifiers(childPath, version);
      }
    }
  }

  // docs/ pins the same way an example does. It was previously on the `latest`
  // dist-tag, which floated on its own and so needed no bump — and which also made
  // its lockfile meaningless, since the specifier never changed while the tag moved.
  adjustPinnedAtomicSpecifiers(path.join(dir, 'docs'), version);
}

function bumpVersion(dir, version, mode) {
  const sanitizedVersion = (version ?? '').trim();
  if (sanitizedVersion.length < 1) {
    return;
  }
  if (mode === '--consumers') {
    bumpConsumers(dir, sanitizedVersion);
  } else {
    bumpPackages(dir, sanitizedVersion);
  }
}

bumpVersion(process.cwd(), process.argv[2], process.argv[3]);
