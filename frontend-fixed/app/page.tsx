"use client";
/* eslint-disable */

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { 
  MapPin, 
  Search, 
  ShieldCheck, 
  Navigation, 
  LayoutDashboard, 
  Map, 
  Waves, 
  Building2, 
  AlertTriangle,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  Bell,
  Smartphone
} from "lucide-react";

// Real-time Telemetry Engine & Stream Bar
import { useRealtimeTelemetry } from "@/hooks/useRealtimeTelemetry";
import RealtimeStreamBar from "@/components/RealtimeStreamBar";

// Stitch Design System Components
import AuthorityHeader from "@/components/AuthorityHeader";
import ThreatKPIBar from "@/components/ThreatKPIBar";
import HazardTelemetryGrid from "@/components/HazardTelemetryGrid";
import DistrictInspector from "@/components/DistrictInspector";
import EmergencyAlertCenter from "@/components/EmergencyAlertCenter";
import BottomNav from "@/components/BottomNav";

// Existing Intel & Features
import BeautifulWeather from "@/components/BeautifulWeather";
import { ForecastDisaster, TrendChart } from "@/components/RaincloudFeatures";
import DynamicBackground from "@/components/DynamicBackground";
import DistrictRiskMatrix from "@/components/DistrictRiskMatrix";
import SitRepModal from "@/components/SitRepModal";
import SatelliteSignals from "@/components/SatelliteSignals";
import OperationalSignals from "@/components/OperationalSignals";
import HydrologicalIntelligence from "@/components/HydrologicalIntelligence";
import GoogleDisasterSearch from "@/components/GoogleDisasterSearch";
import HimAlertChatbot from "@/components/HimAlertChatbot";

// PPT Showcase & Mobile Live Stream Modules
import MountainGroundWetnessSimulator from "@/components/MountainGroundWetnessSimulator";
import CitizenTwilioAlertModal from "@/components/CitizenTwilioAlertModal";
import PhoneConnectModal from "@/components/PhoneConnectModal";

// Dynamic map to avoid SSR Leaflet window errors
const RiskMap = dynamic(() => import("@/components/RiskMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[520px] items-center justify-center bg-[#F7FAF8] border border-[#DCE4DF] text-[#5D6B63] rounded-xl font-sans">
      <span className="flex items-center gap-2.5 font-medium text-xs">
        <span className="animate-spin h-4 w-4 border-2 border-[#2C694C] border-t-transparent rounded-full"></span>
        Acquiring GIS Multispectral Overlays & Terrain Radar...
      </span>
    </div>
  ),
});

const POPULAR_LOCATIONS = [
  { name: "Dharamshala", lat: 32.219, lon: 76.3234 },
  { name: "Mandi", lat: 31.708, lon: 76.932 },
  { name: "Kullu", lat: 31.957, lon: 77.109 },
  { name: "Shimla", lat: 31.104, lon: 77.173 },
  { name: "Chamba", lat: 32.554, lon: 76.126 },
  { name: "Manali", lat: 32.239, lon: 77.188 },
];

export default function Home() {
  const [globalLocation, setGlobalLocation] = useState({
    name: "Dharamshala",
    lat: 32.219,
    lon: 76.3234,
  });

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSitRepOpen, setIsSitRepOpen] = useState(false);
  const [isTwilioModalOpen, setIsTwilioModalOpen] = useState(false);
  const [isPhoneConnectOpen, setIsPhoneConnectOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string | null>(null);
  const [mapCenterTarget, setMapCenterTarget] = useState<{ lat: number; lon: number; zoom?: number; name?: string } | null>(null);
  const [smsPhone, setSmsPhone] = useState("");
  const [smsSubscribed, setSmsSubscribed] = useState(false);

  // 1-SECOND BUFFERED REAL-TIME TELEMETRY STREAM
  const {
    risk,
    weather,
    alerts,
    riverData,
    loading,
    isPaused,
    packet,
    sparklines,
    metricDeltas,
    togglePause,
    syncNow,
  } = useRealtimeTelemetry({
    location: globalLocation,
    enabled: true,
  });

  // Dynamic basin and river discharge detection based on current location
  const riverLookupName = globalLocation.name.toLowerCase();
  const riverBasinName =
    riverLookupName.includes("chamba") ? "RAVI BASIN" :
    (riverLookupName.includes("shimla") || riverLookupName.includes("bilaspur") || riverLookupName.includes("kinnaur") || riverLookupName.includes("solan")) ? "SUTLEJ BASIN" :
    (riverLookupName.includes("sirmaur")) ? "GIRI BASIN" :
    (riverLookupName.includes("lahaul") || riverLookupName.includes("spiti")) ? "CHENAB BASIN" :
    "BEAS BASIN";

  const matchingRiver = riverData ? (
    riverData[globalLocation.name] ||
    riverData[globalLocation.name.split(" ")[0]] ||
    Object.values(riverData).find((r: any) => r?.location && riverLookupName.includes(String(r.location).toLowerCase()))
  ) : null;

  const currentRiverDischarge = matchingRiver?.water_level !== undefined && matchingRiver?.water_level !== null
    ? Number(matchingRiver.water_level)
    : Number(risk?.inputs?.water_level ?? metricDeltas.riverDischarge ?? 2.1);

  const liveSoilMoistureVal = risk?.inputs?.soil_moisture ?? (weather?.current?.soil_moisture ?? (metricDeltas.soilMoisturePct / 100));
  const liveSoilMoisturePct = Math.round(liveSoilMoistureVal * 100);

  const rainNext24hVal = Number(weather?.forecast?.rainfall_next_24h ?? weather?.current?.rain ?? 0.0);
  const currentRainRate = Number(weather?.current?.rain ?? weather?.current?.precipitation ?? metricDeltas.rainRate ?? 0.0);

  // Search autocomplete
  useEffect(() => {
    if (searchQuery.length > 2) {
      const delayFn = setTimeout(async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/locations/search?query=${searchQuery}`
          );
          const data = await res.json();
          setSearchResults(data.results || []);
        } catch (e) {}
      }, 350);
      return () => clearTimeout(delayFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Handle hash changes if user navigated via anchors
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && ["overview", "map", "rivers", "districts", "alerts"].includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleCenterMapOnTown = (town: string, lat: number, lon: number) => {
    setGlobalLocation({ name: town, lat, lon });
    setMapCenterTarget({ lat, lon, zoom: 12, name: town });
    setActiveTab("map");
    setTimeout(() => {
      document.getElementById("risk-map-container")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleTabSelect = (tab: string) => {
    if (tab === "simulator") {
      setActiveTab("overview");
      setTimeout(() => {
        document.getElementById("rain-simulator")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } else {
      setActiveTab(tab);
    }
  };

  const handleSelectDistrictFromTable = (districtName: string) => {
    const match = POPULAR_LOCATIONS.find((l) =>
      districtName.toLowerCase().includes(l.name.toLowerCase())
    );
    if (match) {
      setGlobalLocation(match);
      setMapCenterTarget({ lat: match.lat, lon: match.lon, zoom: 12, name: match.name });
    } else {
      setGlobalLocation((prev) => ({ ...prev, name: districtName }));
    }
    // Switch to command view to inspect
    setActiveTab("overview");
  };

  return (
    <DynamicBackground
      mode="authority"
      condition={
        (weather as any)?.current?.rain > 0
          ? "Rain"
          : (weather as any)?.current?.cloud_cover > 50
          ? "Cloudy"
          : "Sunny"
      }
    >
      <main className="dashboard-shell min-h-screen text-[#181C1B] font-sans selection:bg-[#2C694C]/30 pb-28">
        
        {/* 1. Official SDMA Authority Header */}
        <AuthorityHeader
          onOpenSitRep={() => setIsSitRepOpen(true)}
          onOpenPhoneConnect={() => setIsPhoneConnectOpen(true)}
          onOpenTwilio={() => setIsTwilioModalOpen(true)}
          activeTab={activeTab}
          onSelectTab={handleTabSelect}
          onRefresh={syncNow}
          alertCount={alerts.length}
        />

        {/* 2. Real-time Telemetry Stream Bar (1.0s Buffer Ticker) */}
        <RealtimeStreamBar
          packet={packet}
          isPaused={isPaused}
          onTogglePause={togglePause}
          onSyncNow={syncNow}
          metricDeltas={metricDeltas}
        />

        <div className="max-w-[92rem] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">

          {/* Location Quick Selector & Search Strip */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#DCE4DF]">
            
            {/* Sector Coordinates */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#2C694C]/10 border border-[#2C694C]/20 text-[#2C694C] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#5D6B63] uppercase tracking-wider font-bold">
                    Target Sector
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#2C694C]/15 text-[#2C694C] text-[9px] font-bold uppercase font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C694C] animate-ping"></span>
                    1.0s STREAM
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base sm:text-lg font-bold text-[#012016]">
                    {globalLocation.name}, HP
                  </span>
                  <span className="text-xs font-mono text-[#5D6B63]">
                    ({globalLocation.lat.toFixed(3)}°N, {globalLocation.lon.toFixed(3)}°E)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick District Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
              <span className="text-[11px] font-bold text-[#5D6B63] uppercase font-mono mr-1 shrink-0 hidden sm:inline">
                Sectors:
              </span>
              {POPULAR_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => setGlobalLocation(loc)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all shrink-0 ${
                    globalLocation.name === loc.name
                      ? "bg-[#012016] text-white shadow-sm font-bold"
                      : "bg-[#F1F4F2] text-[#5D6B63] hover:text-[#012016] hover:bg-[#E6E9E7]"
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>

            {/* City Autocomplete & GPS Action */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5D6B63]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Tehsil / District..."
                  className="w-full bg-[#F7FAF8] border border-[#DCE4DF] text-[#012016] placeholder-[#5D6B63] text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#2C694C] transition-colors"
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-1.5 w-full bg-white border border-[#DCE4DF] rounded-xl overflow-hidden shadow-2xl z-50">
                    {searchResults.map((res: any, idx: number) => (
                      <div
                        key={idx}
                        className="px-4 py-2 hover:bg-[#F1F4F2] cursor-pointer text-xs flex justify-between border-b border-[#DCE4DF]/50 last:border-0"
                        onClick={() => {
                          setGlobalLocation({
                            name: res.name,
                            lat: res.latitude,
                            lon: res.longitude,
                          });
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                      >
                        <span className="font-bold text-[#012016]">{res.name}</span>
                        <span className="text-[#5D6B63]">{res.admin1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/local"
                className="flex items-center gap-1.5 px-3 py-2 bg-[#012016] hover:bg-[#17352A] text-white text-xs font-bold rounded-lg transition-all shadow-sm shrink-0"
              >
                <Navigation className="w-3.5 h-3.5 text-[#B0F1CB]" />
                <span className="hidden sm:inline">Citizen GPS</span>
              </Link>
            </div>
          </div>

          
          {/* Emergency SMS Alerts Card (Screenshot Image 3 Match) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DCE4DF] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-[#012016]">Emergency SMS Alerts</h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold uppercase">
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-[#5D6B63] mt-0.5">
                  Receive instant Twilio SMS notifications when the AI detects a <strong className="text-blue-700">CRITICAL</strong> threat in your jurisdiction.
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsTwilioModalOpen(true);
              }}
              className="flex items-center gap-2 w-full sm:w-auto flex-wrap"
            >
              <div className="relative flex-1 sm:w-56">
                <Smartphone className="w-4 h-4 text-[#5D6B63] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  placeholder="98160 XXXXX"
                  className="w-full bg-[#F7FAF8] border border-[#DCE4DF] text-[#012016] placeholder-[#5D6B63] text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#2C694C] font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Twilio SMS Alert</span>
              </button>
            </form>
          </div>


          {/* Location Hero Banner (Screenshot Image 3 Match) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#DCE4DF] shadow-sm flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 className="text-xl sm:text-2xl font-black text-[#012016] tracking-tight">
                    {globalLocation.name.toLowerCase().includes("valley") || globalLocation.name.toLowerCase().includes("hills")
                      ? globalLocation.name
                      : globalLocation.name === "Dharamshala"
                      ? "Dharamshala (Kangra Valley)"
                      : globalLocation.name === "Mandi"
                      ? "Mandi (Beas River Gorge)"
                      : globalLocation.name === "Kullu & Manali"
                      ? "Kullu & Manali (Upper Beas)"
                      : globalLocation.name === "Shimla"
                      ? "Shimla Hills"
                      : globalLocation.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EBF0ED] text-[#2C694C] text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C694C]"></span>
                    ALL SYSTEMS OPERATIONAL
                  </span>
                </div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-black text-[#012016] tracking-tight">
                    {Math.round(weather?.current?.temperature ?? (metricDeltas.temp ?? 24))}°C
                  </span>
                  <span className="text-base sm:text-lg font-bold text-[#012016]">
                    {currentRainRate > 2
                      ? "Heavy Rain Downpour"
                      : currentRainRate > 0
                      ? "Light Rain Showers"
                      : (weather?.current?.cloud_cover && weather.current.cloud_cover > 50)
                      ? "Overcast Clouds"
                      : "Clear Mountain Skies"}
                  </span>
                </div>
                <p className="text-xs text-[#5D6B63] mt-1 font-medium">
                  Feels like {Math.round((weather?.current?.temperature ?? 24) - 1)}°C • Wind {Math.round(weather?.current?.wind_speed ?? 6)} km/h • Humidity {Math.round(weather?.current?.humidity ?? 81)}%
                </p>
              </div>

              {/* 3 Telemetry Chips */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#DCE4DF] text-center min-w-[95px]">
                  <span className="text-[9px] font-bold text-[#5D6B63] uppercase tracking-wider block">
                    GROUND WETNESS
                  </span>
                  <span className="text-lg sm:text-xl font-black text-[#012016] font-mono my-0.5 block">
                    {liveSoilMoisturePct}%
                  </span>
                  <span className={`text-[10px] font-semibold block ${
                    liveSoilMoistureVal > 0.75
                      ? "text-[#BA1A1A]"
                      : liveSoilMoistureVal > 0.6
                      ? "text-[#ED8936]"
                      : "text-[#2C694C]"
                  }`}>
                    {liveSoilMoistureVal > 0.75
                      ? "High Saturation"
                      : liveSoilMoistureVal > 0.6
                      ? "Saturated Ground"
                      : "Absorbing Well"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#DCE4DF] text-center min-w-[95px]">
                  <span className="text-[9px] font-bold text-[#5D6B63] uppercase tracking-wider block">
                    {riverBasinName.split(" ")[0]} FLOW
                  </span>
                  <span className="text-lg sm:text-xl font-black text-[#012016] font-mono my-0.5 block">
                    {currentRiverDischarge < 10 ? currentRiverDischarge.toFixed(1) : Math.round(currentRiverDischarge)} <span className="text-[11px] font-normal">m³/s</span>
                  </span>
                  <span className={`text-[10px] font-semibold block ${currentRiverDischarge > 100 ? "text-[#BA1A1A]" : "text-blue-600"}`}>
                    {currentRiverDischarge > 100 ? "Elevated Flow" : "Active Discharge"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#DCE4DF] text-center min-w-[95px]">
                  <span className="text-[9px] font-bold text-[#5D6B63] uppercase tracking-wider block">
                    24H RAIN
                  </span>
                  <span className="text-lg sm:text-xl font-black text-[#012016] font-mono my-0.5 block">
                    {rainNext24hVal.toFixed(1)} <span className="text-[11px] font-normal">mm</span>
                  </span>
                  <span className={`text-[10px] font-semibold block ${rainNext24hVal > 20 ? "text-[#BA1A1A]" : rainNext24hVal > 2 ? "text-[#ED8936]" : "text-[#2C694C]"}`}>
                    {rainNext24hVal > 20 ? "Downpour Active" : rainNext24hVal > 2 ? "Light Showers" : "Clear / No Rain"}
                  </span>
                </div>
              </div>
            </div>

            {/* Info bar below */}
            <div className="p-3 rounded-xl bg-[#F7FAF8] border border-[#DCE4DF]/70 text-xs text-[#414845] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold">ⓘ</span>
                <span>
                  {risk?.overall === "HIGH" ? (
                    <span>
                      <strong className="text-[#BA1A1A]">Critical Alert:</strong> Elevated runoff detected. Exercise high caution along riverbanks and steep mountain corridors.
                    </span>
                  ) : (
                    <span>
                      <strong>Safe & Calm:</strong> Mountain slopes have healthy absorption capacity ({liveSoilMoisturePct}% wet). Roads are clear and safe for travel with standard mountain driving care.
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("risk-map-container")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="p-1.5 rounded-lg bg-white border border-[#DCE4DF] hover:bg-[#F1F4F2] text-[#012016] transition-colors"
                  title="Center on Map"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#2C694C]" />
                </button>
              </div>
            </div>
          </div>

          {/* Feature View Navigation Tabs (Mobile & Tablet) */}
          <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#DCE4DF] no-scrollbar">
            {[
              { id: "overview", label: "Command", icon: LayoutDashboard },
              { id: "map", label: "GIS Radar", icon: Map },
              { id: "rivers", label: "Basins", icon: Waves },
              { id: "districts", label: "Districts", icon: Building2 },
              { id: "alerts", label: "Alerts", icon: AlertTriangle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                    isActive
                      ? "bg-[#012016] text-white shadow-sm"
                      : "bg-white text-[#5D6B63] border border-[#DCE4DF]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ============================================================
              TAB 1: COMMAND HUB (EXECUTIVE DUAL-COLUMN VIEW)
          ============================================================ */}
          {activeTab === "overview" && (
            <div className="space-y-6">

              {/* 2-Column Weather & Ground Wetness Section (Image 4 & 5 Match) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <BeautifulWeather
                  weather={weather}
                  weatherLoading={loading}
                  locationName={globalLocation.name}
                />
                <MountainGroundWetnessSimulator
                  locationName={globalLocation.name}
                  risk={risk}
                  weather={weather}
                  onOpenChatbot={(prompt) => {
                    if (prompt) setInitialChatPrompt(prompt);
                    setIsChatOpen(true);
                  }}
                />
              </div>

              {/* GIS Multispectral Threat Map */}
              <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#DCE4DF] flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#012016] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#2C694C]" />
                      Multispectral Threat & Terrain GIS
                    </h3>
                    <p className="text-xs text-[#5D6B63] mt-0.5">
                      High-resolution satellite topography, hazard boundaries & live automated sensors.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#2C694C] bg-[#2C694C]/10 px-2 py-0.5 rounded font-bold uppercase">
                      12 Basins Synced
                    </span>
                    <button
                      onClick={() => setActiveTab("map")}
                      className="text-xs font-bold text-[#2C694C] hover:underline flex items-center gap-0.5"
                    >
                      <span>Full Radar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div id="risk-map-container" className="w-full h-[520px] rounded-xl overflow-hidden border border-[#DCE4DF] bg-[#F7FAF8]">
                  <RiskMap
                    centerTarget={mapCenterTarget}
                    onSelectLocation={(loc) => {
                      setGlobalLocation({ name: loc.name, lat: loc.lat, lon: loc.lon });
                      setMapCenterTarget({ lat: loc.lat, lon: loc.lon, zoom: 12, name: loc.name });
                    }}
                  />
                </div>
              </section>

              {/* Full District Vulnerability Matrix */}
              <DistrictRiskMatrix
                onSelectDistrict={handleSelectDistrictFromTable}
                onCenterMap={handleCenterMapOnTown}
              />

              {/* 4-Card Hazard Telemetry Matrices (Dynamic 1-Second Sparklines) */}
              <HazardTelemetryGrid
                risk={risk}
                weather={weather}
                sparklines={sparklines}
                metricDeltas={metricDeltas}
              />

              {/* Emergency Alert Center */}
              <EmergencyAlertCenter
                onOpenSitRep={() => setIsSitRepOpen(true)}
                onOpenTwilio={() => setIsTwilioModalOpen(true)}
              />

              {/* Real-time Field Intelligence & Google CSE */}
              <GoogleDisasterSearch />

            </div>
          )}

          {/* ============================================================
              TAB 2: GIS RADAR & SPATIAL TERRAIN
          ============================================================ */}
          {activeTab === "map" && (
            <div className="space-y-6">
              <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#DCE4DF] flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCE4DF] pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#012016] flex items-center gap-2">
                      <Map className="w-5 h-5 text-[#2C694C]" />
                      Full Himachal Geospatial Multispectral Radar
                    </h3>
                    <p className="text-xs text-[#5D6B63] mt-0.5">
                      Toggle satellite topography, FIRMS thermal anomalies, landslide hazard indices & river corridors.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#2C694C] bg-[#2C694C]/10 px-2 py-1 rounded font-bold uppercase">
                      ● 1.0s SENSOR SYNC
                    </span>
                  </div>
                </div>

                <div className="w-full h-[640px] rounded-xl overflow-hidden border border-[#DCE4DF] bg-[#F7FAF8]">
                  <RiskMap
                    centerTarget={mapCenterTarget}
                    onSelectLocation={(loc) => {
                      setGlobalLocation({ name: loc.name, lat: loc.lat, lon: loc.lon });
                      setMapCenterTarget({ lat: loc.lat, lon: loc.lon, zoom: 12, name: loc.name });
                    }}
                  />
                </div>
              </section>

              {/* Inspector underneath the full map */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DistrictInspector
                  location={{
                    name: globalLocation.name,
                    latitude: globalLocation.lat,
                    longitude: globalLocation.lon,
                    flash_flood: risk.flash_flood,
                    landslide: risk.landslide,
                    extreme_rainfall: risk.extreme_rainfall,
                    overall: risk.overall,
                    government_rainfall: metricDeltas.rainRate ?? risk.government_rainfall,
                  }}
                  onOpenSitRep={() => setIsSitRepOpen(true)}
                  onViewCatchments={() => setActiveTab("rivers")}
                />
                <SatelliteSignals location={globalLocation} />
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 3: HYDROLOGICAL RIVER BASINS
          ============================================================ */}
          {activeTab === "rivers" && (
            <div className="space-y-6">
              <HydrologicalIntelligence
                locationName={globalLocation.name}
                weather={weather}
              />
              <OperationalSignals />
            </div>
          )}

          {/* ============================================================
              TAB 4: ALL 12 DISTRICTS
          ============================================================ */}
          {activeTab === "districts" && (
            <div className="space-y-6">
              <DistrictRiskMatrix
                onSelectDistrict={handleSelectDistrictFromTable}
                onCenterMap={handleCenterMapOnTown}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DistrictInspector
                  location={{
                    name: globalLocation.name,
                    latitude: globalLocation.lat,
                    longitude: globalLocation.lon,
                    flash_flood: risk.flash_flood,
                    landslide: risk.landslide,
                    extreme_rainfall: risk.extreme_rainfall,
                    overall: risk.overall,
                    government_rainfall: metricDeltas.rainRate ?? risk.government_rainfall,
                  }}
                  onOpenSitRep={() => setIsSitRepOpen(true)}
                  onViewCatchments={() => setActiveTab("rivers")}
                />
                <BeautifulWeather
                  weather={weather}
                  weatherLoading={loading}
                  locationName={globalLocation.name}
                />
              </div>
            </div>
          )}

          {/* ============================================================
              TAB 5: EMERGENCY ALERTS & CITIZEN SOS
          ============================================================ */}
          {activeTab === "alerts" && (
            <div className="space-y-6">
              <EmergencyAlertCenter
                onOpenSitRep={() => setIsSitRepOpen(true)}
                onOpenTwilio={() => setIsTwilioModalOpen(true)}
              />
              <div className="p-5 rounded-xl bg-white border border-[#DCE4DF] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-[#012016] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#2C694C]" />
                    <span>Public Citizen Safety & Shelter Route</span>
                  </h4>
                  <p className="text-xs text-[#5D6B63] mt-1">
                    Guidance for citizens and tourists: Nearest safe relief shelters, offline survival guide & instant 112 emergency beacon.
                  </p>
                </div>
                <Link
                  href="/local"
                  className="px-4 py-2.5 bg-[#012016] hover:bg-[#17352A] text-white text-xs font-bold rounded-lg transition-all shadow-sm shrink-0 flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#B0F1CB]" />
                  <span>Launch Citizen Safety View</span>
                </Link>
              </div>

              {/* Real-time Field Intelligence & Google CSE */}
              <GoogleDisasterSearch />
            </div>
          )}

        </div>

        {/* 6. Situation Report (SitRep) Modal */}
        <SitRepModal isOpen={isSitRepOpen} onClose={() => setIsSitRepOpen(false)} />

        {/* 6.1 Twilio SMS Geofenced Alert Modal (PPT Slide 9) */}
        <CitizenTwilioAlertModal
          isOpen={isTwilioModalOpen}
          onClose={() => setIsTwilioModalOpen(false)}
          defaultTown={globalLocation.name}
          initialPhone={smsPhone}
        />

        {/* 6.2 Phone Port QR Code Connect Modal */}
        <PhoneConnectModal
          isOpen={isPhoneConnectOpen}
          onClose={() => setIsPhoneConnectOpen(false)}
        />

        {/* 7. Tactical Bottom Navigation Dock */}
        <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

        {/* 8. HimAlert AI Disaster Copilot Chatbot */}
        <HimAlertChatbot
          currentLocation={globalLocation.name}
          onSelectTab={(tab) => setActiveTab(tab)}
          onSelectLocation={handleSelectDistrictFromTable}
          isOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
          initialPrompt={initialChatPrompt}
          onClearInitialPrompt={() => setInitialChatPrompt(null)}
        />
      </main>
    </DynamicBackground>
  );
}
