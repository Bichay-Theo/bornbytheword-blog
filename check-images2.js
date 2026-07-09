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

let postImgCount = 0;
files.forEach(f => {
    let text = fs.readFileSync('content/posts/' + f, 'utf8');
    // strip frontmatter for an accurate comparison with the book
    text = text.replace(/---[\s\S]*?---/, '').trim();
    postImgCount += (text.match(/<img/gi) || []).length + (text.match(/!\[/g) || []).length;
});
console.log('Image count in the 22 chapter posts:', postImgCount);

const c = fs.readFileSync('content/pages/come-lord-jesus.md', 'utf8');
const imgCount = (c.match(/<img/gi) || []).length + (c.match(/!\[/g) || []).length;
console.log('Image count in compiled book:', imgCount);
