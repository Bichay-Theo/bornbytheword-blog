const fs = require('fs');
let c = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');

// The footnotes for chapter 4 were missing from the inline text!
// Footnote 4:
c = c.replace('المرجع السابق (إدواردز).', 'المرجع السابق (إدواردز).'); // Wait, I don't know EXACTLY where they belong in the text!
