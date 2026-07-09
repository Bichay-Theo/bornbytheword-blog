const fs = require('fs');
const path = require('path');

const postsDir = 'content/posts';
const returnBtnHtml = '<p style="text-align: center; margin-top: 30px;"><a href="/" style="display: inline-block; padding: 10px 20px; background-color: var(--primary); color: white; border-radius: 5px; text-decoration: none; font-weight: bold;">العودة للرئيسية 🏠</a></p>';

fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).forEach(f => {
    const fullPath = path.join(postsDir, f);
    let c = fs.readFileSync(fullPath, 'utf8');
    
    // Check if it already has a return to home
    if (!c.includes('العودة للرئيسية 🏠')) {
       // Insert it at the very end
       c = c + '\n\n' + returnBtnHtml + '\n';
       fs.writeFileSync(fullPath, c);
       console.log('Added Return to Home to', f);
    }
});
