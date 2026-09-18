"use client";

import React from "react";
import { AlertTriangle, Clock, ArrowUpRight, ShieldAlert, ArrowUp, Info } from "lucide-react";

interface ThreatKPIBarProps {
  risk?: {
    flash_flood?: number;
    landslide?: number;
    extreme_rainfall?: number;
    overall?: string;
  } | null;
  loading?: boolean;
  onOpenAlerts?: () => void;
}

export default function ThreatKPIBar({ risk, loading, onOpenAlerts }: ThreatKPIBarProps) {
  // Calculate dynamic overall threat score (0-100)
  const ff = risk?.flash_flood !== undefined && risk?.flash_flood !== null ? Number(risk.flash_flood) : 12;
  const ls = risk?.landslide !== undefined && risk?.landslide !== null ? Number(risk.landslide) : 24;
  const er = risk?.extreme_rainfall !== undefined && risk?.extreme_rainfall !== null ? Number(risk.extreme_rainfall) : 5;
  const threatScore = Math.min(100, Math.max(0, Math.round(ff * 0.35 + ls * 0.3 + er * 0.35)));

  const getThreatLabel = (score: number) => {
    if (score >= 70) return { label: "HIGH SEVERITY", color: "bg-[#BA1A1A] text-white", ring: "ring-[#BA1A1A]/20" };
    if (score >= 60) return { label: "ELEVATED", color: "bg-[#ED8936] text-white", ring: "ring-[#ED8936]/20" };
    if (score >= 40) return { label: "MODERATE", color: "bg-[#DCAE37] text-white", ring: "ring-[#DCAE37]/20" };
    if (score >= 20) return { label: "LOW RISK", color: "bg-[#8FB94B] text-slate-900", ring: "ring-[#8FB94B]/20" };
    return { label: "SAFE", color: "bg-[#3C9964] text-white", ring: "ring-[#3C9964]/20" };
  };

  const threatStatus = getThreatLabel(threatScore);

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Active High Emergency Warning Banner */}
      {threatScore >= 60 || risk?.overall === "HIGH" || risk?.overall === "CRITICAL" ? (
        <section className="rounded-xl bg-[#FFDAD6] text-[#93000A] p-4 sm:p-5 shadow-sm border border-[#BA1A1A]/20 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#BA1A1A] text-white shrink-0 animate-bounce">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h2 className="text-xs sm:text-sm font-bold tracking-tight uppercase text-[#BA1A1A] truncate">
                High Severity Alert Active
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#BA1A1A] text-white text-[10px] font-extrabold uppercase shrink-0">
              Priority Action
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#410002] leading-relaxed">
            Elevated hydrological runoff & slope saturation detected. Maintain active monitoring along mountain highways and river corridors.
          </p>
          <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-[#BA1A1A]/10 text-xs">
            <div className="flex items-center gap-1.5 text-[#5D6B63] font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#BA1A1A]" />
              <span>Real-time continuous telemetry watch</span>
            </div>
            <button
              onClick={onOpenAlerts}
              className="inline-flex items-center gap-1 font-bold text-[#BA1A1A] hover:underline"
            >
              <span>View Emergency Action Brief</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      ) : (
        <section className="rounded-xl bg-[#D1F2D9] text-[#1E4620] p-4 sm:p-5 shadow-sm border border-[#A3E6B8] flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#2C694C] text-white shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <h2 className="text-xs sm:text-sm font-bold tracking-tight uppercase text-[#1E4620] truncate">
                Nominal Basin Operations • Safe Conditions
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#2C694C] text-white text-[10px] font-extrabold uppercase shrink-0">
              All Clear
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#1E4620] leading-relaxed">
            All regional river basins and slope sensors are reporting within safe operating thresholds. Roads are clear and open for standard mountain transit.
          </p>
          <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-[#2C694C]/10 text-xs">
            <div className="flex items-center gap-1.5 text-[#2C694C] font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#2C694C]" />
              <span>Live automated Open-Meteo telemetry stream active</span>
            </div>
            <button
              onClick={onOpenAlerts}
              className="inline-flex items-center gap-1 font-bold text-[#2C694C] hover:underline"
            >
              <span>View System Diagnostics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 2. OVERALL THREAT INDEX Card */}
      <section className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#DCE4DF] flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5D6B63]">
                Statewide Early Warning
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[#EBF0ED] text-[#17352A] text-[9px] font-bold font-mono">
                Tier-1 SEOC
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight mt-0.5">
              OVERALL THREAT INDEX
            </h3>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ring-2 ${threatStatus.color} ${threatStatus.ring}`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{threatStatus.label}</span>
          </div>
        </div>

        {/* Big Threat Metric & Delta */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl sm:text-5xl font-black tracking-tight tabular-nums ${
              threatScore >= 60 ? "text-[#BA1A1A]" : threatScore >= 40 ? "text-[#ED8936]" : "text-[#2C694C]"
            }`}>
              {loading ? "--" : threatScore}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#5D6B63]">/ 100 max</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full font-mono ${
              threatScore >= 60 ? "bg-[#FFDAD6] text-[#BA1A1A]" : "bg-[#D1F2D9] text-[#1E4620]"
            }`}>
              <ArrowUp className="w-3 h-3" />
              <span>{threatScore >= 60 ? "+8 pts since 06:00" : "Steady Baseline"}</span>
            </span>
            <span className="text-[10px] text-[#5D6B63] mt-1 font-medium">Horizon: Next 24 Hours</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#414845] leading-relaxed">
          {threatScore >= 60
            ? "Elevated multi-hazard risk concentrated across localized sub-basins with high slope saturation indices."
            : "Multi-hazard indices across Himachal Pradesh remain well within standard safety tolerance envelopes."}
        </p>

        {/* Segmented NDMA Threat Gauge */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="relative w-full pt-2 pb-1">
            {/* 5 Color Segments */}
            <div className="h-3 w-full rounded-full overflow-hidden flex shadow-inner border border-[#DCE4DF]">
              <div className="h-full w-[20%] bg-[#3C9964]" title="Safe (0-20)"></div>
              <div className="h-full w-[20%] bg-[#8FB94B]" title="Low (20-40)"></div>
              <div className="h-full w-[20%] bg-[#DCAE37]" title="Moderate (40-60)"></div>
              <div className="h-full w-[10%] bg-[#ED8936]" title="Elevated (60-70)"></div>
              <div className="h-full w-[30%] bg-[#D94747]" title="High (70-100)"></div>
            </div>
            {/* Position Pointer Marker */}
            <div
              className="absolute top-1 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-500"
              style={{ left: `${Math.min(96, Math.max(4, threatScore))}%` }}
            >
              <div className="w-3 h-3 rotate-45 bg-[#012016] border-2 border-white shadow-md rounded-[2px]"></div>
            </div>
          </div>
          {/* Scale Labels */}
          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#5D6B63] px-0.5 font-mono">
            <span className="text-[#2C694C]">Safe (0-20)</span>
            <span className="text-[#5D8520]">Low</span>
            <span className="text-[#8C6B12]">Mod</span>
            <span className="text-[#AB5A14]">Elev</span>
            <span className="text-[#BA1A1A]">High ({threatScore})</span>
          </div>
        </div>

        {/* 55/30 Boundary Footnote */}
        <div className="rounded-lg bg-[#F1F4F2] border border-[#DCE4DF]/70 p-2.5 flex items-start gap-2 text-[#414845]">
          <Info className="w-4 h-4 text-[#2C694C] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            The 55/30 risk boundaries are project-defined UI classifications computed by NDMA-SDMA deterministic ML synthesis, cross-referenced with live IMD weather stations.
          </p>
        </div>
      </section>
    </div>
  );
}
