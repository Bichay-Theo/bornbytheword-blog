const fs = require('fs');
const c = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');
const matches = c.match(/<p id=\"ch4-fn-.*?>.*?<\/p>/g);
if (matches) {
    console.log(matches.join('\n'));
} else {
    console.log("No matches found");
}
