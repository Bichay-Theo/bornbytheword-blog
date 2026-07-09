const fs = require('fs');
const path = require('path');

const dir = 'content/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Central fix for ALL custom footnote links [[1]](#something)
    content = content.replace(/\[\[(\d+)\]\]\(#(.*?)\)/g, (match, num, target) => {
        let sourceId = '';
        if (target.includes('fn')) {
            sourceId = target.replace('fn', 'ref');
        } else if (target.includes('ref')) {
            sourceId = target.replace('ref', 'fn');
        } else {
            sourceId = target + '-source';
        }
        return `<sup id="${sourceId}"><a href="#${target}" style="text-decoration: none; color: var(--primary-color);">[${num}]</a></sup>`;
    });

    fs.writeFileSync(filePath, content);
    console.log(`Applied central footnote fix to: ${file}`);
});
