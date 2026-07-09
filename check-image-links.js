const fs = require('fs');
const c = fs.readFileSync('content/pages/come-lord-jesus.md', 'utf8');
const imgsHTML = c.match(/<img[^>]+src="([^"]+)"[^>]*>/g) || [];
const imgsMD = c.match(/!\[.*?\]\((.*?)\)/g) || [];
console.log('HTML Images:');
imgsHTML.forEach(i => console.log(i));
console.log('\nMD Images:');
imgsMD.forEach(i => console.log(i));
