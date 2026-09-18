"use client";

import React from "react";
import {
  Sparkles,
  Satellite,
  Waves,
  Mountain,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Smartphone,
  CloudRain,
} from "lucide-react";

interface DreamcoreHeroProps {
  onSelectTab: (tab: string) => void;
  onOpenPhoneConnect: () => void;
  onOpenTwilio?: () => void;
  onScrollToSimulator?: () => void;
  risk?: any;
  weather?: any;
  riverDischarge?: number;
  locationName?: string;
  basinName?: string;
  soilMoisturePct?: number;
}

export default function DreamcoreHeroSection({
  onSelectTab,
  onOpenPhoneConnect,
  onOpenTwilio,
  onScrollToSimulator,
  risk,
  weather,
  riverDischarge,
  locationName,
  basinName,
  soilMoisturePct,
}: DreamcoreHeroProps) {
  const dischargeVal = riverDischarge ?? Number(risk?.inputs?.water_level ?? 2.1);
  const soilPct = soilMoisturePct ?? Math.round((risk?.inputs?.soil_moisture ?? (weather?.current?.soil_moisture ?? 0.45)) * 100);

  return (
    <section className="relative w-full py-6 sm:py-8 overflow-hidden rounded-3xl dreamcore-glass p-6 sm:p-10 border border-white/80 shadow-[0_20px_60px_-15px_rgba(1,32,22,0.07)]">
      {/* Background Decorative Dreamcore Glow Portal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#2C694C]/15 via-[#B0F1CB]/25 to-[#FFE088]/15 rounded-full blur-3xl pointer-events-none -z-10 animate-dreamcore-aura" />

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-6 relative z-10">
        {/* 1. Floating Pill Shimmer Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#2C694C]/25 shadow-sm backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2C694C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2C694C]"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#012016]">
            HIMALERT AI • MOTION INTEL 2.0
          </span>
          <span className="text-xs text-[#5D6B63]">• 1.0s STREAM</span>
        </div>

        {/* 2. Cinematic Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#012016] tracking-tight leading-[1.1] font-headline">
            Predict Impact.{" "}
            <span className="bg-gradient-to-r from-[#012016] via-[#2C694C] to-[#012016] bg-clip-text text-transparent">
              Not Just Weather.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#5D6B63] max-w-2xl mx-auto font-medium leading-relaxed">
            From fragmented observations to real-time decisions. AI-powered early warnings for cloudbursts, flash floods, and landslides across Himachal Pradesh.
          </p>
        </div>

        {/* 3. Floating Dreamcore Telemetry Portal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full mt-2">
          {/* Card 1: Satellite Radiance */}
          <div className="p-4 rounded-2xl bg-white/75 backdrop-blur-md border border-white/80 shadow-sm flex flex-col justify-between text-left hover:shadow-md transition-all group animate-dreamcore-float">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5D6B63]">
                GEE Radiometry
              </span>
              <div className="p-1.5 rounded-lg bg-[#2C694C]/10 text-[#2C694C] group-hover:scale-110 transition-transform">
                <Satellite className="w-4 h-4" />
              </div>
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-[#012016] tracking-tight">
                +0.42 <span className="text-xs font-bold text-[#2C694C]">DN/yr</span>
              </span>
              <p className="text-[11px] text-[#5D6B63] mt-0.5">
                NOAA DMSP-OLS Calibrated Radiance Trend
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#2C694C] bg-[#B0F1CB]/40 px-2 py-0.5 rounded-md inline-block self-start mt-2">
              Urban Exposure Model
            </span>
          </div>

          {/* Card 2: Hydrology Breach Velocity */}
          <div
            className="p-4 rounded-2xl bg-white/75 backdrop-blur-md border border-white/80 shadow-sm flex flex-col justify-between text-left hover:shadow-md transition-all group animate-dreamcore-float"
            style={{ animationDelay: "-2s" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5D6B63]">
                {basinName ? `${basinName} Flow` : "Beas River Basin"}
              </span>
              <div className="p-1.5 rounded-lg bg-[#2C694C]/10 text-[#2C694C] group-hover:scale-110 transition-transform">
                <Waves className="w-4 h-4" />
              </div>
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-[#012016] tracking-tight">
                {dischargeVal < 10 ? dischargeVal.toFixed(1) : Math.round(dischargeVal)}{" "}
                <span className={`text-xs font-bold ${dischargeVal > 100 ? "text-[#BA1A1A]" : "text-[#2C694C]"}`}>
                  m³/s
                </span>
              </span>
              <p className="text-[11px] text-[#5D6B63] mt-0.5">
                {dischargeVal > 100 ? "Inflow Discharge (Elevated Surge Watch)" : "Open-Meteo Flood API Discharge"}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block self-start mt-2 ${
                dischargeVal > 100 ? "text-[#BA1A1A] bg-[#FFDAD6]" : "text-[#1E4620] bg-[#D1F2D9]"
              }`}
            >
              {dischargeVal > 100 ? "Elevated Surge Watch" : "Hydrological Steady State"}
            </span>
          </div>

          {/* Card 3: Mountain Ground Wetness */}
          <div
            className="p-4 rounded-2xl bg-white/75 backdrop-blur-md border border-white/80 shadow-sm flex flex-col justify-between text-left hover:shadow-md transition-all group animate-dreamcore-float"
            style={{ animationDelay: "-4s" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5D6B63]">
                Slope Saturation
              </span>
              <div className="p-1.5 rounded-lg bg-[#2C694C]/10 text-[#2C694C] group-hover:scale-110 transition-transform">
                <Mountain className="w-4 h-4" />
              </div>
            </div>
            <div className="my-1">
              <span className="text-2xl font-black text-[#012016] tracking-tight">
                {soilPct}% <span className="text-xs font-bold text-[#2C694C]">Topsoil</span>
              </span>
              <p className="text-[11px] text-[#5D6B63] mt-0.5">
                Safe Rain Buffer: {Math.max(0, 100 - soilPct)}% Remaining
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block self-start mt-2 ${
                soilPct > 70 ? "text-[#BA1A1A] bg-[#FFDAD6]" : "text-[#002114] bg-[#B0F1CB]"
              }`}
            >
              {soilPct > 70 ? "High Saturation" : "Stable Bedrock Envelope"}
            </span>
          </div>
        </div>

        {/* 4. Action Buttons Dock */}
        <div className="flex items-center justify-center gap-3 flex-wrap mt-2">
          <button
            type="button"
            onClick={() => onSelectTab("map")}
            className="px-5 py-2.5 rounded-xl bg-[#012016] hover:bg-black text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          >
            <span>Explore GIS Radar</span>
            <ArrowRight className="w-4 h-4 text-[#B0F1CB]" />
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectTab("overview");
              if (onScrollToSimulator) {
                onScrollToSimulator();
              } else {
                setTimeout(() => {
                  document.getElementById("rain-simulator")?.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F1F4F2] text-[#012016] border border-[#DCE4DF] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
          >
            <CloudRain className="w-4 h-4 text-[#2C694C]" />
            <span>Interactive Rain Simulator</span>
          </button>

          <button
            type="button"
            onClick={onOpenPhoneConnect}
            className="px-4 py-2.5 rounded-xl bg-[#B0F1CB]/60 hover:bg-[#B0F1CB] text-[#002112] border border-[#2C694C]/25 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Smartphone className="w-4 h-4 text-[#012016]" />
            <span>Run on Phone</span>
          </button>
        </div>
      </div>
    </section>
  );
}
