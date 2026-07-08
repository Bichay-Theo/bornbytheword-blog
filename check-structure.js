const fs = require('fs');
let c = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');

// Print all div IDs
const ids = [...c.matchAll(/<div id="([^"]+)">/g)].map(m => m[1]);
console.log('IDs in god-is-the-gospel:', ids);

// See how footnotes look like in the text
const fnIdx = c.indexOf('[1]');
if (fnIdx !== -1) {
  console.log('\nSnippet around [1]:', c.substring(fnIdx - 50, fnIdx + 50));
}

let c2 = fs.readFileSync('content/pages/seeing-and-savoring-jesus.md', 'utf8');
const ids2 = [...c2.matchAll(/<div id="([^"]+)">/g)].map(m => m[1]);
console.log('\nIDs in seeing-and-savoring-jesus:', ids2);

