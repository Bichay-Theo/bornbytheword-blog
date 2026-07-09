const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../content/pages');

function fixComeLordJesus() {
    const filePath = path.join(baseDir, 'come-lord-jesus.md');
    let content = fs.readFileSync(filePath, 'utf8');

    // Each chapter starts with <div id="chX"> and has an <h2>
    const chapterRegex = /(<div id="ch\d+">[\s\S]*?<h2[^>]*>.*?<\/h2>)([\s\S]*?)(?=<div id="ch\d+">|$)/g;

    let modified = false;
    content = content.replace(chapterRegex, (match, header, body) => {
        // Find image inside the body
        const imgMatch = body.match(/(<a href="[^"]*blogger.googleusercontent.com[^"]*"\s*>)?\s*<img src="[^"]*blogger.googleusercontent.com[^"]*"[^>]*>\s*(<\/a>)?/);
        
        if (imgMatch) {
            // Remove image from body
            const newBody = body.replace(imgMatch[0], '');
            modified = true;
            console.log('Moved image in come-lord-jesus');
            // Insert image right after header
            return `${header}\n<div style="text-align: center; margin: 2rem 0;">\n${imgMatch[0].trim()}\n</div>\n${newBody}`;
        }
        return match;
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated come-lord-jesus.md');
    }
}

fixComeLordJesus();
