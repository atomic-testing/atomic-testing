const fs = require('fs');
const path = require('path');

const skipPostBuildPackages = [];

/**
 * Packages that version INDEPENDENTLY of the frozen core group (see ADR-009): the
 * published `component-driver-*` drivers track fast-moving third-party DOM on
 * their own cadence, so a core-group version bump must NOT touch them.
 * `component-driver-html` is part of the frozen core group (ADR-006), hence the
 * explicit carve-out.
 */
function isIndependentlyVersioned(folderName) {
  return folderName.startsWith('component-driver-') && folderName !== 'component-driver-html';
}

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

/**
 * Bump package versions under packages/.
 *
 * - `bumpVersion(dir, version)` bumps the CORE GROUP — every package except the
 *   independently-versioned `component-driver-*` drivers — to `version`. This is
 *   the lockstep frozen-core release (ADR-006 / ADR-009).
 * - `bumpVersion(dir, version, targetFolder)` bumps ONLY `targetFolder`, so a
 *   single driver can be released on its own cadence, e.g.
 *   `pnpm bumpVersion 9.3.0 component-driver-mui-x-v9`.
 */
function bumpVersion(dir, version, targetFolder) {
  const sanitizedVersion = version.trim();
  if (sanitizedVersion.length < 1) {
    return;
  }

  const packageDirs = ['packages'];
  const children = packageDirs.flatMap(p => {
    const full = path.join(dir, p);
    return fs.existsSync(full) ? fs.readdirSync(full).map(c => path.join(p, c)) : [];
  });

  let bumped = 0;
  for (const child of children) {
    const pkgName = path.basename(child);
    if (skipPostBuildPackages.includes(pkgName)) {
      continue;
    }
    if (targetFolder) {
      if (pkgName !== targetFolder) {
        continue;
      }
    } else if (isIndependentlyVersioned(pkgName)) {
      // Core-group bump leaves the independently-versioned drivers untouched.
      continue;
    }
    const childPath = path.join(dir, child);
    if (isFolder(childPath)) {
      adjustFolderPackageJson(childPath, sanitizedVersion);
      bumped++;
    }
  }

  // A targeted bump that matched nothing is almost certainly a mistyped folder —
  // fail loudly rather than silently produce an empty release.
  if (targetFolder && bumped === 0) {
    console.error(`bumpVersion: no package folder named "${targetFolder}" under packages/`);
    process.exit(1);
  }
}

bumpVersion(process.cwd(), process.argv[2], process.argv[3]);
