const fs = require('fs');
let page = fs.readFileSync('frontend/app/page.tsx', 'utf8');

// Find the start of the MAIN return statement
const mainReturnRegex = /return \(\s*<DynamicBackground condition=\{\(weather as any\)\?\.current\?\.cloud_cover > 50[\s\S]*/;

const premiumRender = `return (
    <DynamicBackground condition={(weather as any)?.current?.cloud_cover > 50 ? "Cloudy" : (weather as any)?.current?.rain > 0 ? "Rain" : "Sunny"}>
      <main className="min-h-screen text-white font-sans selection:bg-cyan-500/30 pb-20 pt-8 px-4 sm:px-8">
        
        <div className="max-w-[90rem] mx-auto space-y-8">
          {/* PREMIUM HEADER */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.7)]"></div>
                <span className="text-xs font-bold tracking-[0.25em] text-red-400 uppercase">Live Operations</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-md">
                HimAlert <span className="text-blue-400 font-light">Global</span>
              </h1>
              <p className="mt-1 text-sm text-blue-300 uppercase tracking-widest font-semibold drop-shadow">
                VyomForge Disaster Intelligence
              </p>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Link
                href="/local"
                className="group relative overflow-hidden rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-4 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10 text-sm font-bold tracking-wide text-white">My Exact Location</span>
                <span className="relative z-10 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all">&rarr;</span>
              </Link>
              <div className="w-full md:w-[400px]">
                 <AITerminal />
              </div>
            </div>
          </header>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: WEATHER & FORECAST */}
            <div className="xl:col-span-5 space-y-8 flex flex-col">
              <BeautifulWeather weather={weather} weatherLoading={weatherLoading} locationName="Himachal Pradesh" />
              <ForecastDisaster risk={risk} loading={loading} />
              <TrendChart weather={weather} />
              
              {/* ALERTS (Glass) */}
              <section className="bg-gradient-to-b from-red-950/60 to-black/60 backdrop-blur-xl border border-red-500/30 rounded-[2rem] p-8 shadow-2xl flex-1">
                <h2 className="text-2xl font-bold text-red-100 flex items-center gap-2 mb-6">
                  <span className="text-red-500 animate-pulse">⚠</span> Active Emergency Alerts
                </h2>
                {alerts.length === 0 ? (
                  <p className="text-red-200/60 font-medium">All clear. No active alerts reported.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {alerts.map((alert, index) => (
                      <div key={index} className="rounded-2xl border border-red-500/20 bg-red-900/20 p-5 backdrop-blur-md">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-1 rounded">{alert.type}</span>
                          <span className="text-xs text-red-200/60 font-mono">{alert.time}</span>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-1">{alert.location}</h3>
                        <p className="text-red-100/80 text-sm">{alert.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN: MAPS & HISTORY */}
            <div className="xl:col-span-7 space-y-8">
              
              {/* GIS MAP */}
              <section className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Live Threat Map</h2>
                <p className="text-white/50 text-sm mb-6 uppercase tracking-wider font-semibold">Multispectral Risk Visualization</p>
                <div className="w-full rounded-2xl overflow-hidden border border-white/10 relative">
                  <RiskMap locations={locations} />
                </div>
              </section>

              {/* HYDROLOGICAL */}
              <HydrologicalIntelligence />

              {/* RISK TREND HISTORY */}
              <section className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Risk Trend History</h2>
                    <p className="text-white/50 text-sm mt-1 uppercase tracking-wider font-semibold">24-Hour Threat Trajectory</p>
                  </div>
                  <select
                    className="bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-full px-5 py-2 outline-none focus:border-blue-400 backdrop-blur-md cursor-pointer hover:bg-white/20 transition-colors"
                    value={historyLocation}
                    onChange={(e) => setHistoryLocation(e.target.value)}
                  >
                    <option value="Dharamshala" className="bg-slate-900 text-white">Dharamshala</option>
                    <option value="Shimla" className="bg-slate-900 text-white">Shimla</option>
                    <option value="Manali" className="bg-slate-900 text-white">Manali</option>
                    <option value="Mandi" className="bg-slate-900 text-white">Mandi</option>
                    <option value="Kullu" className="bg-slate-900 text-white">Kullu</option>
                  </select>
                </div>
                
                {riskHistory.length === 0 ? (
                   <div className="h-[300px] flex items-center justify-center text-white/40 font-medium">Gathering historical data...</div>
                ) : (
                   <div className="h-[300px] w-full mt-4">
                     <LineChart data={riskHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} width={800} height={300} style={{ width: '100%', height: '100%' }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="timestamp" stroke="rgba(255,255,255,0.4)" tickFormatter={(value) => new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} />
                        <YAxis stroke="rgba(255,255,255,0.4)" domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', color: 'white', backdropFilter: 'blur(10px)' }} />
                        <Line type="monotone" dataKey="overall" stroke="#ef4444" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="flash_flood" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="landslide" stroke="#f97316" strokeWidth={2} dot={false} />
                     </LineChart>
                   </div>
                )}
              </section>

            </div>
          </div>
        </div>
      </main>
    </DynamicBackground>
  );
}
`;

page = page.replace(mainReturnRegex, premiumRender);
fs.writeFileSync('frontend/app/page.tsx', page, 'utf8');
console.log("Rewrote page.tsx to ultra premium layout!");
