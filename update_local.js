const fs = require('fs');
const path = require('path');

const localPath = path.join(__dirname, 'frontend/app/local/page.tsx');
let content = fs.readFileSync(localPath, 'utf8');

// 1. Add SafeZoneMap import
content = content.replace(/const RiskMap = dynamic\(\(\) => import\("\.\.\/components\/RiskMap"\), \{ ssr: false \}\);/g, 'const SafeZoneMap = dynamic(() => import("../components/SafeZoneMap"), { ssr: false });\nconst RiskMap = dynamic(() => import("../components/RiskMap"), { ssr: false });');

// 2. Remove AITerminal import
content = content.replace(/const AITerminal = dynamic\(\(\) => import\("\.\.\/components\/AITerminal"\), \{ ssr: false \}\);\n?/g, '');

// 3. Header replacement
const headerRegex = /<header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black\/40 backdrop-blur-xl border border-white\/10 p-6 rounded-\[2rem\] shadow-2xl">[\s\S]*?<\/header>/;

const newHeader = `<header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/40 backdrop-blur-xl border border-white/10 p-4 px-6 rounded-full shadow-2xl">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-white drop-shadow-md">
                  HimAlert <span className="text-blue-400 font-light">Local</span>
                </h1>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 border border-white/5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.7)]"></div>
                <MapPin size={12} className="text-emerald-400" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase">Live Ops</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <Link
                href="/"
                className="group relative overflow-hidden rounded-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 px-6 py-2 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg w-full md:w-auto"
              >
                <span className="relative z-10 text-xs font-bold tracking-wide text-blue-100">&larr; Back to Global View</span>
              </Link>
            </div>
          </header>`;

content = content.replace(headerRegex, newHeader);

// 4. Safe Zones replacement
const safeZonesRegex = /<section className="bg-gradient-to-b from-blue-950\/60 to-black\/60 backdrop-blur-xl border border-blue-500\/30 rounded-\[2\.5rem\] p-8 shadow-2xl flex flex-col">[\s\S]*?<\/section>/;

const newSafeZones = `<section className="bg-gradient-to-b from-blue-950/60 to-black/60 backdrop-blur-xl border border-blue-500/30 rounded-[2.5rem] p-8 shadow-2xl flex flex-col h-full min-h-[500px]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Real-Time Safe Zones</h2>
                    <p className="text-blue-200/60 text-sm mt-1 uppercase tracking-wider font-semibold">3km Radius OpenStreetMap Live Sync</p>
                  </div>
                </div>
                
                <div className="flex-1 w-full rounded-2xl overflow-hidden border border-white/10 relative">
                  {!userLocation ? (
                    <div className="h-full w-full flex items-center justify-center font-medium text-blue-200/50 animate-pulse bg-black/40">
                      Acquiring GPS coordinates...
                    </div>
                  ) : (
                    <SafeZoneMap userLocation={userLocation} safePoints={safePoints} />
                  )}
                </div>
              </section>`;

content = content.replace(safeZonesRegex, newSafeZones);

// 5. Update HydrologicalIntelligence to pass locationName
// We'll pass the exact coordinates string or just "Local" for now, but wait! The user wants Rivers based on location.
// In `local/page.tsx`, we can pass `locationName="My Exact Location"` but we don't know the exact city name natively unless we reverse geocode.
// Let's reverse geocode it!
const reverseGeocodeAddition = `
  const [cityName, setCityName] = useState("My Location");

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(\`https://nominatim.openstreetmap.org/reverse?lat=\${lat}&lon=\${lon}&format=json\`);
      const data = await res.json();
      if (data.address && data.address.city) {
        setCityName(data.address.city);
      } else if (data.address && data.address.town) {
        setCityName(data.address.town);
      } else if (data.address && data.address.village) {
        setCityName(data.address.village);
      }
    } catch(e) {}
  };
`;

content = content.replace(/const \[userLocation, setUserLocation\] = useState<\{lat: number, lon: number\} \| null>\(null\);/, `const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);\n${reverseGeocodeAddition}`);

content = content.replace(/setUserLocation\(\{lat: pos\.coords\.latitude, lon: pos\.coords\.longitude\}\);/, `setUserLocation({lat: pos.coords.latitude, lon: pos.coords.longitude}); reverseGeocode(pos.coords.latitude, pos.coords.longitude);`);

content = content.replace(/setUserLocation\(\{lat: 32\.219, lon: 76\.3234\}\);/g, `setUserLocation({lat: 32.219, lon: 76.3234}); reverseGeocode(32.219, 76.3234);`);

content = content.replace(/<HydrologicalIntelligence \/>/, `<HydrologicalIntelligence locationName={cityName} />`);

// Write back
fs.writeFileSync(localPath, content, 'utf8');
console.log("Updated local/page.tsx");
