const fs = require('fs');
const path = require('path');

const dirs = ['content/posts', 'content/pages'];

dirs.forEach(d => {
    fs.readdirSync(d).filter(f => f.endsWith('.md')).forEach(f => {
        const fullPath = path.join(d, f);
        let c = fs.readFileSync(fullPath, 'utf8');
        
        const regex = /<p[^>]*>\s*(\[!\[.*?\]\(.*?\)\]\(.*?\)|!\[.*?\]\(.*?\))\s*<\/p>/g;
        let newC = c.replace(regex, '$1');
        
        if (c !== newC) {
            fs.writeFileSync(fullPath, newC);
            console.log('Fixed images in', f);
        }
    });
});
