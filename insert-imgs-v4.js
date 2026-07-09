const fs = require('fs');
const path = require('path');

const bookFile = 'content/pages/god-is-the-gospel.md';
let bookContent = fs.readFileSync(bookFile, 'utf8');
const postsDir = 'content/posts';

// A better way to strip Arabic diacritics
function stripDiacritics(str) {
    // Characters: Fathatan, Dammatan, Kasratan, Fatha, Damma, Kasra, Shadda, Sukun, superscript alef
    return str.replace(/[ًٌٍَُِّْٰ]/g, '').replace(/[أإآ]/g, 'ا');
}

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

let insertions = 0;

files.forEach(f => {
    const filePath = path.join(postsDir, f);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('categories: ["الله هو الإنجيل"]') || content.includes('categories:\n  - الله هو الإنجيل')) {
        const imgMatch = content.match(/image:\s*"(.*?)"/);
        if (imgMatch) {
            const imgUrl = imgMatch[1];
            const titleMatch = content.match(/title:\s*"(.*?)"/);
            if (titleMatch) {
                let title = titleMatch[1];
                let strippedTitle = stripDiacritics(title);
                
                // Chapter 1, 2, 3 ...
                const chapMatch = strippedTitle.match(/الفصل (الاول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|الحادي عشر|الثاني عشر|الثالث عشر)/);
                if (chapMatch) {
                   const word = chapMatch[1];
                   
                   const headerRegex = /<h[23][^>]*>(.*?)<\/h[23]>/gi;
                   bookContent = bookContent.replace(headerRegex, (match, headerText) => {
                       const strippedHeader = stripDiacritics(headerText);
                       if (strippedHeader.includes('الفصل ' + word) && !match.includes(imgUrl) && !bookContent.includes(imgUrl)) {
                           insertions++;
                           return `${match}\n\n<p style="text-align: center;"><img src="${imgUrl}" alt="${title}" style="max-width: 100%; border-radius: 8px;" /></p>\n\n`;
                       }
                       return match;
                   });
                }
            }
        }
    }
});

fs.writeFileSync(bookFile, bookContent);
console.log(`Inserted ${insertions} images into God is the Gospel.`);
