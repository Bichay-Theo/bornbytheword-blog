const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');
const turndownService = new TurndownService({ headingStyle: 'atx' });

// Keep tables as HTML (since Markdown tables can be tricky if they are complex in Blogger)
turndownService.keep(['table']);

const BLOG_URL = "https://bornbytheword.blogspot.com";

async function fetchBlogger(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data.feed.entry || [];
}

async function migrate() {
  console.log('Migrating Posts...');
  const posts = await fetchBlogger(`${BLOG_URL}/feeds/posts/default?alt=json`);
  const postsDir = path.join(__dirname, '../content/posts');
  fs.mkdirSync(postsDir, { recursive: true });

  for (const entry of posts) {
    const title = entry.title.$t.replace(/"/g, '\\"');
    const contentHtml = entry.content.$t;
    const published = entry.published.$t;
    const updated = entry.updated.$t;
    
    const altLink = entry.link.find(l => l.rel === 'alternate');
    const slugMatch = altLink ? altLink.href.match(/\/([^\/]+)\.html$/) : null;
    const slug = slugMatch ? slugMatch[1] : `post-${entry.id.$t.split('-').pop()}`;

    const labels = entry.category ? entry.category.map(c => c.term) : [];
    const labelsStr = JSON.stringify(labels);

    const markdownBody = turndownService.turndown(contentHtml);

    const fileContent = `---
title: "${title}"
date: "${published}"
updated: "${updated}"
slug: "${slug}"
labels: ${labelsStr}
---

${markdownBody}
`;
    fs.writeFileSync(path.join(postsDir, `${slug}.md`), fileContent);
    console.log(`Saved post: ${slug}.md`);
  }

  console.log('Migrating Pages (Books)...');
  const pages = await fetchBlogger(`${BLOG_URL}/feeds/pages/default?alt=json`);
  const pagesDir = path.join(__dirname, '../content/pages');
  fs.mkdirSync(pagesDir, { recursive: true });

  for (const entry of pages) {
    const title = entry.title.$t.replace(/"/g, '\\"');
    const contentHtml = entry.content.$t;
    
    const altLink = entry.link.find(l => l.rel === 'alternate');
    const slugMatch = altLink ? altLink.href.match(/\/p\/([^\/]+)\.html$/) : null;
    const slug = slugMatch ? slugMatch[1] : `page-${entry.id.$t.split('-').pop()}`;

    const markdownBody = turndownService.turndown(contentHtml);

    const fileContent = `---
title: "${title}"
slug: "${slug}"
---

${markdownBody}
`;
    fs.writeFileSync(path.join(pagesDir, `${slug}.md`), fileContent);
    console.log(`Saved page: ${slug}.md`);
  }

  console.log('Migration Complete!');
}

migrate();
