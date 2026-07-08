const fs = require('fs');

const files = ['content/pages/god-is-the-gospel.md', 'content/pages/seeing-and-savoring-jesus.md'];

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');

  // 1. Remove translator link
  c = c.replace(/<p>—-------------------------<\/p>\s*<p><strong>ترجمة الخاتمة.*?<\/p>/s, '');

  // 2. Process chapters for footnotes
  const parts = c.split('<div id="');
  
  for (let i = 1; i < parts.length; i++) {
    // parts[i] starts with `ch1">...`
    const quoteIdx = parts[i].indexOf('">');
    if (quoteIdx === -1) continue;
    
    const chapterId = parts[i].substring(0, quoteIdx);
    
    const fnSplit = parts[i].split('<div class="footnote-section">');
    if (fnSplit.length === 2) {
      let mainContent = fnSplit[0];
      let fnContent = fnSplit[1];
      
      // Find all footnote numbers in the footnote section
      // The footnotes are like: `<h4>...</h4><p><strong>[1]</strong> text... <strong>[2]</strong> text...</p></div>`
      // Or `[1]` without strong.
      const fnRegex = /(?:<strong>)?\[(\d+)\](?:<\/strong>)?/g;
      
      // We replace the footnote markers in the footnote section
      fnContent = fnContent.replace(fnRegex, (match, num) => {
        // If it's the first footnote, we just replace the start
        return `</p><p id="${chapterId}-fn-${num}" style="margin-bottom: 1rem; border-top: 1px solid var(--secondary); padding-top: 1rem;"><a href="#${chapterId}-fnref-${num}" style="font-weight: bold; color: var(--primary); text-decoration: none;">[${num}] ↩</a> `;
      });
      
      // Clean up empty `<p></p>` that might result from the above
      fnContent = fnContent.replace(/<h4>الْهَوَامِشُ وَالْمَرَاجِعُ<\/h4>\s*<p><\/p>/, '<h4>الْهَوَامِشُ وَالْمَرَاجِعُ</h4>');
      
      // Extract all the numbers found
      const nums = [...fnSplit[1].matchAll(fnRegex)].map(m => m[1]);
      
      // Replace the footnote references in the main text
      nums.forEach(num => {
        // Find `[num]` in mainContent and replace. Note: need to avoid replacing `[num]` if it's part of a URL, but usually it's just plain text `[num]`.
        // A simple string replace or a regex.
        // We can match `[num]` not preceded/followed by alpha characters.
        const refRegex = new RegExp(`\\[${num}\\]`, 'g');
        mainContent = mainContent.replace(refRegex, `<sup id="${chapterId}-fnref-${num}"><a href="#${chapterId}-fn-${num}">[${num}]</a></sup>`);
      });
      
      parts[i] = mainContent + '<div class="footnote-section">' + fnContent;
    }
  }
  
  c = parts.join('<div id="');
  fs.writeFileSync(file, c);
  console.log('Processed', file);
});
