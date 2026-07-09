const fs = require('fs');
let content = fs.readFileSync('content/pages/come-lord-jesus.md', 'utf8');
// Remove the TOC button before the footnotes heading
content = content.replace(/<p style=\"text-align: center; margin-bottom: 2rem; font-weight: bold;\"><a href=\"#toc\" style=\"text-decoration: none; color: var\(--primary-color\);\">عودة إلى الفهرس ⬆️<\/a><\/p>\r?\n?(<div class=\"footnote-section\">)?<h4(.*?)الْهَوَامِشُ وَالْمَرَاجِعُ(.*?)<\/h4>/g, '$1<h4$2الْهَوَامِشُ وَالْمَرَاجِعُ$3</h4>');

// Also check for the old duplicate unstyled TOC button just in case
content = content.replace(/<p style=\"text-align: center; margin: 3rem 0; font-weight: bold;\"><a href=\"#toc\">عودة إلى الفهرس ⬆️<\/a><\/p>\r?\n?/g, '');

fs.writeFileSync('content/pages/come-lord-jesus.md', content);
console.log('Fixed come-lord-jesus.md');
