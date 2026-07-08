const fs = require('fs');

function restoreReturnLinks(file) {
  let c = fs.readFileSync(file, 'utf8');
  
  // Clean first just in case
  c = c.replace(/<p style="text-align: center; margin: 3rem 0; font-weight: bold;"><a href="#">عودة إلى الفهرس ⬆️<\/a><\/p>\s*/g, '');
  
  const returnLink = '\n<p style="text-align: center; margin: 3rem 0; font-weight: bold;"><a href="#">عودة إلى الفهرس ⬆️</a></p>\n';
  
  // We want to add the returnLink right before the chapter dividers,
  // EXCEPT the first one (which is on the title page).
  const parts = c.split('<div class="chapter-divider">');
  if (parts.length > 2) {
    for (let i = 2; i < parts.length; i++) {
      parts[i-1] = parts[i-1].trimEnd() + returnLink;
    }
  }
  
  // Also add one at the very end of the main content before footnotes or footer
  // For god-is-the-gospel, it's before <div class="footnote-section"> or <div id="dg">
  if (c.includes('<div class="footnote-section">')) {
    // We already added it before chapter dividers, but the last chapter might not have a divider after it!
    // Wait, let's check if the last chapter has a divider.
  }
  
  c = parts.join('<div class="chapter-divider">');
  
  // If the last chapter didn't have a divider, let's add the link right before footnote-section or dg
  if (c.includes('<div class="footnote-section">')) {
     if (!c.includes(returnLink.trim() + '\n<div class="footnote-section">')) {
        c = c.replace('<div class="footnote-section">', returnLink + '<div class="footnote-section">');
     }
  } else if (c.includes('<div id="dg">')) {
     if (!c.includes(returnLink.trim() + '\n<div id="dg">')) {
        c = c.replace('<div id="dg">', returnLink + '<div id="dg">');
     }
  }
  
  fs.writeFileSync(file, c);
  console.log('Restored in', file);
}

restoreReturnLinks('content/pages/god-is-the-gospel.md');
restoreReturnLinks('content/pages/seeing-and-savoring-jesus.md');
