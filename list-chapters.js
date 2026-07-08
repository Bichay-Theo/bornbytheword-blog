const fs = require('fs');
const files = [
  'blameless-at-coming-of-christ.md',
  'complete-translation-come-lord-jesus-chapter-1.md',
  'end-time-prayer-and-mission-come-lord-jesus.md',
  'end-times-deception-patience-and-joy.md',
  'experiencing-glory-of-christ-joyful-amazement_01649428013.md',
  'glory-of-christ-primary-reality-second-coming.md',
  'go-to-work-go-to-church-in-the-end-times.md',
  'grace-at-revelation-of-christ.md',
  'how-book-awakens-love-christ-appearing.md',
  'is-there-any-moment-rapture-before-second-coming.md',
  'jesus-and-paul-shared-vision-of-second-coming.md',
  'jesus-rescues-from-wrath-judgment.md',
  'joy-of-personal-fellowship-with-the-sovereign-servant.md',
  'joy-of-receiving-varied-rewards.md',
  'judgment-according-to-works-at-christ-coming.md',
  'living-between-christ-advents-vigilance-and-love.md',
  'living-holy-and-gentle-awaiting-christ-return.md',
  'perfected-in-mind-heart-body.md',
  'timing-of-christ-second-coming-prophetic-perspective.md',
  'vengeance-and-rest-at-christ-coming.md',
  'what-must-happen-before-christ-second-coming.md',
  'what-new-testament-means-by-jesus-coming-soon.md'
];

let items = [];
files.forEach(f => {
  const c = fs.readFileSync('content/posts/' + f, 'utf8');
  const titleMatch = c.match(/title:\s*"(.*?)"/);
  const dateMatch = c.match(/date:\s*"(.*?)"/);
  
  let chapterNumberMatch = c.match(/الْفَصْلُ\s+(ال.*?)\s/);
  
  items.push({
    file: f,
    title: titleMatch ? titleMatch[1] : 'No title',
    date: dateMatch ? new Date(dateMatch[1]) : new Date(0),
    chapter: chapterNumberMatch ? chapterNumberMatch[1] : 'Unknown'
  });
});

items.sort((a, b) => a.date - b.date);

items.forEach((item, i) => {
  console.log(`${i+1}. ${item.title} (Date: ${item.date.toISOString().split('T')[0]})`);
});

fs.writeFileSync('chapter-list.json', JSON.stringify(items, null, 2));
