const fs = require('fs');

let c = fs.readFileSync('content/pages/come-lord-jesus.md', 'utf8');

const tashkeelChapters = [
  "الْفَصْلُ الأَوَّلُ", "الْفَصْلُ الثَّانِي", "الْفَصْلُ الثَّالِثُ", "الْفَصْلُ الرَّابِعُ",
  "الْفَصْلُ الْخَامِسُ", "الْفَصْلُ السَّادِسُ", "الْفَصْلُ السَّابِعُ", "الْفَصْلُ الثَّامِنُ",
  "الْفَصْلُ التَّاسِعُ", "الْفَصْلُ الْعَاشِرُ", "الْفَصْلُ الْحَادِي عَشَرَ", "الْفَصْلُ الثَّانِي عَشَرَ",
  "الْفَصْلُ الثَّالِثَ عَشَرَ", "الْفَصْلُ الرَّابِعَ عَشَرَ", "الْفَصْلُ الْخَامِسَ عَشَرَ", "الْفَصْلُ السَّادِسَ عَشَرَ",
  "الْفَصْلُ السَّابِعَ عَشَرَ", "الْفَصْلُ الثَّامِنَ عَشَرَ", "الْفَصْلُ التَّاسِعَ عَشَرَ", "الْفَصْلُ الْعِشْرُونَ",
  "الْفَصْلُ الْحَادِي وَالْعِشْرُونَ", "الْفَصْلُ الثَّانِي وَالْعِشْرُونَ"
];

let toc = '<div id="toc" style="background: var(--card-bg); padding: 2rem; border-radius: 8px; border: 1px solid var(--secondary); margin-bottom: 3rem;">\n';
toc += '<h2 style="color: var(--primary-color); margin-bottom: 1.5rem; text-align: center;">الفهرس</h2>\n';
toc += '<ul style="list-style: none; padding: 0;">\n';

for (let i = 1; i <= 22; i++) {
  toc += `  <li style="margin-bottom: 0.8rem;"><a href="#ch${i}" style="font-weight: bold; font-size: 1.1rem; text-decoration: none; color: var(--text-color);">${tashkeelChapters[i-1]}</a></li>\n`;
}
toc += '</ul>\n</div>\n';

if (!c.includes('<div id="toc"')) {
  // Insert TOC right after the introductory div
  const insertIndex = c.indexOf('</div></div>\n') + '</div></div>\n'.length;
  c = c.slice(0, insertIndex) + '\n' + toc + c.slice(insertIndex);
  fs.writeFileSync('content/pages/come-lord-jesus.md', c);
  console.log('TOC added to come-lord-jesus.md');
} else {
  console.log('TOC already exists in come-lord-jesus.md');
}
