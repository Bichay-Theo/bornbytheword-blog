fetch('https://bornbytheword.blogspot.com/feeds/posts/default?alt=json&max-results=500')
  .then(r => r.json())
  .then(d => {
    const post = d.feed.entry.find(e => e.title.$t.includes('رؤية') || e.title.$t.includes('التمتع به'));
    if (post) {
      console.log('Found post:', post.title.$t);
      const content = post.content.$t;
      const imgs = content.match(/<img[^>]+src="([^"]+)"/g) || [];
      console.log('Images found:', imgs.length);
      imgs.slice(0, 3).forEach(img => console.log(img));
      
      const fs = require('fs');
      fs.writeFileSync('scratch/seeing-images.json', JSON.stringify(imgs, null, 2));
    } else {
      console.log('Post not found');
    }
  })
  .catch(e => console.error(e));
