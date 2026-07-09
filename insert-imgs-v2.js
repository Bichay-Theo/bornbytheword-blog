const fs = require('fs');
const path = require('path');

const bookFile = 'content/pages/god-is-the-gospel.md';
let bookContent = fs.readFileSync(bookFile, 'utf8');
const postsDir = 'content/posts';

// God is the Gospel posts can be identified by frontmatter or category
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

let insertions = 0;

files.forEach(f => {
    const filePath = path.join(postsDir, f);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it belongs to God is the Gospel
    if (content.includes('categories: ["الله هو الإنجيل"]') || content.includes('categories:\n  - الله هو الإنجيل')) {
        // extract image
        const imgMatch = content.match(/image:\s*"(.*?)"/);
        if (imgMatch) {
            const imgUrl = imgMatch[1];
            // Get the title to find where to put it
            // usually it's title: "..."
            const titleMatch = content.match(/title:\s*"(.*?)"/);
            if (titleMatch) {
                let title = titleMatch[1];
                // title could be diacritized or not. We will just search the book for this title.
                // Wait! In the book, chapters might have a prefix or different formatting.
                // Let's just find the corresponding `<h2>...</h2>` or `<h3>...</h3>` in the book.
                
                // If title contains "الفصل", let's extract the number word
                const chapMatch = title.match(/الفصل (الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|الحادي عشر|الثاني عشر|الثالث عشر)/);
                if (chapMatch) {
                   const word = chapMatch[1];
                   // regex to match <h2> or <h3> containing الفصل followed by the word
                   const regex = new RegExp(`(<h[23][^>]*>.*?الفصل.*?${word}.*?<\\/h[23]>)`, 'i');
                   if (regex.test(bookContent)) {
                       // insert image immediately after header
                       if (!bookContent.includes(imgUrl)) {
                           bookContent = bookContent.replace(regex, `$1\n\n<p style="text-align: center;"><img src="${imgUrl}" alt="${title}" style="max-width: 100%; border-radius: 8px;" /></p>\n\n`);
                           insertions++;
                       }
                   }
                }
            }
        }
    }
});

fs.writeFileSync(bookFile, bookContent);
console.log(`Inserted ${insertions} images into God is the Gospel.`);
