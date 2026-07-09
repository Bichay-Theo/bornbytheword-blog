const fs = require('fs');

const files = ['content/pages/god-is-the-gospel.md', 'content/pages/seeing-and-savoring-jesus.md'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Remove the old unstyled TOC link
  content = content.replace(/<p style=\"text-align: center; margin: 3rem 0; font-weight: bold;\"><a href=\"#toc\">عودة إلى الفهرس ⬆️<\/a><\/p>\r?\n?/g, '');
  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
});
