"use client";

import React from "react";
import { 
  Activity, 
  Radio, 
  Clock, 
  Pause, 
  Play, 
  RefreshCw, 
  Wifi, 
  Database,
  CloudRain,
  Waves
} from "lucide-react";
import { TelemetryPacket } from "@/hooks/useRealtimeTelemetry";

interface RealtimeStreamBarProps {
  packet: TelemetryPacket;
  isPaused: boolean;
  onTogglePause: () => void;
  onSyncNow: () => void;
  metricDeltas: {
    rainRate: number;
    riverDischarge: number;
    soilMoisturePct: number;
    temp: number;
  };
}

export default function RealtimeStreamBar({
  packet,
  isPaused,
  onTogglePause,
  onSyncNow,
  metricDeltas,
}: RealtimeStreamBarProps) {
  return (
    <div className="w-full bg-[#012016] text-white border-y border-[#2C694C]/30 shadow-md">
      <div className="max-w-[92rem] mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Stream Status & Pulse */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {!isPaused && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B0F1CB] opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isPaused ? "bg-[#BA1A1A]" : "bg-[#2C694C] ring-1 ring-[#B0F1CB]"
                }`}
              ></span>
            </span>
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#B0F1CB] flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-[#B0F1CB]" />
              <span>{isPaused ? "STREAM PAUSED" : "1.0s REAL-TIME STREAM"}</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-[#17352A] px-2 py-0.5 rounded border border-[#2C694C]/40 text-[10px] font-mono text-[#DCE4DF]">
            <Database className="w-3 h-3 text-[#B0F1CB]" />
            <span>BUFFER: {packet.bufferWindowSec.toFixed(1)}s</span>
            <span className="text-[#5D6B63]">•</span>
            <span>1.0 Hz</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 bg-[#17352A] px-2 py-0.5 rounded border border-[#2C694C]/40 text-[10px] font-mono text-[#DCE4DF]">
            <Wifi className="w-3 h-3 text-[#B0F1CB]" />
            <span>LATENCY: {packet.latencyMs}ms</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#17352A] px-2 py-0.5 rounded border border-[#2C694C]/40 text-[10px] font-mono text-[#B0F1CB]">
            <span>PACKET: #{packet.packetId}</span>
          </div>
        </div>

        {/* Center/Right: Live Micro-telemetry Ticker */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono text-[#DCE4DF]">
          <div className="flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-[#B0F1CB]" />
            <span className="text-white font-bold">{metricDeltas.rainRate} mm/h</span>
            <span className="text-[#5D6B63]">(AWS Dharamshala)</span>
          </div>
          <span className="text-[#2C694C]">•</span>
          <div className="flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-[#B0F1CB]" />
            <span className="text-white font-bold">{metricDeltas.riverDischarge} m³/s</span>
            <span className="text-[#5D6B63]">(Pandoh Basin)</span>
          </div>
        </div>

        {/* Right: Clock & Stream Controls */}
        <div className="flex items-center gap-2">
          {/* Live IST Clock */}
          <div className="flex items-center gap-1.5 bg-[#17352A] px-2.5 py-1 rounded-md text-[11px] font-mono text-white font-bold border border-[#2C694C]/40">
            <Clock className="w-3.5 h-3.5 text-[#B0F1CB]" />
            <span>{packet.istTime}</span>
          </div>

          {/* Pause / Resume Button */}
          <button
            onClick={onTogglePause}
            className={`h-7 px-2.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
              isPaused
                ? "bg-[#2C694C] hover:bg-[#337051] text-white"
                : "bg-[#17352A] hover:bg-[#204739] text-[#DCE4DF] border border-[#2C694C]/50"
            }`}
            title={isPaused ? "Resume 1s Telemetry Stream" : "Pause 1s Telemetry Stream"}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span>{isPaused ? "RESUME" : "PAUSE"}</span>
          </button>

          {/* Force Sync Button */}
          <button
            onClick={onSyncNow}
            className="h-7 w-7 rounded bg-[#17352A] hover:bg-[#204739] text-[#B0F1CB] border border-[#2C694C]/50 flex items-center justify-center transition-all active:rotate-180"
            title="Force Synchronize Backend Sensor Cache"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
