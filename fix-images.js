const fs = require('fs');
const path = 'content/pages/god-is-the-gospel.md';
let c = fs.readFileSync(path, 'utf8');

const regex = /<p style="text-align: center;">(!\[.*?\]\(.*?\))<\/p>/g;
const matches = c.match(regex);
console.log('Found', matches ? matches.length : 0, 'matches');

const newC = c.replace(regex, '$1');
if (c !== newC) {
    fs.writeFileSync(path, newC);
    console.log('Fixed images!');
}
