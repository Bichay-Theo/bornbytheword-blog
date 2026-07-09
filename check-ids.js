const fs = require('fs');
const c = fs.readFileSync('out/p/god-is-the-gospel.html', 'utf8');
const matches = c.match(/<h[23] id="[^"]*"/g);
if (matches) console.log(matches.slice(0, 10).join('\n'));
