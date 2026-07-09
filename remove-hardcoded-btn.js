const fs = require('fs');
const path = require('path');

const dirs = ['content/posts', 'content/pages'];

dirs.forEach(d => {
    fs.readdirSync(d).filter(f => f.endsWith('.md')).forEach(f => {
        const fullPath = path.join(d, f);
        let c = fs.readFileSync(fullPath, 'utf8');
        
        // Remove the return to home paragraph
        const newC = c.replace(/<p style="text-align: center; margin-top: 30px;"><a href="\/bornbytheword-blog\/".*?>العودة للرئيسية 🏠<\/a><\/p>\s*/g, '');
        
        if (c !== newC) {
            fs.writeFileSync(fullPath, newC);
            console.log('Removed hardcoded button from', f);
        }
    });
});
