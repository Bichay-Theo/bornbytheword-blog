const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Boaz\\.gemini\\antigravity\\brain';
const outputFilePath = path.join('C:\\Users\\Boaz\\.gemini\\antigravity\\scratch\\bornbytheword-blog', 'Old_Conversations_Archive.md');

async function processTranscripts() {
    let markdown = '# أرشيف المحادثات السابقة (Antigravity)\n\n';
    markdown += 'هذا الملف يحتوي على جميع محادثاتك السابقة المستخرجة من النسخة القديمة للتطبيق.\n\n';

    const folders = fs.readdirSync(brainDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (let folder of folders) {
        const transcriptPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
        
        if (fs.existsSync(transcriptPath)) {
            markdown += `---\n\n## محادثة: ${folder.substring(0, 8)}\n\n`;
            
            const fileStream = fs.createReadStream(transcriptPath);
            const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

            for await (const line of rl) {
                try {
                    const data = JSON.parse(line);
                    if (data.type === 'USER_INPUT' && data.content) {
                        markdown += `**Boaz:**\n${data.content.trim()}\n\n`;
                    } else if (data.type === 'PLANNER_RESPONSE' && data.content) {
                        markdown += `**Antigravity:**\n${data.content.trim()}\n\n`;
                    }
                } catch (e) {
                    // ignore parse errors
                }
            }
        }
    }

    fs.writeFileSync(outputFilePath, markdown, 'utf8');
    console.log('Archive generated at:', outputFilePath);
}

processTranscripts();
