const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Boaz/.gemini/antigravity/scratch/bornbytheword-blog/content/posts';
const labelsToDelete = [
    "تفسير كتابي",
    "مقالات شاملة",
    "تأملات لاهوتية",
    "جون بايبر",
    "سلسلة مقالات",
    "الإنسان العتيق",
    "الذكاء الاصطناعي",
    "تفسير",
    "اللاهوت المصلح"
];

const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

let modifiedCount = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let originalLabelsMatch = content.match(/labels:\s*\[(.*?)\]/);
    if (!originalLabelsMatch) return;
    
    let newContent = content.replace(/labels:\s*\[(.*?)\]/g, (match, p1) => {
        let labels = p1.split(',').map(l => l.trim().replace(/^"|"$/g, ''));
        
        // Filter OUT any label that is in the delete list
        labels = labels.filter(l => !labelsToDelete.includes(l) && l !== "");
        
        const formattedLabels = labels.map(l => `"${l}"`).join(', ');
        return `labels: [${formattedLabels}]`;
    });
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        modifiedCount++;
    }
});

console.log(`Removed unwanted labels from ${modifiedCount} files.`);
