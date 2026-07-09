const fs = require('fs');
const path = require('path');

const dirs = ['content/posts', 'content/pages'];

dirs.forEach(d => {
    fs.readdirSync(d).filter(f => f.endsWith('.md')).forEach(f => {
        const fullPath = path.join(d, f);
        let c = fs.readFileSync(fullPath, 'utf8');
        
        // Match <a href="/">العودة للرئيسية 🏠</a>
        let newC = c.replace(/<a href="\/".*?>العودة للرئيسية 🏠<\/a>/g, (match) => {
            return match.replace('href="/"', 'href="/bornbytheword-blog/"');
        });
        
        if (c !== newC) {
            fs.writeFileSync(fullPath, newC);
            console.log('Fixed return home link in', f);
        }
    });
});
