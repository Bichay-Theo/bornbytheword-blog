const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../content/pages/god-is-the-gospel.md');
let content = fs.readFileSync(filePath, 'utf8');

// Extract all images
const imgRegex = /(?:<div style="text-align: center; margin: 2rem 0;">\s*)?(<img src="[^"]*\/([0-9]+)\.png"[^>]*>)(?:\s*<\/div>)?/g;

const extractedImages = {};
content = content.replace(imgRegex, (match, imgTag, num) => {
    extractedImages[parseInt(num, 10)] = imgTag;
    return ''; 
});

console.log('Extracted images from god-is-the-gospel:', Object.keys(extractedImages));

// For each extracted image, insert it into the corresponding chapter
for (const [chapterNum, imgTag] of Object.entries(extractedImages)) {
    // Match <div id="chX"> followed by anything up to the <h3> tag
    // Since the chapters are minified, we just want to match the <h3> tag and insert the image right after it.
    const targetRegex = new RegExp(`(<div id="ch${chapterNum}">[\\s\\S]*?<h3[^>]*>.*?</h3>)`, 'g');
    
    content = content.replace(targetRegex, (match, header) => {
        console.log('Inserted image for chapter', chapterNum);
        return `${header}<div style="text-align: center; margin: 2rem 0;">${imgTag}</div>`;
    });
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated god-is-the-gospel.md');
