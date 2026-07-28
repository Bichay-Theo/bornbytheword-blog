const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Boaz/.gemini/antigravity/scratch/bornbytheword-blog/content/posts';
const allowedLabels = [
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
        
        // Map تفسير كتابي to تفسير
        labels = labels.map(l => l === "تفسير كتابي" ? "تفسير" : l);
        
        // Filter out any label not in allowedLabels
        labels = labels.filter(l => allowedLabels.includes(l));
        
        // Ensure unique
        labels = [...new Set(labels)];
        
        const formattedLabels = labels.map(l => `"${l}"`).join(', ');
        return `labels: [${formattedLabels}]`;
    });
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        modifiedCount++;
    }
});

console.log(`Updated labels in ${modifiedCount} files.`);
