const fs = require('fs');
const path = require('path');

const dirs = ['content/posts', 'content/pages'];

dirs.forEach(d => {
    fs.readdirSync(d).filter(f => f.endsWith('.md')).forEach(f => {
        const fullPath = path.join(d, f);
        let c = fs.readFileSync(fullPath, 'utf8');
        let newC = c.replace(/<a href="\/" style="display: inline-block;[^>]*>العودة للرئيسية 🏠<\/a>/g, (match) => {
            return match.replace('href="/"', 'href="/bornbytheword-blog/"');
        });
        
        // Also if the link is in markdown format like [العودة للرئيسية 🏠](/) 
        newC = newC.replace(/\[العودة للرئيسية 🏠\]\(\/\)/g, '[العودة للرئيسية 🏠](/bornbytheword-blog/)');

        if (c !== newC) {
            fs.writeFileSync(fullPath, newC);
            console.log('Fixed return home link in', f);
        }
    });
});
