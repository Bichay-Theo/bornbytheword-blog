const fs = require('fs');
const c = fs.readFileSync('content/posts/glory-of-christ-primary-reality-second-coming.md', 'utf8');
console.log(c.match(/<sup.*?<\/sup>/g));
console.log(c.match(/<p id=\"fn.*?>/g));
