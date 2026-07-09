const fs = require('fs');
const c = fs.readFileSync('content/posts/blog-post_0.md', 'utf8');
const match = c.match(/image:\s*"(.*?)"/);
console.log(match);
