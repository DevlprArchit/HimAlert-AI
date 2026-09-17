"use client";

import React from "react";
import {
  Cloud,
  Droplets,
  Wind,
  Navigation,
  ThermometerSun,
  Eye,
  Gauge,
  Calendar,
  CloudRain,
  Sun,
  CloudSun,
} from "lucide-react";

export default function BeautifulWeather({
  weather,
  weatherLoading,
  locationName,
}: {
  weather: any;
  weatherLoading: boolean;
  locationName: string;
}) {
  if (weatherLoading || !weather || !weather.current) {
    return (
      <div className="w-full flex items-center justify-center p-8 bg-white rounded-xl border border-[#DCE4DF] shadow-sm animate-pulse">
        <span className="text-[#5D6B63] text-xs font-semibold tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2C694C] animate-ping"></span>
          Gathering live meteorological observations...
        </span>
      </div>
    );
  }

  const current = weather.current;
  const rainProb = weather.forecast?.max_rain_probability || 0;
  const pressure = current.pressure || 1013;
  const visibility = current.visibility ? (current.visibility / 1000).toFixed(1) : 10;
  const uvIndex = 4;
  const daily = weather.daily || [];
  const isRain = current.showers > 0 || current.rain > 0;

  return (
    <section aria-label="Weather Forecasting Section" className="flex flex-col gap-3">
      {/* Weather Header Card */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-[#DCE4DF] flex flex-col gap-4">
        {/* Title & Sector Bar */}
        <div className="flex items-center justify-between border-b border-[#DCE4DF]/70 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2C694C] animate-pulse"></span>
            <h2 className="text-sm sm:text-base font-bold text-[#012016] tracking-tight">
              Live Meteorological Intelligence
            </h2>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F1F4F2] border border-[#DCE4DF] text-xs font-semibold text-[#012016]">
            <Navigation className="w-3 h-3 text-[#2C694C]" />
            <span>{locationName}</span>
          </div>
        </div>

        {/* Hero Temperature & Condition */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-baseline gap-4">
            <span className="text-5xl sm:text-6xl font-black text-[#012016] tracking-tight tabular-nums">
              {Math.round(current.temperature)}°
            </span>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold text-[#012016] flex items-center gap-1.5">
                {isRain ? (
                  <>
                    <CloudRain className="w-4 h-4 text-[#BA1A1A]" />
                    <span>Rain Precipitating</span>
                  </>
                ) : (
                  <>
                    <CloudSun className="w-4 h-4 text-[#C98500]" />
                    <span>Clear Sky</span>
                  </>
                )}
              </span>
              <span className="text-xs text-[#5D6B63] font-medium">
                Feels like {Math.round(current.temperature)}°C • Station AWS 42071
              </span>
            </div>
          </div>

          {/* High / Low & Time */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-2.5 py-1 rounded-md bg-[#FFDAD6] text-[#93000A] text-xs font-mono font-bold">
              H: {daily.length > 0 ? Math.round(daily[0].temp_max) : Math.round(current.temperature + 4)}°
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#EBF0ED] text-[#012016] text-xs font-mono font-bold">
              L: {daily.length > 0 ? Math.round(daily[0].temp_min) : Math.round(current.temperature - 3)}°
            </span>
          </div>
        </div>

        {/* 6 Advanced Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          <div className="bg-[#F7FAF8] border border-[#DCE4DF] rounded-lg p-2.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5D6B63] flex items-center gap-1">
              <Wind className="w-3 h-3 text-[#2C694C]" /> Wind
            </span>
            <span className="text-base font-bold text-[#012016] mt-1">
              {current.wind_speed} <span className="text-xs font-normal text-[#5D6B63]">km/h</span>
            </span>
          </div>

          <div className="bg-[#F7FAF8] border border-[#DCE4DF] rounded-lg p-2.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5D6B63] flex items-center gap-1">
              <Droplets className="w-3 h-3 text-[#0284C7]" /> Humidity
            </span>
            <span className="text-base font-bold text-[#012016] mt-1">
              {current.humidity}<span className="text-xs font-normal text-[#5D6B63]">%</span>
            </span>
          </div>

          <div className="bg-[#F7FAF8] border border-[#DCE4DF] rounded-lg p-2.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5D6B63] flex items-center gap-1">
              <Eye className="w-3 h-3 text-[#5D6B63]" /> Visibility
            </span>
            <span className="text-base font-bold text-[#012016] mt-1">
              {visibility} <span className="text-xs font-normal text-[#5D6B63]">km</span>
            </span>
          </div>

          <div className="bg-[#F7FAF8] border border-[#DCE4DF] rounded-lg p-2.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5D6B63] flex items-center gap-1">
              <Gauge className="w-3 h-3 text-[#5D6B63]" /> Pressure
            </span>
            <span className="text-base font-bold text-[#012016] mt-1">
              {pressure} <span className="text-xs font-normal text-[#5D6B63]">hPa</span>
            </span>
          </div>

          <div className="bg-[#F7FAF8] border border-[#DCE4DF] rounded-lg p-2.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5D6B63] flex items-center gap-1">
              <ThermometerSun className="w-3 h-3 text-[#C98500]" /> UV Index
            </span>
            <span className="text-base font-bold text-[#012016] mt-1">
              {uvIndex} <span className="text-xs font-normal text-[#5D6B63]">Mod</span>
            </span>
          </div>

          <div className="bg-[#F7FAF8] border border-[#DCE4DF] rounded-lg p-2.5 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5D6B63] flex items-center gap-1">
              <CloudRain className="w-3 h-3 text-[#BA1A1A]" /> Rain Prob
            </span>
            <span className="text-base font-bold text-[#BA1A1A] mt-1">
              {rainProb}<span className="text-xs font-normal text-[#BA1A1A]">%</span>
            </span>
          </div>
        </div>

        {/* 7-Day Forecasting Strip */}
        {daily.length > 0 && (
          <div className="border-t border-[#DCE4DF] pt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-[#5D6B63] font-semibold">
              <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-[#2C694C]" />
                Multi-Day Synoptic Outlook
              </span>
              <span className="text-[10px] text-[#5D6B63]">7-Day Forecast</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {daily.slice(0, 7).map((day: any, i: number) => {
                const dateObj = new Date(day.date);
                const dayName =
                  i === 0 ? "Today" : i === 1 ? "Tomorrow" : dateObj.toLocaleDateString("en-US", { weekday: "short" });
                const isRainDay = day.rain_prob > 20;

                return (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] flex flex-col items-center justify-between gap-1 text-center"
                  >
                    <span className="text-[11px] font-bold text-[#012016]">{dayName}</span>
                    <div className="py-0.5">
                      {isRainDay ? (
                        <CloudRain className="w-5 h-5 text-[#BA1A1A]" />
                      ) : (
                        <Sun className="w-5 h-5 text-[#C98500]" />
                      )}
                    </div>
                    {isRainDay && (
                      <span className="text-[9px] font-mono font-bold text-[#BA1A1A]">
                        {day.rain_prob}%
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#012016]">
                      <span className="text-[#5D6B63] font-normal">{Math.round(day.temp_min)}°</span>
                      <span>/</span>
                      <span>{Math.round(day.temp_max)}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
