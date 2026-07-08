const fs = require('fs');

const files = [
  'complete-translation-come-lord-jesus-chapter-1.md',
  'end-times-deception-patience-and-joy.md',
  'end-time-prayer-and-mission-come-lord-jesus.md',
  'go-to-work-go-to-church-in-the-end-times.md',
  'blameless-at-coming-of-christ.md',
  'experiencing-glory-of-christ-joyful-amazement_01649428013.md',
  'glory-of-christ-primary-reality-second-coming.md',
  'grace-at-revelation-of-christ.md',
  'how-book-awakens-love-christ-appearing.md',
  'is-there-any-moment-rapture-before-second-coming.md',
  'jesus-and-paul-shared-vision-of-second-coming.md',
  'jesus-rescues-from-wrath-judgment.md',
  'joy-of-personal-fellowship-with-the-sovereign-servant.md',
  'joy-of-receiving-varied-rewards.md',
  'judgment-according-to-works-at-christ-coming.md',
  'living-between-christ-advents-vigilance-and-love.md',
  'living-holy-and-gentle-awaiting-christ-return.md',
  'perfected-in-mind-heart-body.md',
  'timing-of-christ-second-coming-prophetic-perspective.md',
  'vengeance-and-rest-at-christ-coming.md',
  'what-must-happen-before-christ-second-coming.md',
  'what-new-testament-means-by-jesus-coming-soon.md'
];

// Re-sort them by date because the array above is just the raw matches in any order.
let items = files.map(f => {
  const c = fs.readFileSync('content/posts/' + f, 'utf8');
  const titleMatch = c.match(/title:\s*"(.*?)"/);
  const dateMatch = c.match(/date:\s*"(.*?)"/);
  return {
    file: f,
    title: titleMatch ? titleMatch[1] : '',
    date: dateMatch ? new Date(dateMatch[1]) : new Date(0),
    content: c
  };
});
items.sort((a, b) => a.date - b.date);

const tashkeelChapters = [
  "الْفَصْلُ الأَوَّلُ", "الْفَصْلُ الثَّانِي", "الْفَصْلُ الثَّالِثُ", "الْفَصْلُ الرَّابِعُ",
  "الْفَصْلُ الْخَامِسُ", "الْفَصْلُ السَّادِسُ", "الْفَصْلُ السَّابِعُ", "الْفَصْلُ الثَّامِنُ",
  "الْفَصْلُ التَّاسِعُ", "الْفَصْلُ الْعَاشِرُ", "الْفَصْلُ الْحَادِي عَشَرَ", "الْفَصْلُ الثَّانِي عَشَرَ",
  "الْفَصْلُ الثَّالِثَ عَشَرَ", "الْفَصْلُ الرَّابِعَ عَشَرَ", "الْفَصْلُ الْخَامِسَ عَشَرَ", "الْفَصْلُ السَّادِسَ عَشَرَ",
  "الْفَصْلُ السَّابِعَ عَشَرَ", "الْفَصْلُ الثَّامِنَ عَشَرَ", "الْفَصْلُ التَّاسِعَ عَشَرَ", "الْفَصْلُ الْعِشْرُونَ",
  "الْفَصْلُ الْحَادِي وَالْعِشْرُونَ", "الْفَصْلُ الثَّانِي وَالْعِشْرُونَ"
];

let fullBook = `---
title: "تعال أيها الرب يسوع"
date: "2026-07-08T00:00:00.000Z"
description: "تعال أيها الرب يسوع - بقلم القس جون بايبر"
tags: ["كتب", "جون بايبر", "تعال أيها الرب يسوع"]
coverImage: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070&auto=format&fit=crop"
---

<div class="chapter-divider"><span>✥</span></div>
<div id="intro"><div style="text-align: center; margin: 4rem 0;"><h1 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 2.5em;">تعال أيها الرب يسوع</h1><p style="font-size: 1.2em; color: var(--secondary-color); font-weight: bold;">بقلم<br><span style="font-size: 1.5em; color: white;">القس جون بايبر</span><br><span style="font-size: 0.8em; font-family: monospace;">Pastor John Piper</span></p></div></div>
`;

let allFootnotes = [];
let footnoteCounter = 1;

items.forEach((item, index) => {
  let content = item.content;
  // strip frontmatter
  content = content.replace(/---[\s\S]*?---/, '').trim();
  
  // extract footnotes if any
  const footnoteDefRegex = /<p[^>]*><span[^>]*>\[(١|٢|٣|٤|٥|٦|٧|٨|٩|٠|1|2|3|4|5|6|7|8|9|0)+\]<\/span>([\s\S]*?)<\/p>/g;
  let matches = [...content.matchAll(footnoteDefRegex)];
  
  // Create a mapping from old footnote number to new global book footnote number
  let fnMapping = {};
  matches.forEach(m => {
    let oldNum = parseInt(m[1].replace(/[١٢٣٤٥٦٧٨٩٠]/g, d => '١٢٣٤٥٦٧٨٩٠'.indexOf(d)+1), 10);
    fnMapping[oldNum] = footnoteCounter++;
    allFootnotes.push({
       newNum: fnMapping[oldNum],
       text: m[2].replace(/<a href="#ref[^>]*>↩<\/a>/g, '').trim() // strip old return links if present
    });
  });
  
  // Remove footnote definitions from the chapter body
  content = content.replace(footnoteDefRegex, '');
  content = content.replace(/<div class="footnote-section">[\s\S]*?<\/div>/, '');
  content = content.replace(/#### الهوامش والمراجع|#### الْهَوَامِشُ وَالْمَرَاجِعُ/g, '');
  
  // Update in-text footnote references
  for (let oldNum in fnMapping) {
     let newNum = fnMapping[oldNum];
     // handle Arabic and English references
     let eng = oldNum.toString();
     let ar = eng.split('').map(d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]).join('');
     
     content = content.replace(new RegExp(`\\[${eng}\\]`, 'g'), `<sup><a href="#fn${newNum}" id="ref${newNum}" class="footnote-link">[${newNum}]</a></sup>`);
     content = content.replace(new RegExp(`\\[${ar}\\]`, 'g'), `<sup><a href="#fn${newNum}" id="ref${newNum}" class="footnote-link">[${newNum}]</a></sup>`);
     
     // Also if they were already wrapped in sup/a
     content = content.replace(new RegExp(`<sup><a href="#fn${oldNum}" id="ref${oldNum}" class="footnote-link">\\[${oldNum}\\]</a></sup>`, 'g'), `<sup><a href="#fn${newNum}" id="ref${newNum}" class="footnote-link">[${newNum}]</a></sup>`);
  }
  
  // Add Return Link
  content = content.replace(/<p style="text-align: center; margin: 3rem 0; font-weight: bold;"><a href="\/">العودة للرئيسية 🏠<\/a><\/p>/g, '');
  
  // Build chapter HTML
  let chNum = index + 1;
  let chTitle = tashkeelChapters[index];
  
  // Some posts have title inside them like ## الفصل الاول. We should remove it so we don't duplicate.
  content = content.replace(/^#+ .*$/m, ''); // basic heuristic to remove first title
  
  fullBook += `\n<div class="chapter-divider"><span>✥</span></div>\n`;
  fullBook += `<div id="ch${chNum}">\n`;
  fullBook += `<h2 style="text-align: center; color: var(--primary-color); margin: 3rem 0;">${chTitle}</h2>\n\n`;
  fullBook += content.trim() + `\n`;
  
  fullBook += `\n<p style="text-align: center; margin: 3rem 0; font-weight: bold;"><a href="#">عودة إلى الفهرس ⬆️</a></p>\n`;
  fullBook += `</div>\n`;
});

// Append footnote section if any
if (allFootnotes.length > 0) {
   fullBook += `\n<div class="chapter-divider"><span>✥</span></div>\n`;
   fullBook += `<div class="footnote-section"><h4>الْهَوَامِشُ وَالْمَرَاجِعُ</h4>\n`;
   allFootnotes.forEach(f => {
      fullBook += `<p id="fn${f.newNum}" style="margin-bottom: 1rem; border-top: 1px solid var(--secondary); padding-top: 1rem;"><span style="font-weight: bold; color: var(--primary);">[${f.newNum}]</span>${f.text} <a href="#ref${f.newNum}" title="عودة إلى النص" style="text-decoration: none; font-size: 1.2em;">↩</a></p>\n`;
   });
   fullBook += `</div>\n`;
}

fs.writeFileSync('content/pages/come-lord-jesus.md', fullBook);
console.log('Book compiled successfully with ' + allFootnotes.length + ' footnotes.');
