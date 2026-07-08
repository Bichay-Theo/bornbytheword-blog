const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');

const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced'
});

turndownService.keep(['sup', 'sub', 'span', 'div', 'button', 'a']);

async function migrateBook(htmlPath, slug, title) {
  const fullPath = path.resolve(__dirname, htmlPath);
  console.log('Migrating', fullPath);
  const html = fs.readFileSync(fullPath, 'utf8');
  
  const match = html.match(/const sections = (\{[\s\S]*?\});/);
  if (!match) {
    console.error('No sections found in', htmlPath);
    return;
  }
  
  const sectionsStr = match[1];
  const getSections = new Function('return ' + sectionsStr + ';');
  const sections = getSections();
  
  // Concatenate all sections HTML
  let allHtml = '';
  for (const key of Object.keys(sections)) {
    allHtml += `\n<div id="${key}">\n${sections[key]}\n</div>\n`;
  }
  
  const markdown = turndownService.turndown(allHtml);
  
  const frontmatter = `---
title: "${title}"
slug: "${slug}"
date: "${new Date().toISOString()}"
---

${markdown}
`;

  const outPath = path.join(__dirname, 'content/pages', `${slug}.md`);
  fs.writeFileSync(outPath, frontmatter, 'utf8');
  console.log(`Saved to ${outPath}`);
}

migrateBook('../God_Is_The_Gospel/index.html', 'god-is-the-gospel', 'الله هو الإنجيل');
migrateBook('../Seeing_and_Savoring_Jesus/index.html', 'seeing-and-savoring-jesus', 'رؤية وتذوق يسوع المسيح');
