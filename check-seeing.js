const fs = require('fs');
let c2 = fs.readFileSync('content/pages/seeing-and-savoring-jesus.md', 'utf8');
const ids2 = [...c2.matchAll(/<div id="([^"]+)">/g)].map(m => m[1]);
console.log('\nIDs in seeing-and-savoring-jesus:', ids2);

const idx1 = c2.indexOf('<div id="ch1">');
const idx2 = c2.indexOf('<div id="ch2">');
console.log('\nEnd of ch1:', c2.substring(idx2 - 800, idx2));
