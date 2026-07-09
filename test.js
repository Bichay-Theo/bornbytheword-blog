const fs = require('fs'); const c = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8'); const idx = c.indexOf('id="ch4-fn-9"'); console.log(c.substring(idx-50, idx+200));
