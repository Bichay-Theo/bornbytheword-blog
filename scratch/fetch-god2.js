fetch('https://bornbytheword.blogspot.com/feeds/posts/default?alt=json&max-results=500')
  .then(r => r.json())
  .then(d => {
    let bestPost = null;
    let maxLen = 0;
    
    d.feed.entry.forEach(e => {
      // The book should have a huge content length and probably mentions 'الله' or 'الإنجيل'
      const content = e.content ? e.content.$t : '';
      if (content.length > maxLen && (e.title.$t.includes('الله') || e.title.$t.includes('الانجيل') || e.title.$t.includes('الإنجيل'))) {
        maxLen = content.length;
        bestPost = e;
      }
    });

    if (bestPost) {
      console.log('Found largest post:', bestPost.title.$t, 'Length:', maxLen);
      const imgs = bestPost.content.$t.match(/<img[^>]+src="([^"]+)"/g) || [];
      console.log('Images found:', imgs.length);
      
      const fs = require('fs');
      fs.writeFileSync('scratch/god-images.json', JSON.stringify(imgs, null, 2));
    } else {
      console.log('Post not found');
    }
  })
  .catch(e => console.error(e));
