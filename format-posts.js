const fs = require('fs');
const path = require('path');

const postsDir = 'content/posts';
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

const returnLink = '\n<p style="text-align: center; margin: 3rem 0; font-weight: bold;"><a href="/">العودة للرئيسية 🏠</a></p>\n';
const arabicToEnglish = {'١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9','٠':'0'};

let updatedCount = 0;

files.forEach(file => {
  const fullPath = path.join(postsDir, file);
  let c = fs.readFileSync(fullPath, 'utf8');
  let original = c;
  
  // 1. Add return link if not present
  // We want to add it at the end of the post, but before any footnote section if it exists
  // If there's no footnote section, just add it at the very end
  
  // Clean up any existing return links to prevent duplicates
  c = c.replace(/<p style="text-align: center; margin: 3rem 0; font-weight: bold;"><a href="\/">العودة للرئيسية 🏠<\/a><\/p>\s*/g, '');
  
  if (c.includes('<div class="footnote-section">')) {
     c = c.replace('<div class="footnote-section">', returnLink + '<div class="footnote-section">');
  } else if (c.includes('#### الهوامش والمراجع') || c.includes('#### الْهَوَامِشُ وَالْمَرَاجِعُ')) {
     c = c.replace(/#### (الهوامش والمراجع|الْهَوَامِشُ وَالْمَرَاجِعُ)/, returnLink + '#### $1');
  } else {
     c = c.trimEnd() + '\n' + returnLink;
  }
  
  // 2. Format footnotes if they exist
  // Many posts might just have [١] in text and [١] at the bottom without proper HTML.
  // We will leave complex parsing for now unless it strictly matches the footnote-section pattern we know.
  const footnoteDefRegex = /<p[^>]*><span[^>]*>\[([١٢٣٤٥٦٧٨٩٠1234567890]+)\]<\/span>([\s\S]*?)<\/p>/g;
  if (c.match(footnoteDefRegex)) {
     c = c.replace(footnoteDefRegex, (match, numRaw, text) => {
        let numStr = numRaw.split('').map(ch => arabicToEnglish[ch] || ch).join('');
        let num = parseInt(numStr, 10);
        return `<p id="fn${num}" style="margin-bottom: 1rem; border-top: 1px solid var(--secondary); padding-top: 1rem;"><span style="font-weight: bold; color: var(--primary);">[${num}]</span>${text} <a href="#ref${num}" title="عودة إلى النص" style="text-decoration: none; font-size: 1.2em;">↩</a></p>`;
     });
     
     // Replace in-text references
     let splitStr = c.includes('<div class="footnote-section">') ? '<div class="footnote-section">' : '####';
     let mainContent = c.substring(0, c.lastIndexOf(splitStr));
     let footerContent = c.substring(c.lastIndexOf(splitStr));
     
     if (mainContent) {
       for (let i = 1; i <= 30; i++) {
         let eng = i.toString();
         let ar = eng.split('').map(ch => Object.keys(arabicToEnglish).find(k => arabicToEnglish[k] === ch)).join('');
         
         let refRegexEng = new RegExp(`\\[${eng}\\]`, 'g');
         let refRegexAr = new RegExp(`\\[${ar}\\]`, 'g');
         
         mainContent = mainContent.replace(refRegexEng, `<sup><a href="#fn${eng}" id="ref${eng}" class="footnote-link">[${eng}]</a></sup>`);
         mainContent = mainContent.replace(refRegexAr, `<sup><a href="#fn${eng}" id="ref${eng}" class="footnote-link">[${eng}]</a></sup>`);
       }
       c = mainContent + footerContent;
     }
  }

  if (c !== original) {
    fs.writeFileSync(fullPath, c);
    updatedCount++;
  }
});

console.log(`Updated ${updatedCount} posts with return links and formatted footnotes.`);
