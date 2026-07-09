const str = 'test [1] test [١] test';
const eng = '1';
const ar = '١';

const r1 = new RegExp(`\\[${eng}\\]`, 'g');
const r2 = new RegExp(`\\[${ar}\\]`, 'g');

console.log(str.replace(r1, 'E').replace(r2, 'A'));
