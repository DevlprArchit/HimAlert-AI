"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Shield, 
  Search, 
  Building2, 
  MapPin, 
  ArrowUpRight,
  Filter
} from "lucide-react";

export interface DistrictRisk {
  district: string;
  hazardType: "Landslide" | "Flash Flood" | "Cloudburst" | "River Breach" | "Normal";
  rain24h: number; // in mm
  soilSaturation: number; // in %
  riskLevel: "RED" | "ORANGE" | "YELLOW" | "GREEN";
  actionRequired: string;
  lastUpdated: string;
}

const ALL_12_DISTRICTS: DistrictRisk[] = [
  {
    district: "Kangra (Dharamshala)",
    hazardType: "Cloudburst",
    rain24h: 92.4,
    soilSaturation: 86,
    riskLevel: "RED",
    actionRequired: "Deploy NDRF along Gaj & Manjhi rivulets; restrict uphill tourist movement.",
    lastUpdated: "1s ago",
  },
  {
    district: "Mandi",
    hazardType: "Flash Flood",
    rain24h: 84.5,
    soilSaturation: 89,
    riskLevel: "RED",
    actionRequired: "Evacuate low-lying river banks near Pandoh; close NH-21 bypass.",
    lastUpdated: "1s ago",
  },
  {
    district: "Kullu",
    hazardType: "Flash Flood",
    rain24h: 76.2,
    soilSaturation: 82,
    riskLevel: "RED",
    actionRequired: "Sound sirens across Beas floodplains; suspend rafting & river camping.",
    lastUpdated: "2s ago",
  },
  {
    district: "Shimla",
    hazardType: "Landslide",
    rain24h: 58.0,
    soilSaturation: 74,
    riskLevel: "ORANGE",
    actionRequired: "Divert heavy vehicles on NH-5; keep JCB earthmovers stationed at Dhalli.",
    lastUpdated: "2s ago",
  },
  {
    district: "Chamba",
    hazardType: "Landslide",
    rain24h: 64.2,
    soilSaturation: 76,
    riskLevel: "ORANGE",
    actionRequired: "Monitor Ravi tributary culverts and landslide prone stretches near Bharmour.",
    lastUpdated: "3s ago",
  },
  {
    district: "Solan",
    hazardType: "Landslide",
    rain24h: 44.0,
    soilSaturation: 62,
    riskLevel: "YELLOW",
    actionRequired: "Inspect retaining walls along Kalka-Shimla express four-lane corridor.",
    lastUpdated: "4s ago",
  },
  {
    district: "Sirmaur",
    hazardType: "River Breach",
    rain24h: 41.5,
    soilSaturation: 58,
    riskLevel: "YELLOW",
    actionRequired: "Monitor Giri river runoff levels; keep Paonta Sahib SDRF unit on standby.",
    lastUpdated: "4s ago",
  },
  {
    district: "Kinnaur",
    hazardType: "Landslide",
    rain24h: 31.0,
    soilSaturation: 62,
    riskLevel: "YELLOW",
    actionRequired: "Strict watch on shooting stones near Nigulsari and Urni rockfall zones.",
    lastUpdated: "5s ago",
  },
  {
    district: "Bilaspur",
    hazardType: "River Breach",
    rain24h: 34.8,
    soilSaturation: 52,
    riskLevel: "YELLOW",
    actionRequired: "Check reservoir outflow channels near Gobind Sagar basin.",
    lastUpdated: "5s ago",
  },
  {
    district: "Hamirpur",
    hazardType: "Normal",
    rain24h: 22.1,
    soilSaturation: 44,
    riskLevel: "GREEN",
    actionRequired: "Standard meteorological observation; culverts clear.",
    lastUpdated: "6s ago",
  },
  {
    district: "Una",
    hazardType: "Normal",
    rain24h: 18.6,
    soilSaturation: 38,
    riskLevel: "GREEN",
    actionRequired: "Swan river seasonal streams running within safe low banks.",
    lastUpdated: "6s ago",
  },
  {
    district: "Lahaul-Spiti",
    hazardType: "Normal",
    rain24h: 6.4,
    soilSaturation: 22,
    riskLevel: "GREEN",
    actionRequired: "Clear conditions; Rohtang & Atal Tunnel corridors open for transit.",
    lastUpdated: "7s ago",
  },
];

export default function DistrictRiskMatrix({
  onSelectDistrict,
}: {
  onSelectDistrict?: (name: string) => void;
}) {
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const filteredData = ALL_12_DISTRICTS.filter((item) => {
    const matchesFilter = filter === "ALL" || item.riskLevel === filter;
    const matchesSearch = item.district.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case "RED":
        return "bg-[#FFDAD6] text-[#93000A] border-[#BA1A1A]/30";
      case "ORANGE":
        return "bg-[#FFEAD2] text-[#9C4B00] border-[#ED8936]/40";
      case "YELLOW":
        return "bg-[#FEF3C7] text-[#8C6B12] border-[#DCAE37]/40";
      default:
        return "bg-[#EBF0ED] text-[#2C694C] border-[#2C694C]/30";
    }
  };

  return (
    <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#DCE4DF] flex flex-col gap-4">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-[#DCE4DF]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#2C694C]/10 text-[#2C694C]">
              <Building2 className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight">
              Statewide District Vulnerability Matrix
            </h2>
          </div>
          <p className="text-xs text-[#5D6B63] mt-0.5">
            Deterministic risk classification across all 12 Himachal Pradesh administrative districts.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#5D6B63]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter district..."
              className="w-full bg-[#F7FAF8] border border-[#DCE4DF] text-[#012016] placeholder-[#5D6B63] text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#2C694C]"
            />
          </div>

          {/* Level Filter Chips */}
          <div className="flex items-center gap-1 bg-[#F1F4F2] p-1 rounded-lg border border-[#DCE4DF] text-xs">
            {["ALL", "RED", "ORANGE", "YELLOW", "GREEN"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                  filter === lvl
                    ? "bg-[#012016] text-white shadow-sm"
                    : "text-[#5D6B63] hover:text-[#012016]"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View: High-Density Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-[#414845]">
          <thead className="bg-[#F7FAF8] text-[#5D6B63] font-mono text-[10px] uppercase tracking-wider border-b border-[#DCE4DF]">
            <tr>
              <th className="py-3 px-3 font-bold">District / Sector</th>
              <th className="py-3 px-3 font-bold">Primary Hazard</th>
              <th className="py-3 px-3 font-bold">24h Rainfall</th>
              <th className="py-3 px-3 font-bold">Soil Saturation</th>
              <th className="py-3 px-3 font-bold">IMD Alert Level</th>
              <th className="py-3 px-3 font-bold">SDMA Command Directive</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCE4DF]/70 font-medium">
            {filteredData.map((d, index) => (
              <tr 
                key={index} 
                onClick={() => onSelectDistrict && onSelectDistrict(d.district.split(" ")[0])}
                className="hover:bg-[#F1F4F2]/80 transition-colors cursor-pointer group"
              >
                <td className="py-3 px-3 font-bold text-[#012016]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2C694C] opacity-60 group-hover:opacity-100" />
                    <span>{d.district}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="font-semibold text-[#17352A] bg-[#EBF0ED] px-2 py-0.5 rounded text-[11px]">
                    {d.hazardType}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-[#012016]">
                  {d.rain24h} <span className="text-[#5D6B63] font-normal text-[10px]">mm</span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-[#E0E3E1] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${
                          d.soilSaturation > 80
                            ? "bg-[#BA1A1A]"
                            : d.soilSaturation > 60
                            ? "bg-[#ED8936]"
                            : "bg-[#2C694C]"
                        }`}
                        style={{ width: `${d.soilSaturation}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#012016]">{d.soilSaturation}%</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(
                      d.riskLevel
                    )}`}
                  >
                    {d.riskLevel}
                  </span>
                </td>
                <td className="py-3 px-3 text-[#181C1B] text-[11px] max-w-sm">
                  {d.actionRequired}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View: High-Impact Responsive Cards */}
      <div className="md:hidden flex flex-col gap-2.5">
        {filteredData.map((d, index) => (
          <div
            key={index}
            onClick={() => onSelectDistrict && onSelectDistrict(d.district.split(" ")[0])}
            className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#DCE4DF] flex flex-col gap-2.5 active:bg-[#F1F4F2] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#012016] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2C694C]" />
                  <span>{d.district}</span>
                </h4>
                <span className="text-[11px] text-[#5D6B63] mt-0.5 inline-block">
                  Primary Hazard: <strong className="text-[#012016]">{d.hazardType}</strong>
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(
                  d.riskLevel
                )}`}
              >
                {d.riskLevel}
              </span>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-lg border border-[#DCE4DF]/70 text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#5D6B63] uppercase font-bold">24h Rainfall</span>
                <span className="font-mono font-bold text-[#012016] text-sm">{d.rain24h} mm</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#5D6B63] uppercase font-bold">Soil Saturation</span>
                <span className="font-mono font-bold text-[#012016] text-sm">{d.soilSaturation}%</span>
              </div>
            </div>

            {/* Directive */}
            <p className="text-xs text-[#414845] leading-relaxed bg-[#FFFFFF]/60 p-2 rounded border border-[#DCE4DF]/40">
              <strong className="text-[#012016]">Directive:</strong> {d.actionRequired}
            </p>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-6 text-xs text-[#5D6B63]">
          No districts match the selected filter.
        </div>
      )}
    </section>
  );
}
