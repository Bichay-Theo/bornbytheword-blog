const fs = require('fs');
const txt = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');
const match = txt.match(/<div id="([^"]+)">\s*<h2[^>]*>.*?خاتمة.*?<\/h2>/i);
console.log(match ? match[1] : 'not found');
