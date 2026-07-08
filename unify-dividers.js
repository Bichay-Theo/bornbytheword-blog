const fs = require('fs');

const cssPath = 'src/app/globals.css';
let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes('.chapter-divider')) {
  css += `\n
.chapter-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5rem 0;
  opacity: 0.8;
}
.chapter-divider::before,
.chapter-divider::after {
  content: '';
  flex-grow: 1;
  max-width: 200px;
  height: 2px;
  background-color: var(--secondary);
}
.chapter-divider::before {
  margin-left: 1.5rem;
}
.chapter-divider::after {
  margin-right: 1.5rem;
}
.chapter-divider span {
  font-size: 2rem;
  color: var(--accent-color);
}
`;
  fs.writeFileSync(cssPath, css);
}

const files = ['content/pages/god-is-the-gospel.md', 'content/pages/seeing-and-savoring-jesus.md'];

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');

  // Remove existing <hr>s
  c = c.replace(/<hr\s*\/?>/g, '');

  // Replace existing custom dashed line separators with the new unified one
  // Match variations of the dashed div
  const dashedRegex = /<div[^>]*>⎯+<\/div>/g;
  c = c.replace(dashedRegex, '<div class="chapter-divider"><span>✥</span></div>');
  
  // Replace plain text dashes if any
  c = c.replace(/⎯{5,}/g, '');

  // Now, add the chapter-divider between chapters.
  // We can insert it before `<div id="ch...">` EXCEPT for the first chapter maybe?
  // Actually, separating the intro and ch1, ch1 and ch2, etc.
  // A safe way is to replace `<div id="ch` with `<div class="chapter-divider"><span>✥</span></div>\n<div id="ch`.
  // Wait, the regex `/<div id="ch/g` will do it. But let's check if it already has a divider right before it.
  
  // First, clean up any multiple dividers that might have been created
  
  c = c.replace(/(<div class="chapter-divider"><span>✥<\/span><\/div>\s*)+/g, '<div class="chapter-divider"><span>✥</span></div>');

  // Let's add the divider before every chapter div
  // We'll replace `<div id="ch` that doesn't have a divider before it.
  const parts = c.split('<div id="ch');
  if (parts.length > 1) {
    for (let i = 1; i < parts.length; i++) {
      // Check if parts[i-1] ends with our divider (ignoring whitespace)
      if (!parts[i-1].trim().endsWith('<span>✥</span></div>')) {
        parts[i-1] = parts[i-1].trimEnd() + '\n<div class="chapter-divider"><span>✥</span></div>\n';
      }
    }
    c = parts.join('<div id="ch');
  }

  // Also add one before `<div id="conc"` (conclusion)
  const concParts = c.split('<div id="conc"');
  if (concParts.length > 1) {
    for (let i = 1; i < concParts.length; i++) {
      if (!concParts[i-1].trim().endsWith('<span>✥</span></div>')) {
        concParts[i-1] = concParts[i-1].trimEnd() + '\n<div class="chapter-divider"><span>✥</span></div>\n';
      }
    }
    c = concParts.join('<div id="conc"');
  }

  fs.writeFileSync(file, c);
  console.log('Formatted', file);
});
