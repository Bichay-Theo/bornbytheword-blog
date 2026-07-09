const fs = require('fs');
const files = [
  'complete-translation-come-lord-jesus-chapter-1.md',
  'end-times-deception-patience-and-joy.md',
  'end-time-prayer-and-mission-come-lord-jesus.md',
  'go-to-work-go-to-church-in-the-end-times.md',
  'blameless-at-coming-of-christ.md',
  'experiencing-glory-of-christ-joyful-amazement_01649428013.md',
  'glory-of-christ-primary-reality-second-coming.md',
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

files.forEach(f => {
  const text = fs.readFileSync('content/posts/' + f, 'utf8');
  const imgsHTML = text.match(/<img[^>]+src="([^"]+)"[^>]*>/g) || [];
  const imgsMD = text.match(/!\[.*?\]\((.*?)\)/g) || [];
  if (imgsHTML.length + imgsMD.length === 0) {
    console.log('NO IMAGES IN:', f);
  }
});
