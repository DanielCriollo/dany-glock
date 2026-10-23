// Verificación de contraste WCAG 2.x de la paleta Dany Glock.
// Uso: node local/design-preview/contrast.mjs
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (hex) => {
  const [r, g, b] = hex.slice(1).match(/../g).map((x) => toLin(parseInt(x, 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const grade = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'solo grande/UI' : 'FALLA');

const bgs = { ink: '#0A0A0B', graphite: '#141416', carbon: '#1C1C1F', steel: '#2A2A2E' };
const fgs = {
  bone: '#EDEAE4', ash: '#A8A49E', smoke: '#8A8680', iron: '#4A4845',
  'crimson-text': '#FF5468', 'crimson-signal': '#E1243F', crimson: '#B3122E',
  ember: '#C8A27A', success: '#7BC59A',
};
const pairs = [
  ['bone', '#EDEAE4', 'crimson', '#B3122E'],
  ['bone', '#EDEAE4', 'crimson-hover', '#C8152F'],
  ['bone', '#EDEAE4', 'crimson-press', '#8F0E25'],
  ['ink', '#0A0A0B', 'bone', '#EDEAE4'],
  ['crimson-text', '#FF5468', 'crimson', '#B3122E'],
];

for (const [bn, bv] of Object.entries(bgs)) {
  console.log(`\n— sobre ${bn} (${bv})`);
  for (const [fn, fv] of Object.entries(fgs)) {
    const r = ratio(fv, bv);
    console.log(`  ${fn.padEnd(15)} ${r.toFixed(2).padStart(6)}  ${grade(r)}`);
  }
}
console.log('\n— rellenos');
for (const [fn, fv, bn, bv] of pairs) {
  const r = ratio(fv, bv);
  console.log(`  ${fn} / ${bn}`.padEnd(32) + `${r.toFixed(2).padStart(6)}  ${grade(r)}`);
}
