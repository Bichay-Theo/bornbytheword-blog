const fs = require('fs');
const files = ['content/pages/god-is-the-gospel.md', 'content/pages/seeing-and-savoring-jesus.md'];
files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  // Remove all Return to Index links
  c = c.replace(/<p style="text-align: center; margin: 3rem 0; font-weight: bold;"><a href="#">عودة إلى الفهرس ⬆️<\/a><\/p>\s*/g, '');
  // Clean up any double chapter-dividers that might have been caused
  c = c.replace(/(<div class="chapter-divider"><span>✥<\/span><\/div>\s*)+/g, '<div class="chapter-divider"><span>✥</span></div>\n');
  fs.writeFileSync(file, c);
  console.log('Cleaned', file);
});
