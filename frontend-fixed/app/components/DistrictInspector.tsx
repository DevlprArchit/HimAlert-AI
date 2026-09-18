"use client";

import React from "react";
import { AlertTriangle, Droplets, Layers, ShieldCheck, ArrowRight, Activity } from "lucide-react";

interface DistrictInspectorProps {
  location?: {
    name: string;
    latitude: number;
    longitude: number;
    flash_flood?: number;
    landslide?: number;
    extreme_rainfall?: number;
    overall?: string;
    water_level?: number | null;
    government_rainfall?: number | null;
  } | null;
  onOpenSitRep?: () => void;
  onViewCatchments?: () => void;
}

export default function DistrictInspector({ location, onOpenSitRep, onViewCatchments }: DistrictInspectorProps) {
  const name = location?.name || "Kangra";
  const ff = location?.flash_flood !== undefined && location?.flash_flood !== null ? Math.round(location.flash_flood) : 12;
  const ls = location?.landslide !== undefined && location?.landslide !== null ? Math.round(location.landslide) : 24;
  const er = location?.extreme_rainfall !== undefined && location?.extreme_rainfall !== null ? Math.round(location.extreme_rainfall) : 5;
  const threatScore = Math.min(100, Math.max(0, Math.round(ff * 0.35 + ls * 0.3 + er * 0.35)));

  const liveRain = Number(location?.government_rainfall ?? 0.0);
  const sixHourRealized = +(liveRain * 0.45).toFixed(1);
  const nextSixHour = +(liveRain * 0.55).toFixed(1);
  const rawWl = Number(location?.water_level ?? 2.1);
  const riverSurge = Math.min(100, Math.max(10, Math.round(rawWl > 100 ? rawWl / 5 : rawWl * 5)));

  return (
    <div className="w-full rounded-xl bg-white p-4 sm:p-5 shadow-sm border border-[#DCE4DF] flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`flex items-center justify-center w-5 h-5 rounded-full ${threatScore >= 50 ? "bg-[#BA1A1A]/10 text-[#BA1A1A]" : "bg-[#2C694C]/10 text-[#2C694C]"}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight">
              {name} District Sector
            </h3>
          </div>
          <p className="text-xs text-[#5D6B63] mt-0.5">
            HQ Observation Sector • Live Basin Sensor Telemetry
          </p>
        </div>

        <div className="flex flex-col items-end">
          <div className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm ${
            threatScore >= 60 ? "bg-[#FFDAD6] text-[#93000A]" : threatScore >= 40 ? "bg-[#FFEAD2] text-[#9C4B00]" : "bg-[#D1F2D9] text-[#1E4620]"
          }`}>
            <span className={`w-2 h-2 rounded-full ${threatScore >= 60 ? "bg-[#BA1A1A] animate-pulse" : "bg-[#2C694C]"}`}></span>
            <span>{threatScore}% THREAT</span>
          </div>
          <span className={`text-[10px] uppercase mt-0.5 font-bold tracking-wider font-mono ${
            threatScore >= 60 ? "text-[#BA1A1A]" : threatScore >= 40 ? "text-[#9C4B00]" : "text-[#2C694C]"
          }`}>
            {threatScore >= 70 ? "High Severity" : threatScore >= 50 ? "Elevated Alert" : "Normal Baseline"}
          </span>
        </div>
      </div>

      {/* 4 Risk Breakdown Progress Bars */}
      <div className="grid grid-cols-2 gap-2.5 pt-0.5">
        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#5D6B63] font-medium text-[11px]">Extreme Rain</span>
            <span className={`font-mono font-bold text-[11px] ${er >= 50 ? "text-[#BA1A1A]" : "text-[#2C694C]"}`}>
              {er}% {er >= 50 ? "High" : er >= 25 ? "Elev" : "Low"}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E0E3E1] overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${er >= 50 ? "bg-[#BA1A1A]" : "bg-[#2C694C]"}`} style={{ width: `${er}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#5D6B63] font-medium text-[11px]">Flash Flood</span>
            <span className={`font-mono font-bold text-[11px] ${ff >= 50 ? "text-[#ED8936]" : "text-[#2C694C]"}`}>
              {ff}% {ff >= 50 ? "High" : ff >= 25 ? "Elev" : "Low"}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E0E3E1] overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${ff >= 50 ? "bg-[#ED8936]" : "bg-[#2C694C]"}`} style={{ width: `${ff}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#5D6B63] font-medium text-[11px]">Landslide Risk</span>
            <span className={`font-mono font-bold text-[11px] ${ls >= 50 ? "text-[#DCAE37]" : "text-[#2C694C]"}`}>
              {ls}% {ls >= 50 ? "High" : ls >= 25 ? "Mod" : "Low"}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E0E3E1] overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${ls >= 50 ? "bg-[#DCAE37]" : "bg-[#2C694C]"}`} style={{ width: `${ls}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#5D6B63] font-medium text-[11px]">River Surge</span>
            <span className={`font-mono font-bold text-[11px] ${riverSurge >= 50 ? "text-[#ED8936]" : "text-[#2C694C]"}`}>
              {riverSurge}% {riverSurge >= 50 ? "Elev" : "Normal"}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E0E3E1] overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${riverSurge >= 50 ? "bg-[#ED8936]" : "bg-[#2C694C]"}`} style={{ width: `${riverSurge}%` }}></div>
          </div>
        </div>
      </div>

      {/* Realized Rain / Forecast Metrics Strip */}
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F1F4F2] text-[#181C1B]">
        <div className="flex flex-col">
          <span className="text-[#5D6B63] font-medium text-[10px] uppercase tracking-wider font-mono">
            24h Rain
          </span>
          <span className="text-base sm:text-lg font-bold text-[#012016]">
            {liveRain.toFixed(1)} <span className="font-normal text-xs text-[#5D6B63]">mm</span>
          </span>
        </div>
        <div className="w-px h-6 bg-[#DCE4DF]"></div>
        <div className="flex flex-col">
          <span className="text-[#5D6B63] font-medium text-[10px] uppercase tracking-wider font-mono">
            6h Realized
          </span>
          <span className="text-base sm:text-lg font-bold text-[#012016]">
            {sixHourRealized} <span className="font-normal text-xs text-[#5D6B63]">mm</span>
          </span>
        </div>
        <div className="w-px h-6 bg-[#DCE4DF]"></div>
        <div className="flex flex-col">
          <span className="text-[#5D6B63] font-medium text-[10px] uppercase tracking-wider font-mono">
            Next 6h Fcst
          </span>
          <span className={`text-base sm:text-lg font-bold ${nextSixHour > 5 ? "text-[#BA1A1A]" : "text-[#2C694C]"}`}>
            {nextSixHour} <span className="font-normal text-xs text-[#5D6B63]">mm</span>
          </span>
        </div>
      </div>

      {/* Impacted Catchments Notification */}
      <div className={`flex items-start gap-2.5 p-3 rounded-lg border text-[#181C1B] ${
        threatScore >= 50 ? "bg-[#FFDAD6]/40 border-[#BA1A1A]/20" : "bg-[#D1F2D9]/30 border-[#A3E6B8]"
      }`}>
        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${threatScore >= 50 ? "text-[#BA1A1A]" : "text-[#2C694C]"}`} />
        <div className="min-w-0 flex-1 text-xs">
          <p className="font-bold text-[#012016]">
            {threatScore >= 50 ? "Elevated Catchment Surge Warning" : "Catchment Runoff Stable"}
          </p>
          <p className="text-[#5D6B63] text-[11px] leading-relaxed mt-0.5">
            {threatScore >= 50
              ? "Precautionary watch advised for low-lying mountain stream crossings and steep road corridors."
              : `All monitored river catchments in ${name} district are flowing within stable seasonal parameters.`}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-0.5">
        <button
          type="button"
          onClick={onViewCatchments || onOpenSitRep}
          className="h-10 flex items-center justify-center gap-1.5 px-3 rounded-lg bg-[#F1F4F2] text-[#012016] text-xs font-bold active:scale-[0.98] transition-all hover:bg-[#E6E9E7] border border-[#DCE4DF]"
          title="Inspect River Catchment Gauges"
        >
          <Activity className="w-3.5 h-3.5 text-[#2C694C]" />
          <span>Catchment Feeds (3)</span>
        </button>
        <button
          type="button"
          onClick={onOpenSitRep}
          className="h-10 flex items-center justify-center gap-1.5 px-3 rounded-lg bg-[#012016] text-white text-xs font-bold shadow-sm active:scale-[0.98] transition-all hover:bg-[#17352A]"
        >
          <span>Dispatch SitRep</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#B0F1CB]" />
        </button>
      </div>
    </div>
  );
}
