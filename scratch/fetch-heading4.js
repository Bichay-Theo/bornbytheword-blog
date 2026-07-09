fetch('https://bichay-theo.github.io/bornbytheword-blog/p/god-is-the-gospel')
  .then(r=>r.text())
  .then(html => {
    const idx = html.indexOf('heading-4');
    console.log(html.substring(Math.max(0, idx - 200), idx + 800));
  });
