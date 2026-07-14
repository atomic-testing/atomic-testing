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

// examples/* apps are standalone pnpm workspaces pinned to PUBLISHED @atomic-testing/*
// versions (not workspace:*), so a release must float them forward too or they silently
// freeze on the version that was current when the example was created. Only the
// @atomic-testing/* specifiers are rewritten — the example app's own "version" field
// (its unpublished 0.0.0) is left untouched.
function adjustExampleFolderPackageJson(dir, version) {
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
        adjustExampleFolderPackageJson(childPath, sanitizedVersion);
      }
    }
  }
}

bumpVersion(process.cwd(), process.argv[2]);
