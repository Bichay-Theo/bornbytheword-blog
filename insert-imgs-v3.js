const fs = require('fs');
const path = require('path');

const bookFile = 'content/pages/god-is-the-gospel.md';
let bookContent = fs.readFileSync(bookFile, 'utf8');
const postsDir = 'content/posts';

// function to strip diacritics
function stripDiacritics(str) {
    return str.replace(/[\u064B-\u0652]/g, '');
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
                const chapMatch = stripDiacritics(title).match(/الفصل (الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|الحادي عشر|الثاني عشر|الثالث عشر)/);
                if (chapMatch) {
                   const word = chapMatch[1];
                   
                   // Instead of searching with Regex, let's find the headers in the book and check their stripped text
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
