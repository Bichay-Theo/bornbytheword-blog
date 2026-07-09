const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'content/posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

let fixedCount = 0;

for (const file of files) {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We are looking for lines ending with </a>.jpg) which have the broken Blogger image structure.
  // Example broken href: unnamed%20\(45\"><img
  // Example broken end: /></a>.jpg)
  
  if (content.includes('</a>.jpg)')) {
    // We use a regex to fix this specific blogger export issue.
    // It captures:
    // 1: The href prefix up to %20
    // 2: The number inside \( \)
    // 3: The rest of the img tag and a tag
    const newContent = content.replace(
      /href="([^"]+?)%20\\\(([0-9]+)\\\)"><img src="([^"]+?)%20\\\(([0-9]+)\\\)\.jpg"(.*?)<\/a>\.jpg\)/g,
      (match, p1, p2, p3, p4, p5) => {
        // Fix the href to include .jpg and use normal parenthesis
        const fixedHref = `href="${p1}%20(${p2}).jpg"`;
        // Fix the img src to use normal parenthesis
        const fixedImg = `<img src="${p3}%20(${p4}).jpg"`;
        return `${fixedHref}>${fixedImg}${p5}</a>`;
      }
    );

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Fixed image links in ${file}`);
      fixedCount++;
    }
  }
}

console.log(`Finished fixing ${fixedCount} files.`);
