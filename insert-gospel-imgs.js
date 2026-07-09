const fs = require('fs');
const path = require('path');

const gPosts = [
  "blog-post_0.md", "blog-post_22.md", "blog-post_24.md", "blog-post_27.md", 
  "blog-post_30.md", "blog-post_34.md", "blog-post_6.md", "blog-post_76.md", "blog-post_8.md"
];

let gBook = fs.readFileSync('content/pages/god-is-the-gospel.md', 'utf8');

gPosts.forEach(f => {
   const postC = fs.readFileSync('content/posts/' + f, 'utf8');
   const titleMatch = postC.match(/title:\s*"(.*?)"/);
   const imgs = postC.match(/!\[.*?\]\((.*?)\)/g);
   if (imgs && imgs.length > 0 && titleMatch) {
      const title = titleMatch[1];
      // Try to find the chapter number from the title
      // e.g. "الفصل الثالث - ترجمة كتاب \"الله هو الإنجيل\"" -> "الثالث"
      const numMatch = title.match(/الفصل (الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|الحادي عشر)/);
      if (numMatch) {
         const chapterNames = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر", "الحادي عشر"];
         const chapterTashkeel = ["الْفَصْلُ الأَوَّلُ", "الْفَصْلُ الثَّانِي", "الْفَصْلُ الثَّالِثُ", "الْفَصْلُ الرَّابِعُ", "الْفَصْلُ الْخَامِسُ", "الْفَصْلُ السَّادِسُ", "الْفَصْلُ السَّابِعُ", "الْفَصْلُ الثَّامِنُ", "الْفَصْلُ التَّاسِعُ", "الْفَصْلُ الْعَاشِرُ", "الْفَصْلُ الْحَادِي عَشَرَ"];
         const idx = chapterNames.indexOf(numMatch[1]);
         if (idx !== -1) {
             const t = chapterTashkeel[idx];
             // Find where this chapter starts in the book
             const chRegex = new RegExp(`(<h2>${t}</h2>\\s*<div[^>]*>\\s*<h3[^>]*>.*?</h3>)`);
             const chRegex2 = new RegExp(`(<h2>${t}</h2>)`);
             
             if (gBook.match(chRegex)) {
                 gBook = gBook.replace(chRegex, `$1\n\n<div style="text-align: center; margin: 2rem 0;">${imgs[0]}</div>\n\n`);
             } else if (gBook.match(chRegex2)) {
                 gBook = gBook.replace(chRegex2, `$1\n\n<div style="text-align: center; margin: 2rem 0;">${imgs[0]}</div>\n\n`);
             }
         }
      }
   }
});

fs.writeFileSync('content/pages/god-is-the-gospel.md', gBook);
console.log('Inserted infographics into god-is-the-gospel.md');
