const fs = require('fs');
const files = ['content/pages/god-is-the-gospel.md', 'content/pages/seeing-and-savoring-jesus.md', 'content/pages/come-lord-jesus.md'];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  
  // Find the first "عودة إلى الفهرس" button
  // the buttons usually look like: <p style="text-align: center;"><a href="#toc">عودة إلى الفهرس ⬆️</a></p>
  // or <p style="text-align: center; margin-top: 30px;"><a href="#toc" style="...">عودة إلى الفهرس ⬆️</a></p>
  
  const searchStr = '<p style="text-align: center;';
  const firstIdx = c.indexOf(searchStr);
  if (firstIdx !== -1) {
     const endP = c.indexOf('</p>', firstIdx);
     const theBtn = c.substring(firstIdx, endP + 4);
     if (theBtn.includes('عودة إلى الفهرس')) {
         // This is a button! Let's just remove the first one exactly.
         c = c.substring(0, firstIdx) + c.substring(endP + 4);
         fs.writeFileSync(f, c);
         console.log('Removed first button from', f);
     }
  }
});
