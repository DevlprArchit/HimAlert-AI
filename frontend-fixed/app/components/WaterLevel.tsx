"use client";

import { useEffect, useState } from "react";

type WaterLevelData = {
  water_level: number | null;
  unit: string;
  status: string;
  sensor?: string | null;
  timestamp?: string | null;
  source?: string | null;
};

export default function WaterLevel() {
  const [data, setData] = useState<WaterLevelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWaterLevel = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "https://himalert.onrender.com"}/api/water-level`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Water level API failed");
        }

        const result = await response.json();

        console.log("Water Level:", result);

        setData(result);
      } catch (error) {
        console.error("Water Level Error:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWaterLevel();

    // Refresh every 10 seconds
    const interval = setInterval(fetchWaterLevel, 10000);

    return () => clearInterval(interval);
  }, []);

  const hasValidReading =
    data !== null &&
    data.water_level !== null &&
    Number.isFinite(Number(data.water_level)) &&
    data.status !== "UNAVAILABLE";

  const statusColor =
    data?.status === "CRITICAL"
      ? "text-red-500"
      : data?.status === "DANGER"
      ? "text-orange-400"
      : data?.status === "WARNING"
      ? "text-yellow-400"
      : data?.status === "AVAILABLE"
      ? "text-emerald-400"
      : "text-slate-400";

  const barColor =
    data?.status === "CRITICAL"
      ? "bg-red-500"
      : data?.status === "DANGER"
      ? "bg-orange-500"
      : data?.status === "WARNING"
      ? "bg-yellow-400"
      : "bg-emerald-500";

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">
            💧 Live Water Level
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Real-time flood monitoring
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs ${
            hasValidReading
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-slate-700/50 text-slate-400"
          }`}
        >
          {hasValidReading
            ? "LIVE SENSOR"
            : "DATA UNAVAILABLE"}
        </span>
      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (
        <div className="mt-8 text-slate-400">
          Loading verified water-level data...
        </div>
      ) : hasValidReading ? (
        <>
          {/* =================================================
              VALID WATER LEVEL
          ================================================= */}

          <div className="mt-8 flex items-end justify-between">
            <div>
              <p className="text-5xl font-bold">
                {data.water_level}
                <span className="ml-2 text-2xl text-slate-400">
                  {data.unit}
                </span>
              </p>

              <p className={`mt-2 font-semibold ${statusColor}`}>
                {data.status}
              </p>
            </div>

            <div className="text-right text-sm text-slate-500">
              <p>Sensor Status</p>

              <p className="mt-1 text-emerald-400">
                ● Connected
              </p>
            </div>
          </div>

          {/* =================================================
              WATER LEVEL INDICATOR
          ================================================= */}

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>0 cm</span>
              <span>100 cm</span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                style={{
                  width: `${Math.min(
                    Number(data.water_level),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* =================================================
              THRESHOLDS
          ================================================= */}

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-slate-800 p-3">
              <p className="text-xs text-slate-500">
                NORMAL
              </p>

              <p className="mt-1 text-sm text-emerald-400">
                0–59 cm
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-3">
              <p className="text-xs text-slate-500">
                WARNING
              </p>

              <p className="mt-1 text-sm text-yellow-400">
                60–74 cm
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-3">
              <p className="text-xs text-slate-500">
                DANGER
              </p>

              <p className="mt-1 text-sm text-red-400">
                75+ cm
              </p>
            </div>
          </div>

          {/* =================================================
              SOURCE
          ================================================= */}

          <div className="mt-5 border-t border-slate-800 pt-4 text-xs text-slate-500">
            <p>
              Source:{" "}
              {data.source || "CWC / NWIC"}
            </p>

            {data.timestamp && (
              <p className="mt-1">
                Updated: {data.timestamp}
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          {/* =================================================
              NO VERIFIED DATA
          ================================================= */}

          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-950/50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xl">
                🌊
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-300">
                  DATA UNAVAILABLE
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  No verified water-level telemetry
                  reading is currently available for
                  this location.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              SENSOR STATUS
          ================================================= */}

          <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-800/60 p-4">
            <div>
              <p className="text-sm text-slate-400">
                Sensor Status
              </p>

              <p className="mt-1 text-sm text-slate-500">
                No verified telemetry connection
              </p>
            </div>

            <span className="rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-400">
              NOT AVAILABLE
            </span>
          </div>

          {/* =================================================
              SOURCE
          ================================================= */}

          <div className="mt-5 border-t border-slate-800 pt-4 text-xs text-slate-500">
            <p>
              Source:{" "}
              {data?.source || "CWC / NWIC"}
            </p>

            {data?.timestamp && (
              <p className="mt-1">
                Last checked: {data.timestamp}
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
