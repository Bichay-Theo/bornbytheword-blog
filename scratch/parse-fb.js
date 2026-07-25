const fs = require('fs');

try {
  const filePath = 'C:\\Users\\Boaz\\Downloads\\Facebook.html';
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist:', filePath);
    process.exit(1);
  }

  const html = fs.readFileSync(filePath, 'utf8');
  
  // Basic parsing to extract text
  let text = html;
  
  // Remove scripts
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  // Remove styles
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  // Remove SVG
  text = text.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ');
  // Replace line-breaking tags with actual line breaks
  text = text.replace(/<(br|p|div|h[1-6]|li|tr|table)[^>]*>/gi, '\n');
  // Remove all other HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Decode common HTML entities
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  
  // Collapse multiple whitespace and newlines
  text = text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n').trim();

  // We are mostly interested in Arabic text or meaningful English text.
  // Let's print out lines that have at least some Arabic characters or length > 50 to filter out noise.
  const lines = text.split('\n');
  const meaningfulLines = lines.filter(line => {
    line = line.trim();
    if (line.length < 10) return false;
    // Check if contains Arabic
    const hasArabic = /[\u0600-\u06FF]/.test(line);
    return hasArabic;
  });

  console.log('--- Extracted Text ---');
  meaningfulLines.slice(0, 100).forEach(l => console.log(l));
  
} catch (e) {
  console.error('Error:', e);
}
