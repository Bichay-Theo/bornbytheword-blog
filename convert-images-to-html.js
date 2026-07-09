const fs = require('fs');
const path = require('path');

const dirs = ['content/posts', 'content/pages'];

dirs.forEach(d => {
    fs.readdirSync(d).filter(f => f.endsWith('.md')).forEach(f => {
        const fullPath = path.join(d, f);
        let c = fs.readFileSync(fullPath, 'utf8');
        
        // Convert [![](url)](url) to <img src="url" style="max-width: 100%; height: auto; margin: 2rem auto; display: block;" />
        let newC = c.replace(/\[!\[(.*?)\]\((.*?)\)\]\((.*?)\)/g, (match, alt, src, link) => {
            return `<a href="${link}"><img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; margin: 2rem auto; display: block; border-radius: 8px;" /></a>`;
        });
        
        // Convert ![](url) to <img src="url" ... />
        newC = newC.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
            return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; margin: 2rem auto; display: block; border-radius: 8px;" />`;
        });
        
        if (c !== newC) {
            fs.writeFileSync(fullPath, newC);
            console.log('Converted images in', f);
        }
    });
});
