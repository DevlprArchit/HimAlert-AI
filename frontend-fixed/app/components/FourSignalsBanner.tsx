"use client";

import React from "react";
import { Satellite, CloudRain, Waves, Mountain, ShieldAlert, ArrowRight } from "lucide-react";

interface FourSignalsProps {
  onOpenTwilio?: () => void;
  onOpenPhoneConnect?: () => void;
}

export default function FourSignalsBanner({
  onOpenTwilio,
  onOpenPhoneConnect,
}: FourSignalsProps) {
  return (
    <section className="bg-white rounded-2xl border border-[#DCE4DF] shadow-sm p-4 sm:p-6 flex flex-col gap-5">
      {/* Top Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#DCE4DF]/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#B0F1CB] text-[#002114]">
              SUSTAINABILITY &amp; CLIMATE TECH
            </span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5D6B63]">
              FROM DATA → ACTION
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#012016] tracking-tight mt-1">
            FOUR SIGNALS. ONE DECISION.
          </h2>
          <p className="text-xs sm:text-sm text-[#5D6B63] mt-0.5 max-w-2xl">
            Himachal Pradesh is highly exposed to cloudbursts, flash floods, landslides, and sudden river surges. HimAlert connects fragmented signals into a single unified threat picture.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onOpenPhoneConnect}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#012016] hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
          >
            📱 Run on Phone
          </button>
          <button
            type="button"
            onClick={onOpenTwilio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2C694C] hover:bg-[#1E4D36] text-white text-xs font-bold transition-all shadow-sm"
          >
            🔔 Citizen SMS Alerts
          </button>
        </div>
      </div>

      {/* 4 Signals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Signal 1 */}
        <div className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#DCE4DF] flex flex-col justify-between hover:border-[#2C694C] transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#012016] uppercase tracking-wider">
              1. Satellite
            </span>
            <div className="p-1.5 rounded-lg bg-[#2C694C]/10 text-[#2C694C]">
              <Satellite className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-semibold text-[#012016] mb-1">
            Clouds, Wildfires &amp; GEE
          </p>
          <p className="text-[11px] text-[#5D6B63] leading-relaxed">
            NOAA DMSP-OLS nighttime lights radiometry (+0.42 DN/yr) and multispectral vegetation moisture.
          </p>
        </div>

        {/* Signal 2 */}
        <div className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#DCE4DF] flex flex-col justify-between hover:border-[#2C694C] transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#012016] uppercase tracking-wider">
              2. Weather / Radar
            </span>
            <div className="p-1.5 rounded-lg bg-[#2C694C]/10 text-[#2C694C]">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-semibold text-[#012016] mb-1">
            Rainfall Intensity &amp; Forecasts
          </p>
          <p className="text-[11px] text-[#5D6B63] leading-relaxed">
            High-resolution convective precipitation tracking, 12-hour hourly forecasts &amp; IMD radar synthesis.
          </p>
        </div>

        {/* Signal 3 */}
        <div className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#DCE4DF] flex flex-col justify-between hover:border-[#2C694C] transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#012016] uppercase tracking-wider">
              3. Hydrology
            </span>
            <div className="p-1.5 rounded-lg bg-[#2C694C]/10 text-[#2C694C]">
              <Waves className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-semibold text-[#012016] mb-1">
            River Levels &amp; Inflow
          </p>
          <p className="text-[11px] text-[#5D6B63] leading-relaxed">
            Real-time discharge across Beas, Sutlej, Ravi, Chenab, and Parvati with warning breach thresholds.
          </p>
        </div>

        {/* Signal 4 */}
        <div className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#DCE4DF] flex flex-col justify-between hover:border-[#2C694C] transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#012016] uppercase tracking-wider">
              4. Terrain
            </span>
            <div className="p-1.5 rounded-lg bg-[#2C694C]/10 text-[#2C694C]">
              <Mountain className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs font-semibold text-[#012016] mb-1">
            Slope, Elevation &amp; Soil
          </p>
          <p className="text-[11px] text-[#5D6B63] leading-relaxed">
            Subsurface pore saturation (0–28 cm depth), steep cuttings stability &amp; mountain drainage gradients.
          </p>
        </div>
      </div>

    </section>
  );
}
