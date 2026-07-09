const fs = require('fs');
const c = fs.readFileSync('content/pages/come-lord-jesus.md', 'utf8');
const regex = /<a[^>]+href="([^"]+)"[^>]*>|\[.*?\]\((.*?)\)/g;
let match;
const links = [];
while ((match = regex.exec(c)) !== null) {
  let link = match[1] || match[2];
  if (link && !link.startsWith('#')) {
    links.push(link);
  }
}
console.log('Links in come-lord-jesus.md:');
links.forEach(l => console.log(l));
