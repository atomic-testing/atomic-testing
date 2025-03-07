import fs from 'fs';
import path from 'path';

const skipPostBuildPackages = [
  'component-driver-html-test',
  'component-driver-mui-v5-test',
  'component-driver-mui-v6-test',
  'component-driver-mui-x-v7-test',
];

function isFolder(p: string): boolean {
  return fs.statSync(p).isDirectory();
}

function adjustFolderPackageJson(dir: string, version: string) {
  const fileName = path.join(dir, 'package.json');
  if (!fs.existsSync(fileName)) {
    return;
  }
  const fileContent = fs.readFileSync(fileName).toString();
  const newContent = fileContent.replace(/("version"\:\s+").*(")/g, `$1${version}$2`);
  fs.writeFileSync(fileName, newContent);
}

function bumpVersion(dir: string, version: string) {
  const santizedVersion = version.trim();
  if (santizedVersion.length < 1) {
    return;
  }

  const packagePath = path.join(dir, 'packages');
  const children = fs.readdirSync(packagePath);
  for (const child of children) {
    if (skipPostBuildPackages.includes(child)) {
      continue;
    }
    const childPath = path.join(packagePath, child);
    if (isFolder(childPath)) {
      adjustFolderPackageJson(childPath, santizedVersion);
    }
  }
}

bumpVersion(process.cwd(), process.argv[2]);
