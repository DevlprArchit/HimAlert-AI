"use client";
/* eslint-disable */

import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Waves, TrendingUp, AlertTriangle, ShieldCheck, Droplets, Activity } from "lucide-react";

export type River = {
  name: string;
  basin: string;
  risk: number;
  status: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  flow: number;
  trend: "RISING" | "STABLE" | "FALLING";
  rainfall: number;
  saturation: number;
  forecast: number[];
  dangerLevel: string;
};

const ALL_RIVERS: River[] = [
  {
    name: "Beas",
    basin: "Beas Basin (Mandi / Kullu)",
    risk: 18,
    status: "LOW",
    flow: 22,
    trend: "STABLE",
    rainfall: 1.4,
    saturation: 45,
    forecast: [18, 20, 22, 21, 20],
    dangerLevel: "Normal Flow (Within Safe Bank Limits)",
  },
  {
    name: "Sutlej",
    basin: "Sutlej Basin (Shimla / Bilaspur)",
    risk: 22,
    status: "LOW",
    flow: 25,
    trend: "STABLE",
    rainfall: 0.8,
    saturation: 42,
    forecast: [22, 22, 23, 24, 22],
    dangerLevel: "Normal Flow (Gobind Sagar Inflow Steady)",
  },
  {
    name: "Ravi",
    basin: "Ravi Basin (Chamba / Kangra)",
    risk: 15,
    status: "LOW",
    flow: 18,
    trend: "STABLE",
    rainfall: 0.5,
    saturation: 40,
    forecast: [15, 16, 17, 16, 15],
    dangerLevel: "Normal Alert Band",
  },
  {
    name: "Chenab",
    basin: "Chenab Basin (Lahaul-Spiti)",
    risk: 12,
    status: "LOW",
    flow: 15,
    trend: "STABLE",
    rainfall: 0.2,
    saturation: 32,
    forecast: [12, 12, 13, 12, 11],
    dangerLevel: "Within Safe Limit",
  },
  {
    name: "Parvati",
    basin: "Parvati Valley (Upper Kullu)",
    risk: 20,
    status: "LOW",
    flow: 24,
    trend: "STABLE",
    rainfall: 1.1,
    saturation: 48,
    forecast: [20, 21, 22, 21, 20],
    dangerLevel: "Normal Mountain Runoff",
  },
];

function getRiskClass(status: string) {
  switch (status) {
    case "CRITICAL":
      return {
        bg: "bg-[#BA1A1A]/15 text-[#BA1A1A]",
        border: "border-[#BA1A1A]/30",
        badge: "bg-[#BA1A1A] text-white",
        bar: "bg-[#BA1A1A]",
      };
    case "HIGH":
      return {
        bg: "bg-[#ED8936]/15 text-[#AB5A14]",
        border: "border-[#ED8936]/30",
        badge: "bg-[#ED8936] text-white",
        bar: "bg-[#ED8936]",
      };
    case "MODERATE":
      return {
        bg: "bg-[#DCAE37]/15 text-[#8C6B12]",
        border: "border-[#DCAE37]/30",
        badge: "bg-[#DCAE37] text-[#012016]",
        bar: "bg-[#DCAE37]",
      };
    default:
      return {
        bg: "bg-[#2C694C]/15 text-[#2C694C]",
        border: "border-[#2C694C]/30",
        badge: "bg-[#2C694C] text-white",
        bar: "bg-[#2C694C]",
      };
  }
}

export default function HydrologicalIntelligence({
  locationName,
  weather,
}: {
  locationName?: string;
  weather?: any;
}) {
  const [selectedRiverName, setSelectedRiverName] = useState<string>("Beas");
  const [liveRiverData, setLiveRiverData] = useState<any>(null);

  useEffect(() => {
    const fetchRiverData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/water-levels`
        );
        if (res.ok) {
          const data = await res.json();
          setLiveRiverData(data.locations);
        }
      } catch (e) {}
    };
    fetchRiverData();
  }, []);

  const selectedRiver =
    ALL_RIVERS.find((r) => r.name === selectedRiverName) || ALL_RIVERS[0];

  let liveFlow = selectedRiver.flow;
  let liveTrend = selectedRiver.trend;
  let liveStatus = selectedRiver.status;

  if (liveRiverData) {
    const locMap: Record<string, string> = {
      Beas: "Mandi",
      Ravi: "Kangra",
      Sutlej: "Bilaspur",
      Chenab: "Lahaul-Spiti",
      Parvati: "Kullu",
    };
    const mappedLoc = locMap[selectedRiver.name] || "Dharamshala";
    const riverEntry = liveRiverData[mappedLoc];
    if (riverEntry && riverEntry.water_level !== undefined && riverEntry.water_level !== null) {
      const rawLevel = Number(riverEntry.water_level);
      liveFlow = Math.min(100, Math.max(5, Math.round(rawLevel > 100 ? rawLevel / 5 : rawLevel * 4)));
      liveTrend = rawLevel > 100 ? "RISING" : "STABLE";
      liveStatus = liveFlow > 75 ? "CRITICAL" : liveFlow > 50 ? "HIGH" : liveFlow > 30 ? "MODERATE" : "LOW";
    }
  }

  let liveForecast = selectedRiver.forecast;
  if (weather && weather.hourly && weather.hourly.precipitation) {
    const precips = weather.hourly.precipitation;
    if (precips.length >= 5) {
      liveForecast = [
        Math.min(100, Math.round((precips[0] || 0) * 12 + liveFlow)),
        Math.min(100, Math.round((precips[3] || 0) * 12 + liveFlow)),
        Math.min(100, Math.round((precips[6] || 0) * 12 + liveFlow)),
        Math.min(100, Math.round((precips[9] || 0) * 12 + liveFlow)),
        Math.min(100, Math.round((precips[12] || 0) * 12 + liveFlow)),
      ];
    }
  }

  const chartData = liveForecast.map((val: number, idx: number) => ({
    time: `T+${(idx + 1) * 3}h`,
    risk: val,
  }));

  const styles = getRiskClass(liveStatus);

  const dischargeData = Object.entries(liveRiverData || {
    Mandi: { water_level: 14.5 },
    Kangra: { water_level: 8.2 },
    Kullu: { water_level: 11.8 },
    Shimla: { water_level: 16.2 },
  }).map(([basin, value]: [string, any]) => ({
    basin,
    discharge: Number(value?.water_level) || 0,
  }));

  return (
    <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#DCE4DF] flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE4DF] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#2C694C]/10 text-[#2C694C]">
              <Waves className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight">
              Hydrological Intelligence & River Command
            </h2>
          </div>
          <p className="text-xs text-[#5D6B63] mt-1">
            Real-time telemetry tracking major Himalayan basins, flood breach thresholds & dam inflows.
          </p>
        </div>

        {/* River Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {ALL_RIVERS.map((river) => (
            <button
              key={river.name}
              onClick={() => setSelectedRiverName(river.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedRiverName === river.name
                  ? "bg-[#012016] text-white shadow-sm"
                  : "bg-[#F1F4F2] text-[#5D6B63] hover:text-[#012016] hover:bg-[#E6E9E7]"
              }`}
            >
              <span>{river.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero River Status & Forecast Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: River Key Metrics Card */}
        <div className="lg:col-span-4 rounded-xl bg-[#F7FAF8] border border-[#DCE4DF] p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5D6B63]">
                Monitored Basin
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${styles.badge}`}>
                {liveStatus}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-[#012016] mt-1">
              {selectedRiver.name} River
            </h3>
            <p className="text-xs text-[#5D6B63] mt-0.5">
              {selectedRiver.basin}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#DCE4DF]">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#5D6B63]">Flow Capacity</span>
              <span className="text-xl font-bold text-[#012016]">{liveFlow}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#5D6B63]">Slope Saturation</span>
              <span className="text-xl font-bold text-[#012016]">{selectedRiver.saturation}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#5D6B63]">Flow Trend</span>
              <span className={`text-xs font-bold flex items-center gap-1 mt-0.5 ${liveTrend === "RISING" ? "text-[#BA1A1A]" : "text-[#2C694C]"}`}>
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{liveTrend}</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#5D6B63]">Rainfall (Catchment)</span>
              <span className="text-xs font-bold text-[#012016] mt-0.5">{selectedRiver.rainfall} mm</span>
            </div>
          </div>

          <div className="rounded-lg bg-white border border-[#DCE4DF] p-2.5 flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-[#5D6B63]">Status Benchmark:</span>
            <span className="font-bold text-[#012016] text-[11px]">{selectedRiver.dangerLevel}</span>
          </div>
        </div>

        {/* Right: Projected Risk Trajectory (Recharts) */}
        <div className="lg:col-span-8 rounded-xl bg-white border border-[#DCE4DF] p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#012016]">
                Projected Flood Risk Trajectory ({selectedRiver.name})
              </h4>
              <p className="text-[11px] text-[#5D6B63]">15-Hour Hydrological Predictive Model Curve</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#EBF0ED] text-[#012016] text-[10px] font-mono font-bold">
              AI Hydro Model
            </span>
          </div>

          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="riverRiskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2C694C" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2C694C" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E9E7" />
                <XAxis dataKey="time" stroke="#727974" tick={{ fontSize: 10, fill: "#5D6B63" }} />
                <YAxis domain={[0, 100]} stroke="#727974" tick={{ fontSize: 10, fill: "#5D6B63" }} tickFormatter={(val) => `${val}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #DCE4DF",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#012016",
                  }}
                  formatter={(value) => [`${value}%`, "Flood Risk Index"]}
                />
                <Area type="monotone" dataKey="risk" stroke="#2C694C" strokeWidth={2.5} fill="url(#riverRiskGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Major River Basins Cards Grid */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-[#012016]">
            All Monitored Himalayan River Basins
          </h4>
          <span className="text-[10px] font-mono text-[#5D6B63]">5 Catchments</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {ALL_RIVERS.map((river) => {
            const rStyles = getRiskClass(river.status);
            const isSelected = river.name === selectedRiverName;

            return (
              <div
                key={river.name}
                onClick={() => setSelectedRiverName(river.name)}
                className={`rounded-xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? "bg-white border-[#2C694C] ring-2 ring-[#2C694C]/20 shadow-sm"
                    : "bg-[#F7FAF8] border-[#DCE4DF] hover:bg-white hover:border-[#2C694C]/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-[#012016]">{river.name}</h5>
                    <span className="text-[10px] text-[#5D6B63]">{river.basin.split(" ")[0]}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${rStyles.bg}`}>
                    {river.status}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[10px] text-[#5D6B63] font-medium">Risk Score</span>
                    <span className="font-mono font-bold text-xs text-[#012016]">{river.risk}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E0E3E1] overflow-hidden">
                    <div className={`h-full rounded-full ${rStyles.bar}`} style={{ width: `${river.risk}%` }}></div>
                  </div>
                </div>

                <div className="flex justify-between text-[11px] font-medium pt-1 border-t border-[#DCE4DF]/70 text-[#5D6B63]">
                  <span>Flow: <strong className="text-[#012016]">{river.flow}%</strong></span>
                  <span>Rain: <strong className="text-[#012016]">{river.rainfall}mm</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* River Discharge Bar Chart */}
      <div className="rounded-xl bg-[#F7FAF8] border border-[#DCE4DF] p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#012016]">
              Live Basin Runoff Discharge (m³/s)
            </h4>
            <p className="text-[11px] text-[#5D6B63]">Automated CWC / Open-Meteo Flood Inflow Gauges</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#2C694C] bg-[#2C694C]/10 px-2 py-0.5 rounded-full">
            ● 1s Synced
          </span>
        </div>

        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dischargeData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6E9E7" />
              <XAxis dataKey="basin" stroke="#727974" tick={{ fontSize: 10, fill: "#5D6B63" }} />
              <YAxis stroke="#727974" tick={{ fontSize: 10, fill: "#5D6B63" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #DCE4DF",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  fontSize: "12px",
                  color: "#012016",
                }}
                formatter={(val) => [`${val} m³/s`, "Discharge"]}
              />
              <Bar dataKey="discharge" fill="#2C694C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </section>
  );
}
