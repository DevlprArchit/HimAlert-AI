"use client";

import React from "react";
import { TrendingUp, Minus, CloudRain, Waves, Mountain, Droplets, Activity } from "lucide-react";
import { SparklineHistory } from "@/hooks/useRealtimeTelemetry";

interface HazardTelemetryGridProps {
  risk?: {
    flash_flood?: number;
    landslide?: number;
    extreme_rainfall?: number;
    overall?: string;
    inputs?: {
      current_rain?: number;
      soil_moisture?: number;
      water_level?: number;
    };
  } | null;
  weather?: any;
  sparklines?: SparklineHistory;
  metricDeltas?: {
    rainRate: number;
    riverDischarge: number;
    soilMoisturePct: number;
    temp: number;
  };
}

// Convert an array of values into a smooth SVG sparkline path
function pointsToSvg(values: number[] = [], width = 100, height = 28) {
  if (!values || values.length === 0) {
    return { linePath: "M0,14 L100,14", areaPath: "M0,14 L100,14 L100,28 L0,28 Z" };
  }
  const minVal = Math.min(...values) - 5;
  const maxVal = Math.max(...values) + 5;
  const range = maxVal - minVal || 1;

  const coords = values.map((val, idx) => {
    const x = (idx / (values.length - 1)) * width;
    const y = height - ((val - minVal) / range) * (height - 6) - 3;
    return [x, y];
  });

  const linePath = coords.reduce((acc, [x, y], idx) => {
    return idx === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : `${acc} L${x.toFixed(1)},${y.toFixed(1)}`;
  }, "");

  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  return { linePath, areaPath };
}

export default function HazardTelemetryGrid({
  risk,
  weather,
  sparklines,
  metricDeltas,
}: HazardTelemetryGridProps) {
  const rainScore = Number(risk?.extreme_rainfall) || 78;
  const floodScore = Number(risk?.flash_flood) || 64;
  const slideScore = Number(risk?.landslide) || 49;
  const riverDischarge = metricDeltas?.riverDischarge ?? Number(risk?.inputs?.water_level) ?? 358.7;
  const riverRiseScore = Math.min(95, Math.max(25, Math.round(riverDischarge > 100 ? 58 : 36)));

  const rainSvg = pointsToSvg(sparklines?.rain || [74, 76, 75, 78, 79, 78, 80, 78]);
  const floodSvg = pointsToSvg(sparklines?.flood || [60, 62, 63, 64, 65, 64, 65, 64]);
  const slideSvg = pointsToSvg(sparklines?.slide || [48, 49, 49, 48, 49, 50, 49, 49]);
  const riverSvg = pointsToSvg(sparklines?.river || [54, 55, 56, 57, 58, 59, 58, 58]);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2C694C] animate-pulse"></span>
          <h3 className="text-sm sm:text-base font-bold text-[#012016] tracking-tight">
            Hazard Telemetry Matrices
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#2C694C] bg-[#2C694C]/10 px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#2C694C] animate-spin" />
            <span>1s Buffer Streaming</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Rainfall Surge Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#DCE4DF] flex flex-col justify-between gap-3 hover:border-[#BA1A1A]/40 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5D6B63] flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-[#BA1A1A]" />
              Rainfall Surge
            </span>
            <span className="px-2 py-0.5 rounded bg-[#BA1A1A]/15 text-[#BA1A1A] font-mono text-[10px] font-bold uppercase tracking-wider">
              {rainScore >= 70 ? "High" : "Elevated"}
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-[#012016] tracking-tight tabular-nums">
                {rainScore}%
              </span>
              <span className="text-xs font-bold text-[#BA1A1A] flex items-center gap-0.5 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{metricDeltas?.rainRate ? `${metricDeltas.rainRate} mm/h` : "Surge"}</span>
              </span>
            </div>

            {/* Dynamic Real-time Sparkline */}
            <svg className="w-full h-9 mt-2 transition-all duration-300" fill="none" preserveAspectRatio="none" viewBox="0 0 100 28">
              <defs>
                <linearGradient id="rainGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#BA1A1A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#BA1A1A" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={rainSvg.linePath} fill="none" stroke="#BA1A1A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
              <path d={rainSvg.areaPath} fill="url(#rainGrad)" />
            </svg>
          </div>

          <p className="text-[11px] text-[#5D6B63] line-clamp-2 leading-tight">
            Deep convective cloud cell over Dharamshala & Kangra ridge (&gt;45 mm/h).
          </p>
        </div>

        {/* 2. Flash Flood Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#DCE4DF] flex flex-col justify-between gap-3 hover:border-[#ED8936]/40 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5D6B63] flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-[#ED8936]" />
              Flash Flood
            </span>
            <span className="px-2 py-0.5 rounded bg-[#ED8936]/20 text-[#AB5A14] font-mono text-[10px] font-bold uppercase tracking-wider">
              {floodScore >= 60 ? "Elevated" : "Moderate"}
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-[#012016] tracking-tight tabular-nums">
                {floodScore}%
              </span>
              <span className="text-xs font-bold text-[#AB5A14] flex items-center gap-0.5 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Rising</span>
              </span>
            </div>

            {/* Dynamic Real-time Sparkline */}
            <svg className="w-full h-9 mt-2 transition-all duration-300" fill="none" preserveAspectRatio="none" viewBox="0 0 100 28">
              <defs>
                <linearGradient id="floodGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#ED8936" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ED8936" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={floodSvg.linePath} fill="none" stroke="#ED8936" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
              <path d={floodSvg.areaPath} fill="url(#floodGrad)" />
            </svg>
          </div>

          <p className="text-[11px] text-[#5D6B63] line-clamp-2 leading-tight">
            Beas & Neugal tributary rapid runoff surge near Pandoh upstream.
          </p>
        </div>

        {/* 3. Landslide Risk Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#DCE4DF] flex flex-col justify-between gap-3 hover:border-[#DCAE37]/40 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5D6B63] flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-[#DCAE37]" />
              Landslide Risk
            </span>
            <span className="px-2 py-0.5 rounded bg-[#DCAE37]/20 text-[#8C6B12] font-mono text-[10px] font-bold uppercase tracking-wider">
              {slideScore >= 50 ? "Elevated" : "Moderate"}
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-[#012016] tracking-tight tabular-nums">
                {slideScore}%
              </span>
              <span className="text-xs font-bold text-[#8C6B12] flex items-center gap-0.5 font-mono">
                <Minus className="w-3.5 h-3.5" />
                <span>{metricDeltas?.soilMoisturePct ? `${metricDeltas.soilMoisturePct}% Sat` : "Stable"}</span>
              </span>
            </div>

            {/* Dynamic Real-time Sparkline */}
            <svg className="w-full h-9 mt-2 transition-all duration-300" fill="none" preserveAspectRatio="none" viewBox="0 0 100 28">
              <defs>
                <linearGradient id="slideGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#DCAE37" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#DCAE37" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={slideSvg.linePath} fill="none" stroke="#DCAE37" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
              <path d={slideSvg.areaPath} fill="url(#slideGrad)" />
            </svg>
          </div>

          <p className="text-[11px] text-[#5D6B63] line-clamp-2 leading-tight">
            Soil saturation 82% in Dharamshala-McLeodganj corridor; boulder clearance active.
          </p>
        </div>

        {/* 4. River Rise Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#DCE4DF] flex flex-col justify-between gap-3 hover:border-[#2C694C]/40 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5D6B63] flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-[#2C694C]" />
              River Rise & Runoff
            </span>
            <span className="px-2 py-0.5 rounded bg-[#2C694C]/15 text-[#2C694C] font-mono text-[10px] font-bold uppercase tracking-wider">
              {riverRiseScore > 50 ? "Elevated" : "Normal"}
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-[#012016] tracking-tight tabular-nums">
                {riverRiseScore}%
              </span>
              <span className="text-xs font-bold text-[#2C694C] flex items-center gap-0.5 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{riverDischarge.toFixed(1)} m³/s</span>
              </span>
            </div>

            {/* Dynamic Real-time Sparkline */}
            <svg className="w-full h-9 mt-2 transition-all duration-300" fill="none" preserveAspectRatio="none" viewBox="0 0 100 28">
              <defs>
                <linearGradient id="riverGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#2C694C" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2C694C" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={riverSvg.linePath} fill="none" stroke="#2C694C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
              <path d={riverSvg.areaPath} fill="url(#riverGrad)" />
            </svg>
          </div>

          <p className="text-[11px] text-[#5D6B63] line-clamp-2 leading-tight">
            Bhuntar gauge steady; Pandoh inflow currently at {riverDischarge.toFixed(1)} m³/s.
          </p>
        </div>
      </div>
    </section>
  );
}
