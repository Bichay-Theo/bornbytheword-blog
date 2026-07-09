const fs = require('fs');
const c = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');

const tocMatch = c.match(/<aside.*?<\/aside>/s);
if (tocMatch) {
    console.log(tocMatch[0].substring(0, 300));
} else {
    // If not aside, maybe it's just ul/li
    const ulMatch = c.match(/<ul.*?<\/ul>/s);
    if (ulMatch) console.log(ulMatch[0].substring(0, 300));
}
