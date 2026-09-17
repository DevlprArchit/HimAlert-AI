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
}

export default function DistrictInspector({ location, onOpenSitRep }: DistrictInspectorProps) {
  const name = location?.name || "Kangra";
  const ff = Number(location?.flash_flood) || 63;
  const ls = Number(location?.landslide) || 45;
  const er = Number(location?.extreme_rainfall) || 78;
  const threatScore = Math.min(100, Math.max(15, Math.round((ff * 0.35 + ls * 0.3 + er * 0.35))));

  return (
    <div className="w-full rounded-xl bg-white p-4 sm:p-5 shadow-sm border border-[#DCE4DF] flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#BA1A1A]/10 text-[#BA1A1A]">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight">
              {name} District Sector
            </h3>
          </div>
          <p className="text-xs text-[#5D6B63] mt-0.5">
            HQ Observation Sector • Beas Upper Sub-Catchment Basin
          </p>
        </div>

        <div className="flex flex-col items-end">
          <div className="px-2.5 py-1 rounded-md bg-[#FFDAD6] text-[#93000A] text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#BA1A1A] animate-pulse"></span>
            <span>{threatScore}% THREAT</span>
          </div>
          <span className="text-[10px] text-[#BA1A1A] uppercase mt-0.5 font-bold tracking-wider font-mono">
            {threatScore >= 70 ? "High Severity" : threatScore >= 50 ? "Elevated Alert" : "Monitored"}
          </span>
        </div>
      </div>

      {/* 4 Risk Breakdown Progress Bars */}
      <div className="grid grid-cols-2 gap-2.5 pt-0.5">
        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#5D6B63] font-medium text-[11px]">Extreme Rain</span>
            <span className="font-mono font-bold text-[11px] text-[#BA1A1A]">{er}% High</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E0E3E1] overflow-hidden">
            <div className="h-full bg-[#BA1A1A] rounded-full transition-all duration-500" style={{ width: `${er}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#5D6B63] font-medium text-[11px]">Flash Flood</span>
            <span className="font-mono font-bold text-[11px] text-[#ED8936]">{ff}% Elev</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E0E3E1] overflow-hidden">
            <div className="h-full bg-[#ED8936] rounded-full transition-all duration-500" style={{ width: `${ff}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#5D6B63] font-medium text-[11px]">Landslide Risk</span>
            <span className="font-mono font-bold text-[11px] text-[#DCAE37]">{ls}% Mod</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E0E3E1] overflow-hidden">
            <div className="h-full bg-[#DCAE37] rounded-full transition-all duration-500" style={{ width: `${ls}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#5D6B63] font-medium text-[11px]">River Surge</span>
            <span className="font-mono font-bold text-[11px] text-[#2C694C]">38% Low</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E0E3E1] overflow-hidden">
            <div className="h-full bg-[#2C694C] rounded-full transition-all duration-500" style={{ width: "38%" }}></div>
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
            86 <span className="font-normal text-xs text-[#5D6B63]">mm</span>
          </span>
        </div>
        <div className="w-px h-6 bg-[#DCE4DF]"></div>
        <div className="flex flex-col">
          <span className="text-[#5D6B63] font-medium text-[10px] uppercase tracking-wider font-mono">
            6h Realized
          </span>
          <span className="text-base sm:text-lg font-bold text-[#012016]">
            43 <span className="font-normal text-xs text-[#5D6B63]">mm</span>
          </span>
        </div>
        <div className="w-px h-6 bg-[#DCE4DF]"></div>
        <div className="flex flex-col">
          <span className="text-[#5D6B63] font-medium text-[10px] uppercase tracking-wider font-mono">
            Next 6h Fcst
          </span>
          <span className="text-base sm:text-lg font-bold text-[#BA1A1A]">
            31 <span className="font-normal text-xs text-[#BA1A1A]">mm</span>
          </span>
        </div>
      </div>

      {/* Impacted Catchments Notification */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FFDAD6]/40 border border-[#BA1A1A]/20 text-[#181C1B]">
        <AlertTriangle className="w-4 h-4 text-[#BA1A1A] shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1 text-xs">
          <p className="font-bold text-[#012016]">
            3 Impacted Catchments: Neugal, Gaj, Dehar
          </p>
          <p className="text-[#5D6B63] text-[11px] leading-relaxed mt-0.5">
            Precautionary evacuation warnings issued for low-lying settlements near Nagrota Bagwan and Shahpur tehsil.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-0.5">
        <button
          type="button"
          onClick={onOpenSitRep}
          className="h-10 flex items-center justify-center gap-1.5 px-3 rounded-lg bg-[#F1F4F2] text-[#012016] text-xs font-bold active:scale-[0.98] transition-all hover:bg-[#E6E9E7] border border-[#DCE4DF]"
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
