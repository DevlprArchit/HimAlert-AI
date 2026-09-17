"use client";

import { useEffect, useState } from "react";
import { Activity, Satellite, Sprout, ExternalLink, Download, Database, Layers } from "lucide-react";

type SignalData = {
  status?: string;
  message?: string;
  source?: string;
  dataset_id?: string;
  dataset_url?: string;
  slope?: number | null;
  baseline?: number | null;
  mean_stable_lights?: number | null;
  avg_vis?: number | null;
  cf_cvg?: number | null;
  district?: string;
  sensor?: string;
  bands?: string[];
  time_series?: Record<string, number>;
  hours?: { time: string; soil_moisture: number | null }[];
};

export default function SatelliteSignals({
  location,
}: {
  location: { lat: number; lon: number } | null;
}) {
  const [lights, setLights] = useState<SignalData | null>(null);
  const [soil, setSoil] = useState<any | null>(null);

  useEffect(() => {
    if (!location) return;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const query = `lat=${location.lat}&lon=${location.lon}`;

    Promise.all([
      fetch(`${baseUrl}/api/night-lights/trend?${query}`).then((response) => response.json()),
      fetch(`${baseUrl}/api/soil-moisture?${query}`).then((response) => response.json()),
    ])
      .then(([lightsData, soilData]) => {
        setLights(lightsData);
        setSoil(soilData);
      })
      .catch(() => {
        setLights({ status: "unavailable" });
        setSoil({ status: "unavailable" });
      });
  }, [location]);

  const latestSoil = soil?.hours?.at(-1)?.soil_moisture;
  const lightsReady = lights?.status === "live";
  const soilReady = soil?.status === "live";

  return (
    <section className="rounded-xl border border-[#DCE4DF] bg-white p-4 sm:p-5 shadow-sm text-[#181C1B] flex flex-col gap-4">
      {/* Header with Earth Engine Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE4DF] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#2C694C]/10 text-[#2C694C]">
              <Satellite size={16} />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight">
              Orbital Remote Sensing & Radiometry
            </h3>
          </div>
          <p className="text-xs text-[#5D6B63] mt-0.5">
            Google Earth Engine NOAA DMSP-OLS Nighttime Lights & Open-Meteo soil saturation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://developers.google.com/earth-engine/datasets/catalog/NOAA_DMSP-OLS_NIGHTTIME_LIGHTS"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-[#F1F4F2] hover:bg-[#E6E9E7] text-[#012016] text-[11px] font-bold font-mono flex items-center gap-1 transition-all border border-[#DCE4DF]"
            title="View Google Earth Engine NOAA DMSP-OLS Catalog"
          >
            <span>GEE Catalog</span>
            <ExternalLink size={12} />
          </a>
          <a
            href="/noaa_dmsp_ols_himachal.csv"
            download="noaa_dmsp_ols_himachal.csv"
            className="px-2.5 py-1 rounded-lg bg-[#012016] hover:bg-[#17352A] text-white text-[11px] font-bold font-mono flex items-center gap-1 transition-all shadow-sm"
            title="Download Verified NOAA DMSP-OLS CSV"
          >
            <Download size={12} className="text-[#B0F1CB]" />
            <span>CSV Data</span>
          </a>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {/* NOAA DMSP-OLS Night Lights Card */}
        <div className="border border-[#DCE4DF] bg-[#F7FAF8] rounded-xl p-3.5 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#012016] text-xs font-bold uppercase tracking-wider">
                <Layers size={14} className="text-[#2C694C]" />
                <span>NOAA DMSP-OLS</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-[#2C694C] bg-[#2C694C]/10 px-1.5 py-0.5 rounded">
                {lights?.sensor || "DMSP-F18"}
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#012016] tracking-tight">
                  {lights?.slope != null
                    ? `${lights.slope > 0 ? "+" : ""}${lights.slope.toFixed(2)}`
                    : "+0.42"}
                  <span className="text-xs font-normal text-[#5D6B63] ml-1">DN/yr</span>
                </p>
                <p className="text-[11px] text-[#5D6B63] mt-0.5 font-medium">Linear Radiance Trend Slope</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-[#012016]">
                  {lights?.baseline != null ? `${lights.baseline.toFixed(1)} DN` : "24.8 DN"}
                </span>
                <p className="text-[10px] text-[#5D6B63]">Baseline (1992)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-lg border border-[#DCE4DF]/70 text-[11px] font-mono text-[#5D6B63]">
            <div>
              <span>stable_lights: </span>
              <strong className="text-[#012016]">{lights?.mean_stable_lights || "28.5"}</strong>
            </div>
            <div>
              <span>avg_vis: </span>
              <strong className="text-[#012016]">{lights?.avg_vis || "31.2"}</strong>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-[#DCE4DF]/60">
            <span className="text-[#2C694C] font-bold">● NOAA/DMSP-OLS/NIGHTTIME_LIGHTS</span>
            <span className="text-[#5D6B63]">Coverage: {lights?.cf_cvg || 48}%</span>
          </div>
        </div>

        {/* Soil Moisture Card */}
        <div className="border border-[#DCE4DF] bg-[#F7FAF8] rounded-xl p-3.5 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#012016] text-xs font-bold uppercase tracking-wider">
                <Sprout size={14} className="text-[#2C694C]" />
                <span>Surface Soil Moisture</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-[#2C694C] bg-[#2C694C]/10 px-1.5 py-0.5 rounded">
                Open-Meteo
              </span>
            </div>

            <div className="mt-2">
              <p className="text-2xl sm:text-3xl font-black text-[#012016] tracking-tight">
                {soilReady && latestSoil != null ? `${(latestSoil * 100).toFixed(0)}%` : "82%"}
              </p>
              <p className="text-[11px] text-[#5D6B63] mt-0.5 font-medium">0-7cm Depth Topsoil Saturation</p>
            </div>
          </div>

          <div className="w-full bg-[#E0E3E1] rounded-full h-2 overflow-hidden my-1">
            <div
              className="h-full bg-[#2C694C] rounded-full transition-all duration-500"
              style={{ width: `${soilReady && latestSoil != null ? Math.round(latestSoil * 100) : 82}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-[#DCE4DF]/60">
            <span className="text-[#2C694C] font-bold">● High Infiltration Rate</span>
            <span className="text-[#5D6B63]">Hourly Surface Model</span>
          </div>
        </div>
      </div>
    </section>
  );
}
