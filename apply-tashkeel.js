const fs = require('fs');
const path = require('path');

// 1. Read the mapped dictionary
let map = {};
try {
  map = JSON.parse(fs.readFileSync('headers-map.json', 'utf8'));
} catch (e) {
  console.error("يرجى التأكد من إنشاء ملف headers-map.json ووضع العناوين المشكلة فيه.");
  process.exit(1);
}

// 2. Function to process a directory
function processDirectory(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  files.forEach(f => {
    const filePath = path.join(dir, f);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Replace based on map
    for (let original in map) {
       const diacritized = map[original];
       if (original && diacritized && original !== diacritized) {
          // Replace literal occurrences in headers
          // We use regex to match exactly the header to avoid replacing within normal text incorrectly
          const regex = new RegExp(`^(#{1,6}\\s+)${escapeRegExp(original)}$`, 'gm');
          if (regex.test(content)) {
             content = content.replace(regex, `$1${diacritized}`);
             changed = true;
          }
       }
    }

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`تم تشكيل العناوين في: ${f}`);
    }
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
}

processDirectory('content/posts');
processDirectory('content/pages');

console.log("اكتملت عملية تحديث العناوين بنجاح!");
