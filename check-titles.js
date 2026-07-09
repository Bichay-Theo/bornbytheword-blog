const fs = require('fs');

const posts = fs.readdirSync('content/posts').filter(f => f.startsWith('blog-post'));
// Ah! The post files for "God is the Gospel" are actually `blog-post_*.md`! 
// Let me just read all files and check category.

const allPosts = fs.readdirSync('content/posts').filter(f => f.endsWith('.md'));
allPosts.forEach(f => {
    const c = fs.readFileSync('content/posts/' + f, 'utf8');
    if (c.includes('الله هو الإنجيل')) {
       const t = c.match(/title:\s*"(.*?)"/);
       if(t) console.log(f, ':', t[1]);
    }
});
