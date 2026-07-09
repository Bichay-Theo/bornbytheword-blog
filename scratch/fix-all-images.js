const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../content/pages');

// The exact HTML <img> tags found from Blogger
const images = {
  'intro': '<img alt="" border="0" data-original-height="1536" data-original-width="2752" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjo9vJOJkeu_1h0jHJ3warIg48hWVHxSCTYSOl8qXIqlbHRR6KJonzI2q_gVWhB58HRCLJMwVPlt599MucSyNw833_WZtVkEP-2SJnsic4gmuqw5A5m02WijpVO3_X50ZIJ5iGUNr6Mkehp3VbYPQwwGDCYthVT4rJmI_5hZWQ7sR56_JnypKMKYIqPKCA/s0/00.png" />',
  'ch1': '<img alt="" border="0" data-original-height="1536" data-original-width="2752" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSGhsSwtTfTXpF3u1PO5PYizFf5H34oDDj5QrUwRplW6KqwIcpSefnlJBWi7SyPKKtTSCGuHJsy_gMzJ6j6vXJgfJF6jk3zMVU4b67HvBpmoVbCDLPe5eT8XRIWcZvp6IFveGdrZCTF4y7WuYdi9Wd8_WBbO9qaNtWSLtJLwGJOFSPSHIf2EU7HZ45BzM/s0/01.png" />',
  'ch2': '<img alt="" border="0" width="600" data-original-height="1536" data-original-width="2752" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4l036PyI40Iug6HxRKVoE33OqZTiwLdDXGvEMGPho8PMWdY1Cz0HP3P82FmSu8f83KOBhCoi08YdLZ0XwPcg909V7pupMWcp4AAdFVQYBzelYGfL8y-fQ1KmGCUs-cqir-N4wr-vNMJ5sln7OlgsNWehBgTU4WK78SXHrh172SB2kE_vKwTenx-UJXZY/s0/02.png" />',
  'ch4': '<img alt="" border="0" data-original-height="1536" data-original-width="2752" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjbXPiUL6ZWiDLvuawzd-SOV2nlTcv8MQtTE2O_tvKr8rgXPWgTfsQHsI_MGL3tythO58MB-1MwKXx5c097vE4w1iHul9xOitt8ps0W3ViTGSi58PwBpT9gGP_NVoPCqeByaezJS3k_CVfZNvcnKvk2NKqO62IKDAHkPYWgmuiwMHGHMGRA5cHWU_WUbYE/s0/04.png" />',
  'ch7': '<img alt="" border="0" data-original-height="1536" data-original-width="2752" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhDqD5FA7mzbhPntTcPtMlV-NKiOrnM-znp-VlYPMPRuf2a6fAO2kYWWs7kNYMTdArvIsfQhBayUkjAcl8Wao9_P1aubLXxAfR_xs92ucqDaEMQwGMErsR5qJlW12k0Yo923uW5Rbqp5ywEKUtbw4Lc1n7hUQiwUk8ThGmsGtEDGtA991i62dGbDdwvUX4/s0/07.png" />',
  'conclusion': '<img alt="" border="0" data-original-height="1536" data-original-width="2752" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9cXZe4qCauIEgPRGR39NIjNU9Gue8VFL0pNPz8voluMxVhyoWyEByCmu1y37Sak-avtCegSrAQAhjuhmxShPnFtFo7YTSGfy0OvGYkUd4q3HUOsTBPxGFGD1o9tgZEo51mQH0r4JQF7wlc9kyk8u47VyBhyphenhyphen64CrNqrwCFMPC7KMGG5VQbH0brfFkcYoQ/s0/unnamed%20%2845%29.png" />'
};

function processGodIsTheGospel() {
    const filePath = path.join(baseDir, 'god-is-the-gospel.md');
    let content = fs.readFileSync(filePath, 'utf8');

    // Insert missing images
    const sections = ['intro', 'ch1', 'ch2', 'ch4', 'ch7', 'conclusion'];
    sections.forEach(sec => {
        // Find the div and its following heading
        const regex = new RegExp(`(<div id="${sec}">[\\s\\S]*?<h3[^>]*>.*?</h3>)`);
        content = content.replace(regex, (match, header) => {
            console.log('Inserted image for', sec);
            return `${header}<div style="text-align: center; margin: 2rem 0;">${images[sec]}</div>`;
        });
    });

    // Replace all image sizes (e.g., /s400/, /s600/, /w600-h800/) with /s0/ in god-is-the-gospel
    // In Blogger URLs, size param looks like /s600/ or /w400-h300/ right before the filename
    content = content.replace(/\/(s\d+|w\d+-h\d+)\/([^/]+\.png)/g, '/s0/$2');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated god-is-the-gospel.md');
}

function processComeLordJesus() {
    const filePath = path.join(baseDir, 'come-lord-jesus.md');
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace all image sizes with /s0/
    content = content.replace(/\/(s\d+|w\d+-h\d+)\/([^/]+\.(?:png|jpg|jpeg|gif|webp))/ig, '/s0/$2');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated come-lord-jesus.md');
}

processGodIsTheGospel();
processComeLordJesus();
