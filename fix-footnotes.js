const fs = require('fs');
let content = fs.readFileSync('content/pages/come-lord-jesus.md', 'utf8');

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

fs.writeFileSync('content/pages/come-lord-jesus.md', content);
console.log('Fixed footnotes in come-lord-jesus.md');
