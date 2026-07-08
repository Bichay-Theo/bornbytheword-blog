const fs = require('fs');

const file = 'content/pages/seeing-and-savoring-jesus.md';
let c = fs.readFileSync(file, 'utf8');

// 1. Return to index links
// Remove existing ones to prevent duplication
c = c.replace(/<p style="text-align: center; margin: 3rem 0; font-weight: bold;"><a href="#">عودة إلى الفهرس ⬆️<\/a><\/p>\s*/g, '');

const returnLink = '\n<p style="text-align: center; margin: 3rem 0; font-weight: bold;"><a href="#">عودة إلى الفهرس ⬆️</a></p>\n';
c = c.replace(/(<div class="chapter-divider">)/g, returnLink + '$1');

// Append one at the end of the last chapter or before the Desiring God div
c = c.replace('<div id="dg">', returnLink + '<div class="chapter-divider"><span>✥</span></div>\n<div id="dg">');

// 2. Format Footnotes
// Find the footnote section
const fnStart = c.indexOf('<div class="footnote-section">');
if (fnStart !== -1) {
  const fnEnd = c.indexOf('</div>', fnStart);
  let fnContent = c.substring(fnStart + '<div class="footnote-section">'.length, fnEnd);
  
  // It looks like: `١. text<br>٢. text<br>`
  // Split by `<br>`
  const footnotes = fnContent.split('<br>').filter(f => f.trim().length > 0);
  
  let formattedFns = '<h4>الْهَوَامِشُ وَالْمَرَاجِعُ</h4>\n';
  footnotes.forEach(fn => {
    // Extract the Arabic numeral prefix (e.g., "١. ")
    const match = fn.match(/^([١٢٣٤٥٦٧٨٩٠]+)\.\s*(.*)/);
    if (match) {
      formattedFns += `<p style="margin-bottom: 1rem; border-top: 1px solid var(--secondary); padding-top: 1rem;"><span style="font-weight: bold; color: var(--primary);">[${match[1]}]</span> ${match[2]}</p>\n`;
    } else {
      formattedFns += `<p style="margin-bottom: 1rem;">${fn}</p>\n`;
    }
  });
  
  c = c.substring(0, fnStart) + '<div class="footnote-section">' + formattedFns + c.substring(fnEnd);
}

fs.writeFileSync(file, c);
console.log('Processed seeing-and-savoring-jesus.md');
