const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'frontend/app/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Remove AITerminal import
content = content.replace(/const AITerminal = dynamic\(\(\) => import\("\.\/components\/AITerminal"\), \{ ssr: false \}\);\n?/g, '');

// 2. Add Search lucide icon
content = content.replace(/import \{ MapPin \} from "lucide-react";/g, 'import { MapPin, Search } from "lucide-react";');

// 3. Add Chamba to Risk History
content = content.replace(/<option value="Kullu" className="bg-slate-900 text-white">Kullu<\/option>/g, '<option value="Kullu" className="bg-slate-900 text-white">Kullu</option>\n                    <option value="Chamba" className="bg-slate-900 text-white">Chamba</option>');

// 4. Update the Header layout and remove AITerminal block, add Search Bar
const headerRegex = /<header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black\/40 backdrop-blur-xl border border-white\/10 p-6 rounded-\[2rem\] shadow-2xl">[\s\S]*?<\/header>/;

const newHeader = `<header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/40 backdrop-blur-xl border border-white/10 p-4 px-6 rounded-full shadow-2xl">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-black tracking-tighter text-white drop-shadow-md">
                  HimAlert <span className="text-blue-400 font-light">Global</span>
                </h1>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 border border-white/5">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.7)]"></div>
                <MapPin size={12} className="text-red-400" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-red-400 uppercase">Live Ops</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-white/40" />
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city in HP..." 
                  className="w-full bg-black/50 border border-white/20 text-white text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-blue-400 transition-colors"
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-50">
                    {searchResults.map((res: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm"
                        onClick={() => {
                          setGlobalLocation({ name: res.name, lat: res.latitude, lon: res.longitude });
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        {res.name}
                        <span className="text-white/40 text-xs ml-2">{res.admin1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Link
                href="/local"
                className="group relative overflow-hidden rounded-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 px-6 py-2 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg w-full md:w-auto"
              >
                <span className="relative z-10 text-xs font-bold tracking-wide text-blue-100">My Location</span>
                <span className="relative z-10 text-blue-400 group-hover:translate-x-1 transition-all">&rarr;</span>
              </Link>
            </div>
          </header>`;

content = content.replace(headerRegex, newHeader);

// 5. Add searchQuery, searchResults state and logic
const stateRegex = /const \[apiOnline, setApiOnline\] =\s*useState\(false\);/;
const newStateVars = `const [apiOnline, setApiOnline] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [globalLocation, setGlobalLocation] = useState({ name: "Dharamshala", lat: 32.2190, lon: 76.3234 });

  useEffect(() => {
    if (searchQuery.length > 2) {
      const delayFn = setTimeout(async () => {
        try {
          const res = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL || "https://himalert.onrender.com"}/api/locations/search?query=\${searchQuery}\`);
          const data = await res.json();
          setSearchResults(data.results || []);
        } catch (e) {}
      }, 500);
      return () => clearTimeout(delayFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);`;
  
content = content.replace(stateRegex, newStateVars);

// 6. Update the hardcoded /api/weather and /api/risk to use globalLocation
content = content.replace(/\/api\/risk"/g, '/api/risk?lat=${globalLocation.lat}&lon=${globalLocation.lon}"');
content = content.replace(/\/api\/weather"/g, '/api/weather?lat=${globalLocation.lat}&lon=${globalLocation.lon}"');
content = content.replace(/locationName="Himachal Pradesh"/g, 'locationName={globalLocation.name}');

// 7. Add globalLocation as dependency to the fetch useEffects.
// The risk useEffect is currently just `useEffect(() => { ... }, []);`
content = content.replace(/}, \[\]\);/g, '}, [globalLocation]);');

fs.writeFileSync(pagePath, content, 'utf8');
console.log("Updated page.tsx");
