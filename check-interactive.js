const fs = require('fs');
const c1 = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');
const c2 = fs.readFileSync('content/pages/seeing-and-savoring-jesus.md', 'utf8');

console.log('god-is-the-gospel interactive:', c1.includes('id="ref1"'), c1.includes('id="fn1"'));
console.log('seeing-and-savoring-jesus interactive:', c2.includes('id="ref1"'), c2.includes('id="fn1"'));
