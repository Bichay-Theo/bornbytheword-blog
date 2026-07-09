const fs = require('fs');
const allPosts = fs.readdirSync('content/posts').filter(f => f.endsWith('.md'));
allPosts.forEach(f => {
    const c = fs.readFileSync('content/posts/' + f, 'utf8');
    if (c.includes('<img') || c.includes('![')) {
        console.log(f, 'has image body');
    }
    if (c.match(/image:\s*".*?"/)) {
        console.log(f, 'has image frontmatter');
    }
});
