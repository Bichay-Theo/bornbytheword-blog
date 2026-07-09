const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../content/pages');

const conclusionImg = '<img alt="" border="0" data-original-height="1536" data-original-width="2752" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9cXZe4qCauIEgPRGR39NIjNU9Gue8VFL0pNPz8voluMxVhyoWyEByCmu1y37Sak-avtCegSrAQAhjuhmxShPnFtFo7YTSGfy0OvGYkUd4q3HUOsTBPxGFGD1o9tgZEo51mQH0r4JQF7wlc9kyk8u47VyBhyphenhyphen64CrNqrwCFMPC7KMGG5VQbH0brfFkcYoQ/s0/unnamed%20%2845%29.png" />';

function processConclusion() {
    const filePath = path.join(baseDir, 'god-is-the-gospel.md');
    let content = fs.readFileSync(filePath, 'utf8');

    const regex = new RegExp(`(<div id="conc">[\\s\\S]*?<h3[^>]*>.*?</h3>)`);
    content = content.replace(regex, (match, header) => {
        console.log('Inserted image for conc');
        return `${header}<div style="text-align: center; margin: 2rem 0;">${conclusionImg}</div>`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated conclusion in god-is-the-gospel.md');
}

processConclusion();
