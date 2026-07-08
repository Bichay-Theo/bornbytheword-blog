const fs = require('fs');
const files = ['content/pages/god-is-the-gospel.md', 'content/pages/seeing-and-savoring-jesus.md'];
const backLink = '<p style="text-align: center; margin: 3rem 0; font-weight: bold;"><a href="#">عودة إلى الفهرس ⬆️</a></p>';

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  
  // Replace <hr> before footnote-section with the backLink + footnote-section
  c = c.replace(/<hr><div class="footnote-section">/g, `${backLink}\n<div class="footnote-section">`);
  
  // For chapters that end without a footnote section, we can insert the link before </div>\n<div id="
  // BUT we have to be careful not to double-insert if the chapter already ended with a footnote-section.
  // Because the footnote-section is INSIDE the chapter div, the </div>\n<div id=" comes AFTER the footnote section.
  // So if we just blindly replace </div>\n<div id=", we might add a second backLink.
  // Let's use a regex that negative-lookbehinds the footnote section?
  // Actually, we can just split by '</div>\n<div id="' and check if the segment ends with the backLink.
  
  const segments = c.split('</div>\n<div id="');
  for (let i = 0; i < segments.length - 1; i++) { // don't process the very last segment here
    if (!segments[i].includes('عودة إلى الفهرس')) {
      segments[i] = segments[i] + `\n${backLink}`;
    }
  }
  c = segments.join('</div>\n<div id="');
  
  // Also add it to the very end of the document if it's not there
  if (!c.includes('عودة إلى الفهرس', c.length - 1000)) {
     // replace the last </div>
     const lastDiv = c.lastIndexOf('</div>');
     if (lastDiv !== -1) {
       c = c.substring(0, lastDiv) + `\n${backLink}\n` + c.substring(lastDiv);
     }
  }

  fs.writeFileSync(f, c);
  console.log(f, 'updated');
});
