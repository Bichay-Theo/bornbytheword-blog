const fs = require('fs');
const txt = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');
const idx = txt.indexOf('id="ch3"');
console.log(txt.substring(idx, idx + 1000));
