const fs = require("fs");
const path = require("path");
const palettes = [["#2563EB","#7C3AED"],["#7C3AED","#06B6D4"],["#06B6D4","#2563EB"],["#DB2777","#7C3AED"],["#0EA5E9","#2563EB"],["#1D4ED8","#06B6D4"]];
const items = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
const outDir = process.argv[2];
items.forEach((item, i) => {
  const [c1, c2] = palettes[i % palettes.length];
  const gradId = "ga" + i;
  const svg = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
  <defs><linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  <rect width="200" height="200" rx="100" fill="url(#${gradId})"/>
  <circle cx="100" cy="80" r="34" fill="white" opacity=".92"/>
  <path d="M40 172c6-38 34-58 60-58s54 20 60 58" fill="white" opacity=".92"/>
  <text x="100" y="196" font-family="Poppins, Arial, sans-serif" font-size="14" font-weight="700" fill="white" text-anchor="middle" opacity="0"> </text>
</svg>`;
  fs.writeFileSync(path.join(outDir, item.file), svg);
});
console.log("Generated", items.length, "avatars");
