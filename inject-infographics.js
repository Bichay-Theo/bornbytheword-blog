const fs = require('fs');
const path = require('path');

const books = [
    'content/pages/come-lord-jesus.md',
    'content/pages/god-is-the-gospel.md',
    'content/pages/seeing-and-savoring-jesus.md'
];

let bookContents = {};
books.forEach(b => {
    bookContents[b] = fs.readFileSync(b, 'utf8');
});

const postsDir = 'content/posts';
const posts = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

let totalInserted = 0;

function stripDiacritics(str) {
    return str.replace(/[ًٌٍَُِّْٰ]/g, '').replace(/[أإآ]/g, 'ا');
}

posts.forEach(f => {
    const postContent = fs.readFileSync(path.join(postsDir, f), 'utf8');
    
    // Find the first image
    const imgMatch = postContent.match(/!\[.*?\]\(.*?\)|<img[^>]*>/);
    if (!imgMatch) return;
    
    const imgTag = imgMatch[0];
    
    // Extract a few words from the first real paragraph to search in the book
    // We split by \n and find the first line that is text (not empty, not heading, not image, not frontmatter)
    const lines = postContent.split('\n');
    let searchLine = '';
    let insideFrontmatter = false;
    let frontmatterDashes = 0;
    
    for (let line of lines) {
        if (line.startsWith('---')) {
            frontmatterDashes++;
            insideFrontmatter = (frontmatterDashes === 1);
            continue;
        }
        if (insideFrontmatter) continue;
        
        let t = line.trim();
        if (t === '' || t.startsWith('#') || t.startsWith('!') || t.startsWith('<img') || t.startsWith('<p><img')) {
            continue;
        }
        
        // This is a text line
        // Take first 30 characters
        searchLine = stripDiacritics(t.substring(0, 50).trim());
        break;
    }
    
    if (searchLine.length < 10) return; // too short to search reliably
    
    // Find this line in the books
    for (let b of books) {
        let bContentStripped = stripDiacritics(bookContents[b]);
        const idx = bContentStripped.indexOf(searchLine);
        if (idx !== -1) {
            // Found it!
            // But we need the index in the ORIGINAL string.
            // Since stripping diacritics changes string length, we can't use `idx` directly.
            // Instead, we can build a regex from the searchLine by allowing optional diacritics between each character.
            
            const regexStr = searchLine.split('').map(ch => {
                if (ch === ' ' || ch === '\\') return '\\s+';
                if (ch === 'ا') return '[أإآا]';
                // escape special regex chars
                if ('?*+^$()[]{}|.'.includes(ch)) return '\\' + ch;
                return ch;
            }).join('[ًٌٍَُِّْٰ]*');
            
            const searchRegex = new RegExp('(' + regexStr + ')');
            const match = bookContents[b].match(searchRegex);
            
            if (match) {
                // Insert the image right before this match!
                // Wait, check if the image is already there!
                // The image might be `![](...)` so let's extract the URL to check
                const urlMatch = imgTag.match(/src="(.*?)"/) || imgTag.match(/\((.*?)\)/);
                if (urlMatch) {
                    const url = urlMatch[1];
                    if (!bookContents[b].includes(url)) {
                        // Insert!
                        // Format the image properly
                        const insertImg = `\n<p style="text-align: center;">${imgTag}</p>\n\n`;
                        bookContents[b] = bookContents[b].replace(searchRegex, insertImg + '$1');
                        totalInserted++;
                        console.log(`Inserted image from ${f} into ${path.basename(b)}`);
                    }
                }
            }
            break; // Stop searching other books
        }
    }
});

books.forEach(b => {
    fs.writeFileSync(b, bookContents[b]);
});

console.log(`Total images inserted: ${totalInserted}`);
