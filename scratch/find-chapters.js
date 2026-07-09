const fs = require('fs');
const files = fs.readdirSync('content/posts').filter(f => f.endsWith('.md'));
files.forEach(f => {
  const txt = fs.readFileSync('content/posts/' + f, 'utf8');
  const match = txt.match(/title:\s*"?([^"]+)"?/);
  if (match) {
    const title = match[1];
    if (title.includes('الفصل') || title.includes('ترجمة كتاب') || title.includes('الخاتمة') || title.includes('المقدمة')) {
      // It's probably a chapter
      if (title.includes('الله هو الإنجيل') || title.includes('تعال أيها الرب يسوع')) {
        console.log(f, title);
      }
    }
  }
});
