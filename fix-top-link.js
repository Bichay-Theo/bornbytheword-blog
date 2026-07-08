const fs = require('fs');
let c = fs.readFileSync('content/pages/seeing-and-savoring-jesus.md', 'utf8');

c = c.replace(/<p style="text-align: center; margin: 3rem 0; font-weight: bold;"><a href="#">عودة إلى الفهرس ⬆️<\/a><\/p>\s*<div class="chapter-divider"><span>✥<\/span><\/div><div class="author-name">/, '<div class="chapter-divider"><span>✥</span></div><div class="author-name">');

fs.writeFileSync('content/pages/seeing-and-savoring-jesus.md', c);
