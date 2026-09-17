const fs = require('fs');
const path = require('path');

// 1. Update Global Page header
const pagePath = path.join(__dirname, 'frontend/app/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');
pageContent = pageContent.replace(/p-4 px-6 rounded-full/g, 'p-6 rounded-[2rem]');
fs.writeFileSync(pagePath, pageContent, 'utf8');

// 2. Update Local Page header and map size
const localPath = path.join(__dirname, 'frontend/app/local/page.tsx');
let localContent = fs.readFileSync(localPath, 'utf8');
localContent = localContent.replace(/p-4 px-6 rounded-full/g, 'p-6 rounded-[2rem]');
// Remove the h-full min-h-[500px] from the Safe Zones section
localContent = localContent.replace(/p-8 shadow-2xl flex flex-col h-full min-h-\[500px\]/, 'p-8 shadow-2xl flex flex-col');
// Update the map container div
localContent = localContent.replace(/flex-1 w-full rounded-2xl overflow-hidden border border-white\/10 relative/, 'h-[440px] sm:h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 relative');
fs.writeFileSync(localPath, localContent, 'utf8');

// 3. Update SafeZoneMap height 
const mapPath = path.join(__dirname, 'frontend/app/components/SafeZoneMap.tsx');
let mapContent = fs.readFileSync(mapPath, 'utf8');
mapContent = mapContent.replace(/minHeight: '400px'/g, 'minHeight: "100%"');
fs.writeFileSync(mapPath, mapContent, 'utf8');

// 4. Update HydrologicalIntelligence empty state text
const hydroPath = path.join(__dirname, 'frontend/app/components/HydrologicalIntelligence.tsx');
let hydroContent = fs.readFileSync(hydroPath, 'utf8');
hydroContent = hydroContent.replace(/No major river systems intersect exactly with .*?\.</, 'Safe from rivers within a 10km radius.');
fs.writeFileSync(hydroPath, hydroContent, 'utf8');

console.log("Fixes applied.");
