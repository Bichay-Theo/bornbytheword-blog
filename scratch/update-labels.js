const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../content/posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

let updatedCount = 0;

files.forEach(f => {
  const filePath = path.join(postsDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if labels already exist
  if (content.includes('labels:')) {
    content = content.replace(/labels:\s*\[.*?\]/, 'labels: ["الترجمات", "الكل"]');
  } else {
    // Insert labels before the closing --- of frontmatter
    content = content.replace(/(\n---\n)$/m, '\nlabels: ["الترجمات", "الكل"]$1');
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  updatedCount++;
});

console.log('Updated labels for', updatedCount, 'files in content/posts/');
