const fs = require('fs');
const c = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');
const matches = c.match(/<p id=\"[^\"]*fn[^\"]*\".*?<\/p>/g);
if (matches) {
    console.log(matches.slice(0, 5).join('\n'));
} else {
    console.log("No matches found");
}
