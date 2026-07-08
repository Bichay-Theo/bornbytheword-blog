const fs = require('fs');

function makeInteractiveFootnotes(file) {
  let c = fs.readFileSync(file, 'utf8');
  
  // Create a regex to match footnote definitions in the footnote-section
  // Example: <p ...><span style="...">[١]</span> text...</p>
  const footnoteDefRegex = /<p[^>]*><span[^>]*>\[(١|٢|٣|٤|٥|٦|٧|٨|٩|٠|1|2|3|4|5|6|7|8|9|0)+\]<\/span>([\s\S]*?)<\/p>/g;
  
  // We need to carefully replace the footnotes
  let counter = 1;
  const arabicToEnglish = {'١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9','٠':'0'};
  
  // First, find all footnote defs
  const matches = [...c.matchAll(footnoteDefRegex)];
  
  if (matches.length > 0) {
     console.log(`Found ${matches.length} footnotes in ${file}`);
     
     // Replace definitions with interactive ones
     c = c.replace(footnoteDefRegex, (match, numRaw, text) => {
        let numStr = numRaw.split('').map(ch => arabicToEnglish[ch] || ch).join('');
        let num = parseInt(numStr, 10);
        return `<p id="fn${num}" style="margin-bottom: 1rem; border-top: 1px solid var(--secondary); padding-top: 1rem;"><span style="font-weight: bold; color: var(--primary);">[${num}]</span>${text} <a href="#ref${num}" title="عودة إلى النص" style="text-decoration: none; font-size: 1.2em;">↩</a></p>`;
     });
     
     // Now replace in-text references
     // In-text references are usually just [١] or [1] (or [ ١ ] etc.)
     // We should only replace them OUTSIDE the footnote-section.
     let mainContent = c.substring(0, c.indexOf('<div class="footnote-section">'));
     let footerContent = c.substring(c.indexOf('<div class="footnote-section">'));
     
     if (mainContent) {
       for (let i = 1; i <= 30; i++) {
         let eng = i.toString();
         let ar = eng.split('').map(ch => Object.keys(arabicToEnglish).find(k => arabicToEnglish[k] === ch)).join('');
         
         // Regex to replace [1] or [١] that are NOT already inside an <a> tag.
         // A simple string replace is safer if we do it carefully, but regex is better.
         let refRegexEng = new RegExp(`\\[${eng}\\]`, 'g');
         let refRegexAr = new RegExp(`\\[${ar}\\]`, 'g');
         
         mainContent = mainContent.replace(refRegexEng, `<sup><a href="#fn${eng}" id="ref${eng}" class="footnote-link">[${eng}]</a></sup>`);
         mainContent = mainContent.replace(refRegexAr, `<sup><a href="#fn${eng}" id="ref${eng}" class="footnote-link">[${eng}]</a></sup>`);
       }
       c = mainContent + footerContent;
     }
     
     fs.writeFileSync(file, c);
  }
}

makeInteractiveFootnotes('content/pages/god-is-the-gospel.md');
makeInteractiveFootnotes('content/pages/seeing-and-savoring-jesus.md');
