const fs = require('fs');
const path = require('path');

function postBuild(dir) {
  // Rename package/build/src to package/dist
  const dist = path.join(dir, 'dist');
  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { recursive: true });
  }

  const build = path.join(dir, 'build');
  const buildSrc = path.join(build, 'src');

  fs.cpSync(buildSrc, dist, { recursive: true });
}

postBuild(process.cwd());
