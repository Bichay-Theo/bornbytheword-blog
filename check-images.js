const fs = require('fs');
const c = fs.readFileSync('content/pages/come-lord-jesus.md', 'utf8');
const imgCount = (c.match(/<img/gi) || []).length + (c.match(/!\[/g) || []).length;
console.log('Image count in book:', imgCount);

const files = fs.readdirSync('content/posts').filter(f => f.endsWith('.md'));
let postImgCount = 0;
files.forEach(f => {
    let text = fs.readFileSync('content/posts/' + f, 'utf8');
    postImgCount += (text.match(/<img/gi) || []).length + (text.match(/!\[/g) || []).length;
});
console.log('Image count in posts:', postImgCount);

console.log('Return links in book:', (c.match(/عودة إلى الفهرس/g) || []).length);
