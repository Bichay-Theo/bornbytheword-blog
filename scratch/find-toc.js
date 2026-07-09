const fs = require('fs');
const txt = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');
const matches = txt.match(/<a href="#([^"]+)"[^>]*>(.*?)<\/a>/g) || [];
matches.forEach(m => console.log(m));
