const fs = require('fs');
const path = require('path');

const arabicToEnglish = {'١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9','٠':'0'};

function fixAllFootnotes() {
    const processFile = (filePath) => {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;
        
        // This regex matches optionally escaped brackets like \[٢\] or [2] or \[1]
        // Group 1 captures the number.
        const inlineRegex = /\\?\[([١٢٣٤٥٦٧٨٩٠1234567890]+)\\?\]/g;
        
        newContent = newContent.replace(inlineRegex, (match, numStr, offset, string) => {
            // Check if we are inside <sup or <a or id="...
            const before = string.substring(0, offset);
            if (before.match(/<sup[^>]*>[^<]*$/) || before.match(/<a[^>]*>[^<]*$/) || before.match(/id="[^"]*$/)) {
                return match;
            }
            
            // It could be at the bottom inside definitions. E.g. <p id="fn1">الهوامش: [1] ...
            // We shouldn't replace if it's right after الهوامش: or <p id="fn
            if (before.match(/الهوامش:\s*$/) || before.match(/<p id="fn[0-9]+"[^>]*>\s*<span[^>]*>\s*$/)) {
                return match;
            }

            let eng = numStr.split('').map(ch => arabicToEnglish[ch] || ch).join('');
            return `<sup><a href="#fn${eng}" id="ref${eng}" class="footnote-link">[${eng}]</a></sup>`;
        });
        
        if (content !== newContent) {
           fs.writeFileSync(filePath, newContent);
           return true;
        }
        return false;
    };

    ['content/posts', 'content/pages'].forEach(dir => {
        fs.readdirSync(dir).filter(f => f.endsWith('.md')).forEach(f => {
            processFile(path.join(dir, f));
        });
    });
}

fixAllFootnotes();
console.log('Fixed all inline footnotes!');
