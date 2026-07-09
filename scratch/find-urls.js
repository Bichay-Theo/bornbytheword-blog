const fs = require('fs');
const txt = fs.readFileSync('content/pages/seeing-and-savoring-jesus.md', 'utf8');
const urls = txt.match(/https?:\/\/[^\s"'<>\)]+/g) || [];
urls.forEach(u => console.log(u));
