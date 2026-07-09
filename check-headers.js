const fs = require('fs');
const c = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');
const headers = c.match(/<h[23][^>]*>.*?<\/h[23]>/g);
console.log(headers.slice(0, 10).join('\n'));
