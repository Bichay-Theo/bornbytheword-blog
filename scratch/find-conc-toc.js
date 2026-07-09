const fs = require('fs');
const txt = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');
const match = txt.match(/<a href="#([^"]+)"[^>]*>.*?خاتمة.*?<\/a>/i);
console.log(match ? match[1] : 'not found');
