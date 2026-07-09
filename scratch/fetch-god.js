fetch('https://bornbytheword.blogspot.com/feeds/posts/default?alt=json&max-results=500')
  .then(r => r.json())
  .then(d => {
    const post = d.feed.entry.find(e => e.title.$t.includes('الله هو الإنجيل') || e.title.$t.includes('الله هو الانجيل'));
    if (post) {
      console.log('Found post:', post.title.$t);
      const content = post.content.$t;
      const imgs = content.match(/<img[^>]+src="([^"]+)"/g) || [];
      console.log('Images found:', imgs.length);
      imgs.slice(0, 15).forEach(img => console.log(img));
      
      const fs = require('fs');
      fs.writeFileSync('scratch/god-images.json', JSON.stringify(imgs, null, 2));
    } else {
      console.log('Post not found');
      // maybe log all titles to see what it's named
      d.feed.entry.forEach(e => {
        if(e.title.$t.includes('الله')) console.log('Potential match:', e.title.$t);
      });
    }
  })
  .catch(e => console.error(e));
