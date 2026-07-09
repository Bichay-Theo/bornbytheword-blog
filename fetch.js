fetch('https://bichay-theo.github.io/bornbytheword-blog/p/god-is-the-gospel').then(r=>r.text()).then(t=>{ const idx=t.indexOf('id="ch4-fn-9"'); console.log(t.substring(idx-100, idx+200)); })
