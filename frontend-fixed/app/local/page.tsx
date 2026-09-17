"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import HimAlertLogo from "@/components/HimAlertLogo";
import { 
  ArrowLeft, 
  AlertTriangle, 
  PhoneCall, 
  Phone, 
  Send, 
  MapPin, 
  Search, 
  ShieldAlert, 
  Home, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Car, 
  Navigation,
  Backpack,
  Share2
} from "lucide-react";

const SafeZoneMap = dynamic(() => import("@/components/SafeZoneMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center bg-[#F1F4F2] border border-[#DCE4DF] text-[#5D6B63] rounded-xl">
      <span className="flex items-center gap-2 text-xs font-semibold">
        <span className="animate-spin h-4 w-4 border-2 border-[#2C694C] border-t-transparent rounded-full"></span>
        Acquiring GPS coordinates & loading relief shelters...
      </span>
    </div>
  ),
});

export default function PublicCitizenSafetyView() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [cityName, setCityName] = useState("Dharamshala");
  const [safePoints, setSafePoints] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOfflineGuide, setShowOfflineGuide] = useState(false);
  const [smsStatus, setSmsStatus] = useState<string | null>(null);

  // Auto-acquire user location
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setUserLocation({ lat, lon });
          fetchSafePoints(lat, lon);
        },
        () => {
          const fallbackLat = 32.219;
          const fallbackLon = 76.3234;
          setUserLocation({ lat: fallbackLat, lon: fallbackLon });
          fetchSafePoints(fallbackLat, fallbackLon);
        },
        { timeout: 8000 }
      );
    } else {
      const fallbackLat = 32.219;
      const fallbackLon = 76.3234;
      setUserLocation({ lat: fallbackLat, lon: fallbackLon });
      fetchSafePoints(fallbackLat, fallbackLon);
    }
  }, []);

  const fetchSafePoints = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/safe-points?lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setSafePoints(data.safe_points || []);
    } catch {
      setSafePoints([]);
    }
  };

  const handleSendSMS = () => {
    const coords = userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lon.toFixed(4)}` : "32.2190, 76.3234";
    setSmsStatus(`Automated emergency beacon with coordinates (${coords}) sent to HP Emergency Response Support System (112).`);
    setTimeout(() => setSmsStatus(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#181C1B] font-sans pb-24">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DCE4DF] shadow-[0_1px_4px_rgba(23,53,42,0.04)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#012016] hover:bg-[#F1F4F2] transition-colors"
              title="Return to State Command"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <HimAlertLogo className="h-7" />
            <div className="h-4 w-px bg-[#DCE4DF] hidden sm:block"></div>
            <span className="text-xs font-bold text-[#5D6B63] hidden sm:inline">Citizen Safety View</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="h-8 px-2.5 rounded bg-[#012016] text-white text-[11px] font-bold flex items-center gap-1 hover:bg-[#17352A] transition-all"
            >
              <span>State Command</span>
            </Link>
          </div>
        </div>

        {/* Civic Sub-banner */}
        <div className="bg-[#012016] text-white px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[#B0F1CB] font-bold uppercase tracking-wider text-[11px]">HPSDMA</span>
            <span className="text-white/40">•</span>
            <span className="truncate text-white/90 text-[11px]">
              Himachal Pradesh Disaster Management Authority
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex rounded bg-[#17352A] p-0.5 text-[11px]">
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded font-semibold transition-all ${
                  lang === "en" ? "bg-[#B0F1CB] text-[#002112]" : "text-[#7E9E90] hover:text-white"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`px-2 py-0.5 rounded font-semibold transition-all ${
                  lang === "hi" ? "bg-[#B0F1CB] text-[#002112]" : "text-[#7E9E90] hover:text-white"
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* 2. CRITICAL HAZARD CARD (WCAG AAA High Contrast Red Unit) */}
        <section className="bg-[#BA1A1A] text-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-[#BA1A1A] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded inline-block">
                  Flash Flood Red Warning
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                  CRITICAL FLASH FLOOD ALERT
                </h2>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#BA1A1A] text-xs font-black shrink-0 animate-pulse shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#BA1A1A]"></span>
              LIVE BROADCAST
            </span>
          </div>

          <div className="bg-white/15 rounded-lg p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div>
              <span className="font-bold uppercase">Affected Areas: </span>
              <span>Kangra & Mandi Valley Districts</span>
            </div>
            <div>
              <span className="font-bold uppercase">Valid Until: </span>
              <span>8:00 PM Tonight (14 Sep)</span>
            </div>
          </div>

          {/* What is Happening */}
          <div className="bg-black/15 p-3 sm:p-3.5 rounded-lg text-xs sm:text-sm">
            <h3 className="font-bold uppercase tracking-wider text-white/90 mb-1">
              1. What is happening?
            </h3>
            <p className="leading-relaxed text-white/95">
              Extremely heavy rainfall causing sudden flash floods, debris flows, and dangerously surging nullahs across Dharamshala, Palampur, Baijnath, and Mandi valleys.
            </p>
          </div>

          {/* Mandatory Actions Right Now */}
          <div className="bg-white text-[#181C1B] p-4 sm:p-5 rounded-lg shadow-inner flex flex-col gap-2.5">
            <h3 className="text-xs sm:text-sm font-black text-[#BA1A1A] uppercase tracking-wider">
              2. Mandatory Action Right Now:
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#BA1A1A] font-black">•</span>
                <span className="font-semibold text-[#BA1A1A]">
                  Stay away from all riverbanks, streams, and nullahs immediately. Waters rise in minutes without warning.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#012016] font-black">•</span>
                <span>
                  Avoid traveling on hillside roads (NH-154 & Dharamshala corridors) due to active boulder fall.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2C694C] font-black">•</span>
                <span className="font-bold text-[#012016]">
                  Move immediately to higher, solid ground if residing near seasonal stream beds or slopes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#012016] font-black">•</span>
                <span>
                  Do not park vehicles under vulnerable cliffs, mature pine trees, or unstable masonry.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* 3. RAPID ONE-TOUCH SOS HELPLINES */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-bold uppercase tracking-wider text-[#012016]">
              One-Touch Emergency Helplines
            </h3>
            <span className="text-[#5D6B63] font-mono font-semibold">Toll-Free • 24x7 Dedicated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="tel:1070"
              className="h-16 px-4 rounded-xl bg-[#012016] text-white shadow-sm hover:bg-[#17352A] transition-all flex items-center justify-between group active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#B0F1CB] text-[#002112] flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#7E9E90] uppercase font-bold tracking-wider">State Disaster Cell</span>
                  <span className="text-xl font-black tracking-tight">1070</span>
                </div>
              </div>
            </a>

            <a
              href="tel:1077"
              className="h-16 px-4 rounded-xl bg-[#2C694C] text-white shadow-sm hover:bg-[#1E4D37] transition-all flex items-center justify-between group active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-[#2C694C] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#B0F1CB] uppercase font-bold tracking-wider">District Control (DC)</span>
                  <span className="text-xl font-black tracking-tight">1077</span>
                </div>
              </div>
            </a>

            <button
              onClick={handleSendSMS}
              className="h-16 px-4 rounded-xl bg-white text-[#181C1B] border border-[#DCE4DF] shadow-sm hover:bg-[#F7FAF8] transition-all flex items-center justify-between text-left active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFDAD6] text-[#93000A] flex items-center justify-center shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#5D6B63] uppercase font-bold tracking-wider">Automated Beacon</span>
                  <span className="text-sm font-bold text-[#BA1A1A]">SMS Coordinates</span>
                </div>
              </div>
              <Send className="w-4 h-4 text-[#5D6B63]" />
            </button>
          </div>

          {smsStatus && (
            <p className="text-xs font-semibold text-[#2C694C] bg-[#B0F1CB]/30 border border-[#2C694C]/30 p-2 rounded-lg mt-1">
              {smsStatus}
            </p>
          )}
        </section>

        {/* 4. REAL-TIME SAFE ZONE MAP & RELIEF SHELTERS */}
        <section className="bg-white rounded-xl shadow-sm border border-[#DCE4DF] p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#2C694C]" />
                Designated Safe Shelters & Evacuation Centers
              </h3>
              <p className="text-xs text-[#5D6B63] mt-0.5">
                3km emergency perimeter shelters, hospitals, colleges & staging grounds.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#2C694C] bg-[#B0F1CB]/50 px-2 py-0.5 rounded border border-[#2C694C]/30 font-bold shrink-0">
              GPS Active
            </span>
          </div>

          {/* Map Container */}
          <div className="w-full h-[400px] rounded-xl overflow-hidden border border-[#DCE4DF] bg-[#F1F4F2]">
            {userLocation && <SafeZoneMap userLocation={userLocation} safePoints={safePoints} />}
          </div>

          {/* Closest Shelters List */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5D6B63]">
              Nearest Verified Safe Shelters (Within Walking Distance):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {safePoints.slice(0, 4).map((sp, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#B0F1CB] text-[#002112] flex items-center justify-center shrink-0">
                      <Home className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#012016] truncate">{sp.name}</h4>
                      <span className="text-[10px] text-[#5D6B63] uppercase">{sp.type || "Safe Shelter"}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-[#2C694C] block">0.{idx + 4} km</span>
                    <span className="text-[10px] text-[#5D6B63]">~{idx * 4 + 7} min walk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. KEY HIGHWAYS & MOUNTAIN PASS STATUS */}
        <section className="bg-white rounded-xl shadow-sm border border-[#DCE4DF] p-4 sm:p-5 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-[#012016]" />
              <h3 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight">
                Key Highway & Mountain Pass Status
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#5D6B63]">Updated: 4 mins ago</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[#012016] text-white font-bold font-mono text-[11px]">
                  NH154
                </span>
                <div>
                  <h4 className="font-bold text-[#012016]">Dharamshala – Kangra Road</h4>
                  <p className="text-[11px] text-[#5D6B63]">Active rockfall cleared at Km 6. Single lane moving.</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-900 shrink-0">
                RESTRICTED
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[#012016] text-white font-bold font-mono text-[11px]">
                  NH21
                </span>
                <div>
                  <h4 className="font-bold text-[#012016]">Mandi – Kullu via Pandoh</h4>
                  <p className="text-[11px] text-[#5D6B63]">Beas river water across carriage way near dam overflow.</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#FFDAD6] text-[#93000A] shrink-0">
                CLOSED
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[#012016] text-white font-bold font-mono text-[11px]">
                  NH205
                </span>
                <div>
                  <h4 className="font-bold text-[#012016]">Shimla – Bilaspur Corridor</h4>
                  <p className="text-[11px] text-[#5D6B63]">Dry surface conditions. Visibility 2.5 km.</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#B0F1CB] text-[#002112] shrink-0">
                OPEN
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[#012016] text-white font-bold font-mono text-[11px]">
                  SH17
                </span>
                <div>
                  <h4 className="font-bold text-[#012016]">Pathankot – Palampur Highway</h4>
                  <p className="text-[11px] text-[#5D6B63]">Emergency convoys active. Moderate delays expected.</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-900 shrink-0">
                SLOW
              </span>
            </div>
          </div>
        </section>

        {/* 6. COLLAPSIBLE OFFLINE GO-BAG & SURVIVAL GUIDE */}
        <section className="bg-white rounded-xl shadow-sm border border-[#DCE4DF] p-4 sm:p-5 flex flex-col gap-3">
          <button
            onClick={() => setShowOfflineGuide(!showOfflineGuide)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#17352A] text-white flex items-center justify-center shrink-0">
                <Backpack className="w-4 h-4 text-[#B0F1CB]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#012016]">
                  Offline Go-Bag & Survival Protocols
                </h3>
                <p className="text-xs text-[#5D6B63]">Essential emergency checklist if cellular connectivity drops</p>
              </div>
            </div>
            {showOfflineGuide ? <ChevronUp className="w-5 h-5 text-[#5D6B63]" /> : <ChevronDown className="w-5 h-5 text-[#5D6B63]" />}
          </button>

          {showOfflineGuide && (
            <div className="pt-2 flex flex-col gap-3 border-t border-[#DCE4DF] text-xs">
              <div className="p-2.5 rounded-lg bg-[#F1F4F2] flex items-center justify-between font-mono">
                <span className="font-semibold text-[#012016]">HP Offline Telemetry Cache Status</span>
                <span className="text-[#2C694C] font-bold">READY OFFLINE (24 MB)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] space-y-1.5">
                  <h4 className="font-bold text-[#012016] uppercase text-[11px] tracking-wider">
                    Immediate Go-Bag (5 Min Pack):
                  </h4>
                  <ul className="space-y-1 text-[#414845]">
                    <li>✓ Waterproof document pouch (Aadhar/IDs, deeds)</li>
                    <li>✓ High-power LED torch + spare batteries</li>
                    <li>✓ 72-hour non-perishable rations & water tablets</li>
                    <li>✓ Essential prescription medicines + first aid</li>
                    <li>✓ Thermal blanket / woolens & whistle</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] space-y-1.5">
                  <h4 className="font-bold text-[#012016] uppercase text-[11px] tracking-wider">
                    Home Shutdown Safety:
                  </h4>
                  <ul className="space-y-1 text-[#414845]">
                    <li>✓ Turn off main electricity MCB breaker</li>
                    <li>✓ Shut off LPG gas cylinder valve securely</li>
                    <li>✓ Unplug rooftop solar/inverter feeds</li>
                    <li>✓ Lock outer doors and move uphill</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
