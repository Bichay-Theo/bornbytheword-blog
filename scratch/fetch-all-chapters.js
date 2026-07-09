fetch('https://bornbytheword.blogspot.com/feeds/posts/default?alt=json&max-results=500')
  .then(r => r.json())
  .then(d => {
    d.feed.entry.forEach(e => {
      const title = e.title.$t;
      if (title.includes('الله هو الإنجيل') || title.includes('الله هو الانجيل')) {
        const content = e.content ? e.content.$t : '';
        const imgs = content.match(/<img[^>]+src="([^"]+)"/g) || [];
        console.log('Post:', title);
        console.log('Images:', imgs.length);
        if (imgs.length > 0) {
          console.log(imgs[0]);
        }
        console.log('---');
      }
    });
  })
  .catch(e => console.error(e));
