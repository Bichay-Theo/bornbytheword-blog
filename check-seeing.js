const fs = require('fs');
const c = fs.readFileSync('content/pages/seeing-and-savoring-jesus.md', 'utf8');
console.log('sup tags:', c.match(/<sup[^>]*>/g));
console.log('fn1 id:', c.includes('id="fn1"'));

const c2 = fs.readFileSync('content/pages/come-lord-jesus.md', 'utf8');
console.log('CLJ sup tags:', c2.match(/<sup[^>]*>/g));
