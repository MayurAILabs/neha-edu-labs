/* One-off generator for gradient SVG placeholder illustrations. Not shipped as a runtime dependency. */
const fs = require("fs");
const path = require("path");

const ICONS = {
  ai: '<path d="M100 40c-22 0-40 18-40 40 0 12 5 22 14 30-3 6-4 13-4 20 0 22 18 40 40 40s40-18 40-40c0-7-1-14-4-20 9-8 14-18 14-30 0-22-18-40-40-40h-20z" fill="none" stroke="white" stroke-width="4" opacity=".9"/><circle cx="80" cy="90" r="6" fill="white"/><circle cx="120" cy="90" r="6" fill="white"/><path d="M80 130q20 14 40 0" stroke="white" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M100 40v-16M70 55l-12-12M130 55l12-12" stroke="white" stroke-width="4" stroke-linecap="round"/>',
  education: '<path d="M40 90 100 60l60 30-60 30z" fill="white" opacity=".95"/><path d="M70 105v30c0 8 14 16 30 16s30-8 30-16v-30" fill="none" stroke="white" stroke-width="4"/><path d="M160 90v34" stroke="white" stroke-width="4" stroke-linecap="round"/>',
  programming: '<path d="M75 75 40 100l35 25M125 75l35 25-35 25M112 65l-24 70" stroke="white" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  engineering: '<circle cx="100" cy="100" r="26" fill="none" stroke="white" stroke-width="8"/><g fill="white">' +
    Array.from({length:8}).map((_,i)=>{const a=i*Math.PI/4;const x1=100+38*Math.cos(a),y1=100+38*Math.sin(a),x2=100+54*Math.cos(a),y2=100+54*Math.sin(a);return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="white" stroke-width="10" stroke-linecap="round"/>`}).join("") + '</g>',
  chip: '<rect x="65" y="65" width="70" height="70" rx="8" fill="none" stroke="white" stroke-width="6"/><rect x="85" y="85" width="30" height="30" rx="4" fill="white"/>' +
    [50,70,90,110,130,150].map(x=>`<line x1="${x}" y1="65" x2="${x}" y2="45" stroke="white" stroke-width="5" stroke-linecap="round"/><line x1="${x}" y1="135" x2="${x}" y2="155" stroke="white" stroke-width="5" stroke-linecap="round"/>`).join(""),
  data: '<rect x="55" y="120" width="20" height="40" fill="white"/><rect x="90" y="90" width="20" height="70" fill="white"/><rect x="125" y="60" width="20" height="100" fill="white"/>',
  book: '<path d="M50 55h50a12 12 0 0 1 12 12v78a10 10 0 0 0-10-6H50z" fill="white" opacity=".95"/><path d="M150 55h-50a12 12 0 0 0-12 12v78a10 10 0 0 1 10-6h52z" fill="white" opacity=".7"/>',
  rocket: '<path d="M100 40c20 18 28 46 24 78l-24 20-24-20c-4-32 4-60 24-78z" fill="white" opacity=".95"/><circle cx="100" cy="88" r="9" fill-opacity=".4" fill="#0B1120"/><path d="M76 118l-18 30 30-14M124 118l18 30-30-14" fill="white" opacity=".8"/>',
  network: '<circle cx="60" cy="70" r="10" fill="white"/><circle cx="140" cy="70" r="10" fill="white"/><circle cx="100" cy="120" r="12" fill="white"/><circle cx="60" cy="150" r="8" fill="white"/><circle cx="140" cy="150" r="8" fill="white"/><g stroke="white" stroke-width="3" opacity=".8"><line x1="60" y1="70" x2="100" y2="120"/><line x1="140" y1="70" x2="100" y2="120"/><line x1="60" y1="150" x2="100" y2="120"/><line x1="140" y1="150" x2="100" y2="120"/></g>'
};

const palettes = [
  ["#2563EB", "#7C3AED"], ["#7C3AED", "#06B6D4"], ["#06B6D4", "#2563EB"],
  ["#1D4ED8", "#06B6D4"], ["#7C3AED", "#DB2777"], ["#0EA5E9", "#2563EB"]
];

function svg({ icon, c1, c2, id, pattern = true }) {
  const gradId = "g" + id.replace(/[^a-z0-9]/gi, "");
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#${gradId})"/>
  ${pattern ? '<g opacity=".12" fill="white"><circle cx="20" cy="180" r="3"/><circle cx="180" cy="20" r="3"/><circle cx="170" cy="175" r="2"/><circle cx="15" cy="30" r="2"/></g>' : ""}
  <g>${ICONS[icon] || ICONS.book}</g>
</svg>`;
}

const outDir = process.argv[2];
const items = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));

items.forEach((item, i) => {
  const [c1, c2] = palettes[i % palettes.length];
  const content = svg({ icon: item.icon, c1, c2, id: item.file });
  fs.writeFileSync(path.join(outDir, item.file), content);
});
console.log("Generated", items.length, "placeholders into", outDir);
