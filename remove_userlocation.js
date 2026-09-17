const fs = require('fs');
let page = fs.readFileSync('frontend/app/page.tsx', 'utf8');

// The block to remove:
// {userLocation && (
//   <section className="mt-8 bg-black/40 backdrop-blur-md border border-white/10 text-white border-slate-200 rounded-3xl p-6 shadow-md">
//    ...
//   </section>
// )}

page = page.replace(/\{userLocation && \([\s\S]*?<\/section>\s*\)\}/g, '');

fs.writeFileSync('frontend/app/page.tsx', page, 'utf8');
console.log("Removed userLocation block!");
