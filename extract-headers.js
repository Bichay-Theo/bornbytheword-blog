const fs = require('fs');
const path = require('path');

function getHeaders(dir) {
  let headers = new Set();
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  files.forEach(f => {
    const c = fs.readFileSync(path.join(dir, f), 'utf8');
    const matches = c.match(/^#{1,6}\s+(.*)$/gm) || [];
    matches.forEach(m => {
      let headerText = m.replace(/^#{1,6}\s+/, '').trim();
      // Skip if it contains HTML or is English or is very short
      if (headerText.length > 2 && !headerText.includes('<') && /[أ-ي]/.test(headerText)) {
        headers.add(headerText);
      }
    });
  });
  return headers;
}

let allHeaders = new Set([
    ...getHeaders('content/pages'),
    ...getHeaders('content/posts')
]);

fs.writeFileSync('C:\\Users\\Boaz\\.gemini\\antigravity\\scratch\\bornbytheword-blog\\headers-to-diacritize.json', JSON.stringify([...allHeaders], null, 2));
console.log('Found ' + allHeaders.size + ' unique headers.');
