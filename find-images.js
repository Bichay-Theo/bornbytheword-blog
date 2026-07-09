const fs = require('fs');

const files = fs.readdirSync('content/posts').filter(f => f.endsWith('.md'));

// We want to find images for 'الله هو الإنجيل' (God is the Gospel) and 'رؤية يسوع' (Seeing Jesus).
// But we need to know WHICH chapter they belong to!

const getPostImages = (keyword) => {
  let images = [];
  files.forEach(f => {
    const text = fs.readFileSync('content/posts/' + f, 'utf8');
    if (text.includes(keyword)) {
       const imgsHTML = text.match(/<img[^>]+src="([^"]+)"[^>]*>/g) || [];
       const imgsMD = text.match(/!\[.*?\]\((.*?)\)/g) || [];
       images.push({ file: f, title: (text.match(/title:\s*"(.*?)"/) || [])[1], count: imgsHTML.length + imgsMD.length, imgs: [...imgsHTML, ...imgsMD] });
    }
  });
  return images;
};

console.log('God is the Gospel:', JSON.stringify(getPostImages('الله هو الإنجيل'), null, 2));
console.log('Seeing Jesus:', JSON.stringify(getPostImages('رؤية يسوع'), null, 2));
