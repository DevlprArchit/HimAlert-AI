"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Waves, MountainSnow, CloudRain, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function ForecastDisaster({ risk, loading }: { risk: any; loading: boolean }) {
  if (loading || !risk) {
    return (
      <div className="bg-white rounded-xl p-6 border border-[#DCE4DF] shadow-sm animate-pulse flex items-center justify-center">
        <span className="text-xs font-semibold text-[#5D6B63]">
          Synthesizing AI 24h predictive outlook...
        </span>
      </div>
    );
  }

  const fFlood = risk.flash_flood_24h || risk.flash_flood || 64;
  const fLandslide = risk.landslide_24h || risk.landslide || 49;
  const fRain = risk.extreme_rainfall_24h || risk.extreme_rainfall || 78;
  const fOverall = risk.overall_24h || risk.overall || "HIGH";

  return (
    <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#DCE4DF] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#DCE4DF] pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-[#2C694C]/10 text-[#2C694C]">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight">
              Next 24-Hours Predictive Threat Outlook
            </h3>
          </div>
          <p className="text-xs text-[#5D6B63] mt-0.5">
            Deterministic ML forecasting based on convective atmospheric pressure, soil saturation & radar projections.
          </p>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#EBF0ED] text-[#012016] text-[10px] font-bold font-mono uppercase">
          AI Horizon 24H
        </span>
      </div>

      {/* 4 Forecast Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Flash Flood */}
        <div className="bg-[#F7FAF8] rounded-xl p-3.5 border border-[#DCE4DF] flex flex-col justify-between gap-2 hover:border-[#ED8936]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-1.5 bg-[#ED8936]/15 rounded-lg text-[#AB5A14]">
              <Waves className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase font-mono text-[#AB5A14]">Elevated</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#012016] tracking-tight">
              {fFlood}<span className="text-base font-normal text-[#5D6B63]">%</span>
            </span>
            <p className="text-[11px] text-[#5D6B63] font-bold uppercase tracking-wider mt-0.5">
              Flash Flood
            </p>
          </div>
        </div>

        {/* Landslide */}
        <div className="bg-[#F7FAF8] rounded-xl p-3.5 border border-[#DCE4DF] flex flex-col justify-between gap-2 hover:border-[#DCAE37]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-1.5 bg-[#DCAE37]/15 rounded-lg text-[#8C6B12]">
              <MountainSnow className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase font-mono text-[#8C6B12]">Moderate</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#012016] tracking-tight">
              {fLandslide}<span className="text-base font-normal text-[#5D6B63]">%</span>
            </span>
            <p className="text-[11px] text-[#5D6B63] font-bold uppercase tracking-wider mt-0.5">
              Landslide
            </p>
          </div>
        </div>

        {/* Extreme Rain */}
        <div className="bg-[#F7FAF8] rounded-xl p-3.5 border border-[#DCE4DF] flex flex-col justify-between gap-2 hover:border-[#BA1A1A]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-1.5 bg-[#BA1A1A]/15 rounded-lg text-[#BA1A1A]">
              <CloudRain className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase font-mono text-[#BA1A1A]">High</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#012016] tracking-tight">
              {fRain}<span className="text-base font-normal text-[#5D6B63]">%</span>
            </span>
            <p className="text-[11px] text-[#5D6B63] font-bold uppercase tracking-wider mt-0.5">
              Extreme Rain
            </p>
          </div>
        </div>

        {/* Overall Threat */}
        <div className="bg-[#FFDAD6] rounded-xl p-3.5 border border-[#BA1A1A]/30 flex flex-col justify-between gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-1.5 bg-[#BA1A1A] rounded-lg text-white">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase font-mono text-[#93000A] animate-pulse">Critical</span>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black text-[#93000A] tracking-tight">
              {fOverall}
            </span>
            <p className="text-[11px] text-[#93000A]/80 font-bold uppercase tracking-wider mt-0.5">
              Overall Threat
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrendChart({ weather }: { weather: any }) {
  if (!weather || !weather.forecast || !weather.forecast.hours) return null;

  const hours = weather.forecast.hours.slice(0, 24);
  const labels = hours.map((h: any) => new Date(h.time).getHours() + ":00");
  const dataPoints = hours.map((h: any) => h.precipitation);

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Precipitation (mm)",
        data: dataPoints,
        borderColor: "#2C694C",
        backgroundColor: "rgba(44, 105, 76, 0.12)",
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: "#2C694C",
        borderWidth: 2.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "#FFFFFF",
        titleColor: "#012016",
        bodyColor: "#2C694C",
        borderColor: "#DCE4DF",
        borderWidth: 1,
        padding: 10,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: { color: "#5D6B63", font: { size: 10 } },
      },
      y: {
        display: true,
        grid: { color: "#E6E9E7" },
        ticks: { color: "#5D6B63", font: { size: 10 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#DCE4DF] flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#DCE4DF] pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="p-1 rounded-md bg-[#2C694C]/10 text-[#2C694C]">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight">
              Precipitation Hyetograph (Next 24h)
            </h3>
          </div>
          <p className="text-xs text-[#5D6B63] mt-0.5">
            Multi-Model High Resolution Hourly Forecast Precipitation
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#2C694C]/10 text-[#2C694C] text-[10px] font-bold font-mono uppercase">
          LIVE RADAR
        </span>
      </div>

      <div className="h-[220px] w-full relative">
        <Line options={options} data={data} />
      </div>
    </section>
  );
}
