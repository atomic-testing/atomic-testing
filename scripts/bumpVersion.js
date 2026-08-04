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
// (its unpublished 0.0.0) is left untouched.
//
// This rewrites MANIFESTS ONLY and deliberately does not regenerate the lockfiles it
// invalidates: publish.yml's committing job holds the one credential that can write to
// main and installs nothing, so that no third-party code runs beside it. Since CI now
// enforces those lockfiles, the release ritual must regenerate them in the same change
// that bumps the manifests — see agent-docs/RELEASING.md.
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

function bumpVersion(dir, version) {
  const sanitizedVersion = version.trim();
  if (sanitizedVersion.length < 1) {
    return;
  }

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
      adjustFolderPackageJson(childPath, sanitizedVersion);
    }
  }

  const examplesDir = path.join(dir, 'examples');
  if (fs.existsSync(examplesDir)) {
    for (const child of fs.readdirSync(examplesDir)) {
      const childPath = path.join(examplesDir, child);
      if (isFolder(childPath)) {
        adjustPinnedAtomicSpecifiers(childPath, sanitizedVersion);
      }
    }
  }

  // docs/ pins the same way an example does. It was previously on the `latest`
  // dist-tag, which floated on its own and so needed no bump — and which also made
  // its lockfile meaningless, since the specifier never changed while the tag moved.
  adjustPinnedAtomicSpecifiers(path.join(dir, 'docs'), sanitizedVersion);
}

bumpVersion(process.cwd(), process.argv[2]);
