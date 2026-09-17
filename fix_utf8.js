const fs = require('fs');
let content = fs.readFileSync('frontend/app/local/page.tsx');
let str = content.toString('utf8');

// Strip invalid utf-8 or non-standard characters
str = str.replace(/[^\x00-\x7F]/g, "");

fs.writeFileSync('frontend/app/local/page.tsx', str, 'utf8');
console.log("Stripped non-ascii characters!");
