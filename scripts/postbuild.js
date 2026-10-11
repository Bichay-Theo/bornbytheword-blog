const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');

function processDir(currentDir) {
  if (!fs.existsSync(currentDir)) return;
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== '_next') {
        processDir(fullPath);
      }
    } else if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'index.html' && entry.name !== '404.html' && entry.name !== '_not-found.html') {
      const baseName = entry.name.replace(/\.html$/, '');
      const subDir = path.join(currentDir, baseName);
      const targetIndex = path.join(subDir, 'index.html');

      if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir, { recursive: true });
      }

      if (!fs.existsSync(targetIndex)) {
        fs.copyFileSync(fullPath, targetIndex);
      }
    }
  }
}

processDir(outDir);
console.log('[postbuild] Trailing slash fallbacks created successfully.');
