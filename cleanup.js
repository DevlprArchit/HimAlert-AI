const fs = require('fs');

// Fix page.tsx
let page = fs.readFileSync('frontend/app/page.tsx', 'utf8');

// 1. Add Link import
if (!page.includes('import Link from "next/link";')) {
    page = page.replace('import dynamic from "next/dynamic";', 'import dynamic from "next/dynamic";\nimport Link from "next/link";');
}

// 2. Fix the <a> tag
page = page.replace(/<a href="\/local"([\s\S]*?)<\/a>/g, '<Link href="/local"$1</Link>');

// 3. Remove unused states from page.tsx (apiOnline is used, but userLocation and safePoints are not)
page = page.replace(/const \[userLocation, setUserLocation\] = useState<{lat: number, lon: number} \| null>\(null\);\s*/g, '');
page = page.replace(/const \[safePoints, setSafePoints\] = useState<any\[\]>\(\[\]\);\s*/g, '');
page = page.replace(/const fetchSafePoints = async [\s\S]*?\} catch\(e\) \{\}\s*\};\s*/g, '');
page = page.replace(/const locateUser = \(\) => \{[\s\S]*?\}\s*\};\s*/g, '');

// 4. Remove userLocation references from fetch calls in page.tsx
page = page.replace(/\$\{userLocation \? `\?lat=\$\{userLocation\.lat\}&lon=\$\{userLocation\.lon\}` : ""\}/g, '');
page = page.replace(/}, \[userLocation\]\);/g, '}, []);');

fs.writeFileSync('frontend/app/page.tsx', page, 'utf8');

// Fix local/page.tsx
let local = fs.readFileSync('frontend/app/local/page.tsx', 'utf8');

// Remove duplicate locateUser button if any
local = local.replace(/<button onClick=\{locateUser\}[\s\S]*?<\/button>\s*<button onClick=\{locateUser\}/g, '<button onClick={locateUser}');
local = local.replace(/<button onClick=\{locateUser\}[\s\S]*?<\/button>\s*<div className="w-full md:w-\[500px\]">/g, '<div className="w-full md:w-[500px]">');

fs.writeFileSync('frontend/app/local/page.tsx', local, 'utf8');

console.log("Cleanup complete!");
