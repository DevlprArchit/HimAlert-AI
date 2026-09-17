const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/app/components/RiskMap.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Hide the Map Style controls on small screens
content = content.replace(/absolute\s+right-4\s+top-4\s+z-\[1000\]/, 'hidden sm:block absolute right-4 top-4 z-[1000]');

fs.writeFileSync(filePath, content, 'utf8');
console.log('RiskMap updated');
