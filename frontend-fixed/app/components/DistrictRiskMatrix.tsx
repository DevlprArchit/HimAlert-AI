"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  ArrowRight,
  LayoutGrid,
  List,
  Building2,
  ExternalLink
} from "lucide-react";

export interface DistrictRisk {
  district: string;
  hazardType: "Landslide" | "Flash Flood" | "Cloudburst" | "River Breach" | "Normal";
  rain24h: number;
  soilSaturation: number;
  riskLevel: "RED" | "ORANGE" | "YELLOW" | "GREEN";
  actionRequired: string;
  lastUpdated: string;
}

export interface TownSafetyCard {
  id: string;
  name: string;
  centerName: string;
  lat: number;
  lon: number;
  statusHeadline: string;
  badgeText: "DANGER - BE CAREFUL" | "WATCH OUT" | "MINOR CAUTION" | "SAFE TO TRAVEL";
  badgeCategory: "danger" | "watch" | "caution" | "safe";
  rain24h: number;
  groundWetness: number;
  description: string;
}

const HIMACHAL_TOWN_CARDS: TownSafetyCard[] = [
  {
    id: "kullu",
    name: "Kullu & Manali",
    centerName: "Kullu",
    lat: 31.957,
    lon: 77.109,
    statusHeadline: "River Rising",
    badgeText: "DANGER - BE CAREFUL",
    badgeCategory: "danger",
    rain24h: 42,
    groundWetness: 82,
    description: "High water in Beas and Parvati rivers. Rafting suspended; avoid low-lying campgrounds.",
  },
  {
    id: "mandi",
    name: "Mandi (Beas River Gorge)",
    centerName: "Mandi",
    lat: 31.708,
    lon: 76.932,
    statusHeadline: "Flash Flood & River Surge",
    badgeText: "WATCH OUT",
    badgeCategory: "watch",
    rain24h: 34,
    groundWetness: 78,
    description: "Active river discharge monitoring along Beas gorge. Stay clear of swollen riverbanks and avoid unstable NH-21 road cuts.",
  },
  {
    id: "kangra",
    name: "Kangra Valley",
    centerName: "Kangra",
    lat: 32.099,
    lon: 76.269,
    statusHeadline: "Rain Showers",
    badgeText: "MINOR CAUTION",
    badgeCategory: "caution",
    rain24h: 12.5,
    groundWetness: 54,
    description: "Moderate rain. Roads are open, but watch out for slippery curves near mountain streams.",
  },
  {
    id: "kinnaur",
    name: "Kinnaur (Sutlej Valley)",
    centerName: "Kinnaur",
    lat: 31.584,
    lon: 78.272,
    statusHeadline: "Loose Rocks",
    badgeText: "MINOR CAUTION",
    badgeCategory: "caution",
    rain24h: 22,
    groundWetness: 61,
    description: "Watch for small falling stones near Nigulsari road cuts. Travel during daylight hours.",
  },
  {
    id: "dharamshala",
    name: "Dharamshala",
    centerName: "Dharamshala",
    lat: 32.219,
    lon: 76.323,
    statusHeadline: "Mountain Rain",
    badgeText: "SAFE TO TRAVEL",
    badgeCategory: "safe",
    rain24h: 18,
    groundWetness: 49,
    description: "Normal mountain rain. Safe for travel. Carry rain gear and keep headlights on in mist.",
  },
  {
    id: "shimla",
    name: "Shimla Hills",
    centerName: "Shimla",
    lat: 31.104,
    lon: 77.173,
    statusHeadline: "Mist & Fog",
    badgeText: "SAFE TO TRAVEL",
    badgeCategory: "safe",
    rain24h: 8,
    groundWetness: 44,
    description: "Weather is calm. Visibility is low on ridge roads due to clouds, drive carefully.",
  },
  {
    id: "chamba",
    name: "Chamba (Ravi Basin)",
    centerName: "Chamba",
    lat: 32.554,
    lon: 76.126,
    statusHeadline: "Valley Breeze",
    badgeText: "SAFE TO TRAVEL",
    badgeCategory: "safe",
    rain24h: 14,
    groundWetness: 42,
    description: "Calm conditions along Ravi basin. Safe for travel with standard mountain caution.",
  },
  {
    id: "bilaspur",
    name: "Bilaspur (Sutlej)",
    centerName: "Bilaspur",
    lat: 31.334,
    lon: 76.756,
    statusHeadline: "Normal Levels",
    badgeText: "SAFE TO TRAVEL",
    badgeCategory: "safe",
    rain24h: 6,
    groundWetness: 38,
    description: "Gobind Sagar reservoir inflow normal. Clear highway access.",
  },
  {
    id: "solan",
    name: "Solan (Kalka Corridor)",
    centerName: "Solan",
    lat: 30.904,
    lon: 77.096,
    statusHeadline: "Slippery Curves",
    badgeText: "MINOR CAUTION",
    badgeCategory: "caution",
    rain24h: 16.5,
    groundWetness: 52,
    description: "Kalka-Shimla highway four-lane corridor open; watch for minor debris near Kumarhatti.",
  },
  {
    id: "sirmaur",
    name: "Sirmaur (Giri River)",
    centerName: "Sirmaur",
    lat: 30.559,
    lon: 77.296,
    statusHeadline: "River Inflow Normal",
    badgeText: "SAFE TO TRAVEL",
    badgeCategory: "safe",
    rain24h: 14.2,
    groundWetness: 46,
    description: "Giri river catchment runoff steady. Paonta Sahib-Nahan transit clear.",
  },
  {
    id: "hamirpur",
    name: "Hamirpur (Central)",
    centerName: "Hamirpur",
    lat: 31.686,
    lon: 76.521,
    statusHeadline: "Calm Conditions",
    badgeText: "SAFE TO TRAVEL",
    badgeCategory: "safe",
    rain24h: 8.4,
    groundWetness: 40,
    description: "Low precipitation, optimal highway visibility across all central tehsils.",
  },
  {
    id: "una",
    name: "Una (Swan River)",
    centerName: "Una",
    lat: 31.468,
    lon: 76.270,
    statusHeadline: "Safe River Bed",
    badgeText: "SAFE TO TRAVEL",
    badgeCategory: "safe",
    rain24h: 9.1,
    groundWetness: 36,
    description: "Swan river seasonal streams flowing well within safe flood channel embankments.",
  },
  {
    id: "lahaul",
    name: "Lahaul & Spiti",
    centerName: "Lahaul-Spiti",
    lat: 32.571,
    lon: 77.032,
    statusHeadline: "High Mountain Transit Clear",
    badgeText: "SAFE TO TRAVEL",
    badgeCategory: "safe",
    rain24h: 4.2,
    groundWetness: 24,
    description: "Atal Tunnel North portal and Rohtang Pass open for regular vehicular transit.",
  },
];

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

interface DistrictRiskMatrixProps {
  onSelectDistrict?: (name: string) => void;
  onCenterMap?: (town: string, lat: number, lon: number) => void;
}

export default function DistrictRiskMatrix({
  onSelectDistrict,
  onCenterMap,
}: DistrictRiskMatrixProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [townFilter, setTownFilter] = useState<string>("ALL");
  const [townSort, setTownSort] = useState<"Risk" | "Rain" | "A-Z">("Risk");
  const [search, setSearch] = useState<string>("");
  const [towns, setTowns] = useState<TownSafetyCard[]>(HIMACHAL_TOWN_CARDS);

  useEffect(() => {
    let isMounted = true;
    const fetchLocationsRisk = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${baseUrl}/api/locations-risk`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const locList = Array.isArray(data) ? data : (data?.locations || []);
          if (Array.isArray(locList) && locList.length > 0 && isMounted) {
            setTowns((prev) =>
              prev.map((town) => {
                const matched = locList.find((d: any) =>
                  d.name?.toLowerCase().includes(town.centerName.toLowerCase()) ||
                  town.centerName.toLowerCase().includes(d.name?.toLowerCase())
                );
                if (matched) {
                  const rainVal = Number(
                    matched.government_rainfall ??
                    (matched.inputs?.rainfall_next_24h ?? (matched.extreme_rainfall ? matched.extreme_rainfall * 0.45 : 0.0))
                  );
                  const wetVal = Number(
                    matched.inputs?.soil_moisture !== undefined
                      ? Math.round(matched.inputs.soil_moisture * 100)
                      : (matched.landslide ? Math.round(matched.landslide * 0.95) : 35)
                  );

                  let badgeText = town.badgeText;
                  let badgeCategory = town.badgeCategory;
                  if (matched.overall === "CRITICAL" || matched.flash_flood > 70) {
                    badgeText = "DANGER - BE CAREFUL";
                    badgeCategory = "danger";
                  } else if (matched.overall === "HIGH" || matched.flash_flood > 45) {
                    badgeText = "WATCH OUT";
                    badgeCategory = "watch";
                  } else if (matched.overall === "MODERATE" || matched.overall === "ELEVATED") {
                    badgeText = "MINOR CAUTION";
                    badgeCategory = "caution";
                  } else {
                    badgeText = "SAFE TO TRAVEL";
                    badgeCategory = "safe";
                  }

                  return {
                    ...town,
                    rain24h: +(rainVal.toFixed(1)),
                    groundWetness: Math.min(99, Math.max(15, Math.round(wetVal))),
                    badgeText,
                    badgeCategory,
                  };
                }
                return town;
              })
            );
          }
        }
      } catch (err) {
        // Fallback gracefully without breaking UI
      }
    };

    fetchLocationsRisk();
    const interval = setInterval(fetchLocationsRisk, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleCenter = (town: TownSafetyCard) => {
    if (onCenterMap) {
      onCenterMap(town.centerName, town.lat, town.lon);
    } else if (onSelectDistrict) {
      onSelectDistrict(town.centerName);
    }
    // Smooth scroll to map container
    const mapEl = document.getElementById("risk-map-container") || document.querySelector(".leaflet-container");
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const getTownBadgeClass = (category: string) => {
    switch (category) {
      case "danger":
        return "bg-[#E5533D] text-white";
      case "watch":
        return "bg-[#FDE8B3] text-[#9C4B00]";
      case "caution":
        return "bg-[#E2E8F0] text-[#334155]";
      case "safe":
      default:
        return "bg-[#D1F2D9] text-[#1E4620]";
    }
  };

  const filteredTowns = towns.filter((t) => {
    const matchesFilter =
      townFilter === "ALL" ||
      (townFilter === "danger" && t.badgeCategory === "danger") ||
      (townFilter === "watch" && t.badgeCategory === "watch") ||
      (townFilter === "safe" && (t.badgeCategory === "safe" || t.badgeCategory === "caution"));
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.centerName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (townSort === "Rain") return b.rain24h - a.rain24h;
    if (townSort === "A-Z") return a.name.localeCompare(b.name);
    const order: Record<string, number> = { danger: 4, watch: 3, caution: 2, safe: 1 };
    return (order[b.badgeCategory] || 0) - (order[a.badgeCategory] || 0);
  });

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-[#DCE4DF] flex flex-col gap-5">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE4DF]/70">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg sm:text-xl font-black text-[#012016] tracking-tight">
              How Safe Is Each Area in Himachal Right Now?
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#EBF0ED] text-[#2C694C] text-[10px] font-mono font-bold uppercase">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-[#5D6B63] mt-1 font-medium">
            Click any town to center the map and load its live weather and safety telemetry
          </p>
        </div>

        {/* View Mode Switcher (List vs Grid) */}
        <div className="flex items-center gap-1 bg-[#F1F4F2] p-1 rounded-lg border border-[#DCE4DF] shrink-0 self-start sm:self-center">
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === "table" ? "bg-white text-[#012016] shadow-sm" : "text-[#5D6B63] hover:text-[#012016]"
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === "grid" ? "bg-[#012016] text-white shadow-sm" : "text-[#5D6B63] hover:text-[#012016]"
            }`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5D6B63]">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search town: Mandi, Kullu, Shimla..."
            className="w-full bg-[#F7FAF8] border border-[#DCE4DF] text-[#012016] placeholder-[#5D6B63] text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-[#2C694C] transition-colors"
          />
        </div>

        {/* Filter Chips & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#F7FAF8] p-1 rounded-xl border border-[#DCE4DF] text-xs">
            {[
              { id: "ALL", label: `All Towns (${HIMACHAL_TOWN_CARDS.length})` },
              { id: "danger", label: "Danger", color: "text-[#BA1A1A]" },
              { id: "watch", label: "Watch Out", color: "text-[#9C4B00]" },
              { id: "safe", label: "Safe", color: "text-[#2C694C]" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTownFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  townFilter === f.id
                    ? "bg-[#012016] text-white shadow-sm"
                    : `${f.color || "text-[#5D6B63]"} hover:text-[#012016]`
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort Chips */}
          <div className="flex items-center gap-1 text-xs text-[#5D6B63] pl-2 font-mono">
            <span className="font-bold text-[11px] text-[#012016]">Sort:</span>
            {(["Risk", "Rain", "A-Z"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setTownSort(s)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  townSort === s ? "bg-[#012016] text-white shadow-xs" : "hover:text-[#012016]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Card Grid View (Image 1 Layout) */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTowns.map((town) => (
            <div
              key={town.id}
              className="bg-white border border-[#DCE4DF] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all hover:border-[#2C694C]/40 group"
            >
              <div>
                {/* Card Header: Town + Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm sm:text-base font-black text-[#012016] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#2C694C] shrink-0" />
                    <span>{town.name}</span>
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${getTownBadgeClass(
                      town.badgeCategory
                    )}`}
                  >
                    {town.badgeText}
                  </span>
                </div>

                {/* Sub-headline */}
                <h4 className="text-xs font-bold text-[#17352A] mb-3">
                  {town.statusHeadline}
                </h4>

                {/* Metrics: 24h Rain & Ground Wetness */}
                <div className="grid grid-cols-2 gap-3 py-2 px-3 bg-[#F7FAF8] rounded-xl border border-[#DCE4DF]/70 mb-3">
                  <div>
                    <span className="text-[10px] text-[#5D6B63] font-mono block">24h Rain</span>
                    <span className="text-sm font-black text-[#012016] font-mono">
                      {town.rain24h} mm
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5D6B63] font-mono block">Ground Wetness</span>
                    <span className={`text-sm font-black font-mono ${town.groundWetness > 70 ? "text-blue-600" : "text-[#2C694C]"}`}>
                      {town.groundWetness}%
                    </span>
                  </div>
                </div>

                {/* Field Description */}
                <p className="text-xs text-[#414845] leading-relaxed mb-4">
                  {town.description}
                </p>
              </div>

              {/* Action: Center Map on Town */}
              <div className="pt-2 border-t border-[#DCE4DF]/60 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleCenter(town)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Center Map on {town.centerName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredTowns.length === 0 && (
            <div className="col-span-full text-center py-10 text-xs text-[#5D6B63]">
              No towns match your search or filter.
            </div>
          )}
        </div>
      )}

      {/* 4. Table Matrix View */}
      {viewMode === "table" && (
        <div className="overflow-x-auto rounded-xl border border-[#DCE4DF]">
          <table className="w-full text-left text-xs text-[#414845]">
            <thead className="bg-[#F7FAF8] text-[#5D6B63] font-mono text-[10px] uppercase tracking-wider border-b border-[#DCE4DF]">
              <tr>
                <th className="py-3 px-3.5 font-bold">District / Town</th>
                <th className="py-3 px-3 font-bold">Primary Hazard</th>
                <th className="py-3 px-3 font-bold">24h Rain</th>
                <th className="py-3 px-3 font-bold">Soil Saturation</th>
                <th className="py-3 px-3 font-bold">Alert Level</th>
                <th className="py-3 px-3 font-bold">Field Directive</th>
                <th className="py-3 px-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4DF]/70 font-medium">
              {towns.map((town, idx) => {
                const riskLevel =
                  town.badgeCategory === "danger"
                    ? "RED"
                    : town.badgeCategory === "watch"
                    ? "ORANGE"
                    : town.badgeCategory === "caution"
                    ? "YELLOW"
                    : "GREEN";

                return (
                  <tr
                    key={town.id || idx}
                    className="hover:bg-[#F7FAF8] transition-colors group cursor-pointer"
                    onClick={() => handleCenter(town)}
                  >
                    <td className="py-3 px-3.5 font-bold text-[#012016]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#2C694C]" />
                        <span>{town.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#17352A] bg-[#EBF0ED] px-2 py-0.5 rounded text-[11px]">
                        {town.statusHeadline}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#012016]">{town.rain24h} mm</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#012016]">{town.groundWetness}%</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          riskLevel === "RED"
                            ? "bg-[#FFDAD6] text-[#BA1A1A]"
                            : riskLevel === "ORANGE"
                            ? "bg-[#FFEAD2] text-[#9C4B00]"
                            : riskLevel === "YELLOW"
                            ? "bg-[#FEF3C7] text-[#8C6B12]"
                            : "bg-[#D1F2D9] text-[#1E4620]"
                        }`}
                      >
                        {riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] max-w-sm">{town.description}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCenter(town);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                      >
                        View &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
