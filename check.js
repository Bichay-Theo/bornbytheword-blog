const fs = require('fs');
const c = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');

const fnIdx = c.indexOf('class="footnote-section"');
if (fnIdx !== -1) {
  console.log('Footnote section:', c.substring(fnIdx, fnIdx + 300));
  console.log('\nText before footnote section:', c.substring(fnIdx - 300, fnIdx));
}
