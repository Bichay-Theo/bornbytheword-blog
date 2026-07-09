const fs = require('fs');

const c = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');

function strip(str) {
    return str.replace(/[ًٌٍَُِّْٰ]/g, '').replace(/[أإآ]/g, 'ا');
}

const headers = c.match(/<h[23][^>]*>(.*?)<\/h[23]>/g);
if (headers) {
    headers.slice(0, 5).forEach(h => {
        console.log('Raw:', h, '\nStripped:', strip(h));
    });
}
