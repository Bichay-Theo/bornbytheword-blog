const fs = require('fs');
const path = require('path');

const dirs = ['content/posts', 'content/pages'];

dirs.forEach(d => {
    fs.readdirSync(d).filter(f => f.endsWith('.md')).forEach(f => {
        const fullPath = path.join(d, f);
        let c = fs.readFileSync(fullPath, 'utf8');
        
        // Remove the <sup><a...>...</a></sup> wrappers
        const newC = c.replace(/<sup><a href="#fn.*?" id="ref.*?" class="footnote-link">\[([0-9١٢٣٤٥٦٧٨٩٠]+)\]<\/a><\/sup>/g, '[$1]');
        
        if (c !== newC) {
            fs.writeFileSync(fullPath, newC);
            console.log('Cleaned footnotes in', f);
        }
    });
});
