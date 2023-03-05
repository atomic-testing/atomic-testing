/* eslint @typescript-eslint/no-unsafe-argument: 0 */
const fs = require('fs');
const path = require('path');

const skipPostBuildPackages = ['component-driver-html-test', 'component-driver-mui-v5-test'];

/**
 * Reduce sources path by one ../ given distribution folder is one level shallower than build/src folder
 */
function adjustFileSourceMap(filePath) {
  if (!filePath.endsWith('.map')) {
    return;
  }
  const fileContent = fs.readFileSync(filePath);
  const sourceMapData = JSON.parse(fileContent);
  if (sourceMapData.sources != null && sourceMapData.sources.length > 0) {
    sourceMapData.sources = sourceMapData.sources.map((src) => {
      if (src.startsWith('../')) {
        return src.slice(3);
      }
    });
    const adjusted = JSON.stringify(sourceMapData);
    fs.writeFileSync(filePath, adjusted);
  }
}

function isFolder(p) {
  return fs.statSync(p).isDirectory();
}

function adjustFolderSourceMap(dir) {
  const files = fs.readdirSync(dir);
  for (const p of files) {
    const fullPath = path.join(dir, p);
    if (isFolder(fullPath)) {
      adjustFolderSourceMap(fullPath);
    } else {
      adjustFileSourceMap(fullPath);
    }
  }
}

function postBuild(dir) {
  // Rename package/build/src to package/dist
  if (skipPostBuildPackages.some((pkg) => dir.includes(pkg))) {
    return;
  }

  const dist = path.join(dir, 'dist');
  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { recursive: true });
  }

  const build = path.join(dir, 'build');
  const buildSrc = path.join(build, 'src');

  fs.cpSync(buildSrc, dist, { recursive: true });
  adjustFolderSourceMap(dist);
}

postBuild(process.cwd());
