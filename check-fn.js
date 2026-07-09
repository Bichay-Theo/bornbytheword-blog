const fs = require('fs');
const c = fs.readFileSync('content/posts/christ-humility-exaltation-kenosis-study.md', 'utf8');
console.log(c.match(/<sup.*?<\/sup>/g));
console.log(c.match(/<p id=\"fn.*?>/g));
