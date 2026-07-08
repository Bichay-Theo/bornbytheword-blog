const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
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
  
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  let contentNode = document.getElementById('content') || document.querySelector('.content') || document.querySelector('main') || document.body;
  
  // Remove sidebar and toggle button if inside body
  const sidebar = document.getElementById('sidebar');
  if (sidebar && contentNode.contains(sidebar)) {
    sidebar.remove();
  }
  const toggleBtn = document.getElementById('menu-toggle');
  if (toggleBtn && contentNode.contains(toggleBtn)) {
    toggleBtn.remove();
  }
  
  const scripts = contentNode.querySelectorAll('script');
  scripts.forEach(s => s.remove());
  
  const markdown = turndownService.turndown(contentNode.innerHTML);
  
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
