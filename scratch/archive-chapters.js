const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../content/posts');
const archiveDir = path.join(__dirname, '../content/archive');

if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir);
}

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
let movedCount = 0;

files.forEach(f => {
  const content = fs.readFileSync(path.join(postsDir, f), 'utf8');
  // Match title regardless of escaped quotes
  const titleMatch = content.match(/title:\s*(.+)/);
  if (titleMatch) {
    const title = titleMatch[1].replace(/['"]/g, '');
    if ((title.includes('تعال أيها الرب يسوع') || title.includes('الله هو الإنجيل') || title.includes('تعال ايها الرب يسوع')) && 
        (title.includes('الفصل') || title.includes('مقدمة') || title.includes('خاتمة'))) {
      console.log('Moving:', f, '->', title);
      fs.renameSync(path.join(postsDir, f), path.join(archiveDir, f));
      movedCount++;
    }
  }
});

console.log('Total files moved:', movedCount);
