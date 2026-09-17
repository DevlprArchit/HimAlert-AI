"use client";

import React, { useState } from "react";
import { Table, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";

interface DistrictRow {
  name: string;
  focus: string;
  threat: number;
  level: "HIGH" | "ELEV" | "MOD" | "LOW";
  trend: string;
  trendDir: "up" | "down" | "flat";
  status: string;
}

const DISTRICT_DATA: DistrictRow[] = [
  {
    name: "Kangra",
    focus: "Runoff surge",
    threat: 78,
    level: "HIGH",
    trend: "+12%",
    trendDir: "up",
    status: "Peak window",
  },
  {
    name: "Mandi",
    focus: "Beas overflow",
    threat: 72,
    level: "HIGH",
    trend: "+9%",
    trendDir: "up",
    status: "Rising",
  },
  {
    name: "Kullu",
    focus: "Flash surge",
    threat: 63,
    level: "ELEV",
    trend: "+4%",
    trendDir: "up",
    status: "Monitoring",
  },
  {
    name: "Chamba",
    focus: "Convective rain",
    threat: 51,
    level: "MOD",
    trend: "0%",
    trendDir: "flat",
    status: "Steady",
  },
  {
    name: "Shimla",
    focus: "Cut slopes",
    threat: 44,
    level: "LOW",
    trend: "-2%",
    trendDir: "down",
    status: "Easing",
  },
];

export default function PriorityDistrictMatrix({
  onSelectDistrict,
}: {
  onSelectDistrict?: (name: string) => void;
}) {
  const [selected, setSelected] = useState<string>("Kangra");

  const handleSelect = (name: string) => {
    setSelected(name);
    if (onSelectDistrict) onSelectDistrict(name);
  };

  return (
    <section aria-label="Priority District Risk Matrix" className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-[#012016]" />
          <h3 className="text-sm sm:text-base font-bold text-[#012016] tracking-tight">
            Priority District Risk Matrix
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#5D6B63] bg-[#EBF0ED] px-2 py-0.5 rounded-full font-medium">
          5 of 12 Monitored
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#DCE4DF] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-3.5 py-2.5 bg-[#F1F4F2] text-[10px] font-mono uppercase tracking-wider text-[#5D6B63] font-bold border-b border-[#DCE4DF]">
          <div className="col-span-5">District & Focus</div>
          <div className="col-span-4 text-center">Threat Load</div>
          <div className="col-span-3 text-right">Trend (6h)</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#DCE4DF]/60">
          {DISTRICT_DATA.map((row) => {
            const isSelected = selected === row.name;

            const badgeColor =
              row.level === "HIGH"
                ? "bg-[#BA1A1A] text-white"
                : row.level === "ELEV"
                ? "bg-[#ED8936]/20 text-[#AB5A14]"
                : row.level === "MOD"
                ? "bg-[#DCAE37]/20 text-[#8C6B12]"
                : "bg-[#2C694C]/15 text-[#2C694C]";

            const barColor =
              row.level === "HIGH"
                ? "bg-[#BA1A1A]"
                : row.level === "ELEV"
                ? "bg-[#ED8936]"
                : row.level === "MOD"
                ? "bg-[#DCAE37]"
                : "bg-[#2C694C]";

            const indicatorColor =
              row.level === "HIGH"
                ? "bg-[#BA1A1A]"
                : row.level === "ELEV"
                ? "bg-[#ED8936]"
                : row.level === "MOD"
                ? "bg-[#DCAE37]"
                : "bg-[#2C694C]";

            return (
              <div
                key={row.name}
                onClick={() => handleSelect(row.name)}
                className={`grid grid-cols-12 items-center px-3.5 py-3 hover:bg-[#F7FAF8] cursor-pointer transition-colors ${
                  isSelected ? "bg-[#F1F4F2]/70" : "bg-white"
                }`}
              >
                {/* District & Focus */}
                <div className="col-span-5 flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-7 rounded-full ${indicatorColor} shrink-0`}></span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#012016] truncate">
                        {row.name}
                      </span>
                      <span className={`px-1 py-0.2 rounded text-[9px] font-mono font-bold ${badgeColor}`}>
                        {row.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5D6B63] truncate leading-tight">
                      {row.focus}
                    </p>
                  </div>
                </div>

                {/* Threat Load Meter */}
                <div className="col-span-4 px-2 flex flex-col justify-center gap-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span
                      className={`font-bold ${
                        row.level === "HIGH" ? "text-[#BA1A1A]" : "text-[#012016]"
                      }`}
                    >
                      {row.threat}
                    </span>
                    <span className="text-[#5D6B63]">/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E0E3E1] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${row.threat}%` }}
                    ></div>
                  </div>
                </div>

                {/* Trend (6h) */}
                <div className="col-span-3 text-right flex flex-col items-end">
                  <span
                    className={`text-xs font-mono font-bold flex items-center gap-0.5 ${
                      row.trendDir === "up"
                        ? "text-[#BA1A1A]"
                        : row.trendDir === "down"
                        ? "text-[#2C694C]"
                        : "text-[#5D6B63]"
                    }`}
                  >
                    {row.trendDir === "up" && <TrendingUp className="w-3 h-3" />}
                    {row.trendDir === "down" && <TrendingDown className="w-3 h-3" />}
                    {row.trendDir === "flat" && <Minus className="w-3 h-3" />}
                    {row.trend}
                  </span>
                  <span className="text-[9px] text-[#5D6B63] font-medium">{row.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
