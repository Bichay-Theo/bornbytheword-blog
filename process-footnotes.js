const fs = require('fs');
const path = require('path');

const arabicToEnglish = {'١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9','٠':'0'};

function processFootnotesInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    let footnoteDefs = [];
    const lines = content.split('\n');
    const defRegex = /^(?:<p[^>]*>)?(?:الهوامش:\s*)?\[(١|٢|٣|٤|٥|٦|٧|٨|٩|٠|1|2|3|4|5|6|7|8|9|0)+\](.*)$/;
    
    // Some definitions are already processed with <sup id="...">, we need to handle that or skip if already done perfectly.
    // If we see <sup id="intro-fnref-1">, it means it's already an interactive footnote.
    // But since they are broken, we should re-process carefully. Let's just find un-processed definitions first.
    
    lines.forEach((line, idx) => {
        // If it looks like a raw definition
        const match = line.match(defRegex);
        if (match && !line.includes('<sup id="')) {
            let numStr = match[1].split('').map(ch => arabicToEnglish[ch] || ch).join('');
            let num = parseInt(numStr, 10);
            footnoteDefs.push({num, text: match[2], lineIdx: idx, original: line});
        }
    });
    
    // Also find already processed definitions so we can link to them!
    const processedDefRegex = /<p id="fn(1|2|3|4|5|6|7|8|9|0)+"/;
    lines.forEach((line, idx) => {
        const match = line.match(processedDefRegex);
        if (match) {
            let num = parseInt(match[1], 10);
            // Only add if not already added
            if (!footnoteDefs.find(d => d.num === num)) {
               footnoteDefs.push({num, lineIdx: idx, alreadyProcessed: true});
            }
        }
    });
    
    if (footnoteDefs.length === 0) return false;

    // Process Raw Definitions
    footnoteDefs.forEach(def => {
        if (def.alreadyProcessed) return;
        const eng = def.num.toString();
        let newDef = def.original.replace(/\[.*?\]/, `<span style="font-weight: bold; color: var(--primary);">[${eng}]</span>`);
        if (!newDef.startsWith('<p')) newDef = '<p>' + newDef;
        if (!newDef.endsWith('</p>')) newDef = newDef + '</p>';
        
        newDef = newDef.replace('</p>', ` <a href="#ref${eng}" title="عودة إلى النص" style="text-decoration: none; font-size: 1.2em;">↩</a></p>`);
        newDef = newDef.replace('<p', `<p id="fn${eng}" style="margin-bottom: 1rem; border-top: 1px solid var(--secondary); padding-top: 1rem;"`);
        
        lines[def.lineIdx] = newDef;
    });
    
    let newContent = lines.join('\n');
    
    // Replace inline markers: they could be [1], [١], \[1\], \[١\]
    footnoteDefs.forEach(def => {
        const eng = def.num.toString();
        const ar = eng.split('').map(ch => Object.keys(arabicToEnglish).find(k => arabicToEnglish[k] === ch)).join('');
        
        // Regex to match \[1\] or \[١\] or [1] or [١] but not if it's already inside an anchor <a href...>
        // We use a replacer function to avoid replacing inside existing <sup> tags.
        
        const engPattern = new RegExp(`\\\\?\\[${eng}\\\\]`, 'g');
        const arPattern = new RegExp(`\\\\?\\[${ar}\\\\]`, 'g');
        
        const replacer = (match, offset, string) => {
            // Check if we are inside a <sup> or <a
            const before = string.substring(0, offset);
            const after = string.substring(offset);
            if (before.match(/<sup[^>]*>.*?$/) || before.match(/<a[^>]*>.*?$/) || before.match(/id="[^"]*$/)) {
                return match; // Don't replace inside tags
            }
            return `<sup><a href="#fn${eng}" id="ref${eng}" class="footnote-link">[${eng}]</a></sup>`;
        };
        
        newContent = newContent.replace(engPattern, replacer);
        newContent = newContent.replace(arPattern, replacer);
    });
    
    // In god-is-the-gospel.md, there are existing ones like <sup id="intro-fnref-1"><a href="#intro-fn-1">[1]</a></sup>
    // This is valid but maybe we want to standardize them.
    
    fs.writeFileSync(filePath, newContent);
    return true;
}

const postsDir = 'content/posts';
const pagesDir = 'content/pages';

fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).forEach(f => {
    processFootnotesInFile(path.join(postsDir, f));
});

fs.readdirSync(pagesDir).filter(f => f.endsWith('.md')).forEach(f => {
    processFootnotesInFile(path.join(pagesDir, f));
});

console.log('Footnotes processed.');
