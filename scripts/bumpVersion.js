const fs = require('fs');
const path = require('path');

const skipPostBuildPackages = [
  'component-driver-html-test',
  'component-driver-mui-v5-test',
  'component-driver-mui-v6-test',
  'component-driver-mui-v7-test',
  'component-driver-mui-x-v5-test',
  'component-driver-mui-x-v6-test',
  'component-driver-mui-x-v7-test',
  'component-driver-mui-x-v8-test',
];

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

function bumpVersion(dir, version) {
  const sanitizedVersion = version.trim();
  if (sanitizedVersion.length < 1) {
    return;
  }

  const packageDirs = ['packages', 'package-tests'];
  const children = packageDirs
    .flatMap((p) => {
      const full = path.join(dir, p);
      return fs.existsSync(full) ? fs.readdirSync(full).map((c) => path.join(p, c)) : [];
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
}

bumpVersion(process.cwd(), process.argv[2]);
