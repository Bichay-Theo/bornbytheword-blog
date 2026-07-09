const fs = require('fs');
const path = require('path');

const arabicToEnglish = {'١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9','٠':'0'};

function fixAllFootnotes() {
    const processFile = (filePath) => {
        let content = fs.readFileSync(filePath, 'utf8');
        
        let footnoteDefs = [];
        const lines = content.split('\n');
        
        // Find unprocessed definitions (e.g., [1] text)
        const defRegex = /^(?:<p[^>]*>)?(?:الهوامش:\s*)?\[(١|٢|٣|٤|٥|٦|٧|٨|٩|٠|1|2|3|4|5|6|7|8|9|0)+\](.*)$/;
        lines.forEach((line, idx) => {
            const match = line.match(defRegex);
            if (match && !line.includes('<sup id="')) {
                let numStr = match[1].split('').map(ch => arabicToEnglish[ch] || ch).join('');
                let num = parseInt(numStr, 10);
                footnoteDefs.push({num, text: match[2], lineIdx: idx, original: line});
            }
        });
        
        // Find processed definitions so we can link to them
        const processedDefRegex = /<p id="fn(1|2|3|4|5|6|7|8|9|0)+"/;
        lines.forEach((line, idx) => {
            const match = line.match(processedDefRegex);
            if (match) {
                let num = parseInt(match[1], 10);
                if (!footnoteDefs.find(d => d.num === num)) {
                   footnoteDefs.push({num, lineIdx: idx, alreadyProcessed: true});
                }
            }
        });
        
        if (footnoteDefs.length === 0) return false;

        // Replace unprocessed definitions
        footnoteDefs.forEach(def => {
            if (def.alreadyProcessed) return;
            const eng = def.num.toString();
            // remove الهوامش: from the beginning if it exists
            let rawText = def.original.replace(/^(?:<p[^>]*>)?(?:الهوامش:\s*)?\[.*?\]/, '').trim();
            if (rawText.endsWith('</p>')) rawText = rawText.slice(0, -4);
            
            let newDef = `<p id="fn${eng}" style="margin-bottom: 1rem; border-top: 1px solid var(--secondary); padding-top: 1rem;">`;
            newDef += `<span style="font-weight: bold; color: var(--primary);">[${eng}]</span> ${rawText} `;
            newDef += `<a href="#ref${eng}" title="عودة إلى النص" style="text-decoration: none; font-size: 1.2em;">↩</a></p>`;
            
            lines[def.lineIdx] = newDef;
        });
        
        let newContent = lines.join('\n');
        
        // Fix inline markers: [1], [١], \[1\], \[١\]
        footnoteDefs.forEach(def => {
            const eng = def.num.toString();
            const ar = eng.split('').map(ch => Object.keys(arabicToEnglish).find(k => arabicToEnglish[k] === ch)).join('');
            
            // We can literally search and replace because replacing string matches exactly
            const replaceTargets = [
                `\\[${eng}\\]`, // \[1\]
                `\\[${ar}\\]`,   // \[١\]
                `[${eng}]`,      // [1]
                `[${ar}]`        // [١]
            ];
            
            const replacement = `<sup><a href="#fn${eng}" id="ref${eng}" class="footnote-link">[${eng}]</a></sup>`;
            
            // Because string.replace only replaces the FIRST occurrence when passed a string,
            // we loop or use split/join
            replaceTargets.forEach(target => {
                // Split by target, but be careful not to touch definitions at the bottom
                // Only replace in the main text body (before the first <p id="fn1">)
                let parts = newContent.split('<p id="fn1"');
                if(parts.length > 1) {
                    let body = parts[0];
                    let footer = '<p id="fn1"' + parts.slice(1).join('<p id="fn1"');
                    // Avoid replacing inside existing <sup...> tags
                    let bodyParts = body.split('<sup>');
                    let newBodyParts = bodyParts.map(p => {
                       if (p.includes('</a></sup>')) {
                           let subParts = p.split('</a></sup>');
                           subParts[1] = subParts[1].split(target).join(replacement);
                           return subParts.join('</a></sup>');
                       } else {
                           return p.split(target).join(replacement);
                       }
                    });
                    newContent = newBodyParts.join('<sup>') + footer;
                }
            });
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
console.log('Fixed all footnotes!');
