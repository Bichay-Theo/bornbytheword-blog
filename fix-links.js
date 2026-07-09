const fs = require('fs');

function fixLinks(file) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/href="#"/g, 'href="#toc"');
  fs.writeFileSync(file, c);
}

fixLinks('content/pages/come-lord-jesus.md');
fixLinks('content/pages/god-is-the-gospel.md');
fixLinks('content/pages/seeing-and-savoring-jesus.md');
