const fs = require('fs');
const path = require('path');

const skipPostBuildPackages = ['e2e-mui-v5'];

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
}

postBuild(process.cwd());
