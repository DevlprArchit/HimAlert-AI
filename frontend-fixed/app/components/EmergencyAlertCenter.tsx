"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, 
  Waves, 
  Mountain, 
  CheckCircle2, 
  Radio, 
  Phone, 
  PhoneCall, 
  Share2, 
  CheckSquare, 
  Square, 
  Clock, 
  ExternalLink,
  ShieldAlert,
  Send,
  Check
} from "lucide-react";

interface EmergencyAlertCenterProps {
  onClose?: () => void;
  onOpenSitRep?: () => void;
}

export default function EmergencyAlertCenter({ onClose, onOpenSitRep }: EmergencyAlertCenterProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "high" | "elevated" | "resolved">("all");
  const [acknowledged, setAcknowledged] = useState<{ [key: string]: boolean }>({});
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    "evac-1": false,
    "ndrf-1": true,
    "halt-1": false,
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAcknowledge = (id: string, title: string) => {
    setAcknowledged((prev) => ({ ...prev, [id]: true }));
    showToast(`Notice acknowledged for ${title}. Logged to HP-SDMA audit.`);
  };

  const handleAcknowledgeAll = () => {
    setAcknowledged({ kangra: true, mandi: true, kullu: true });
    showToast("All active notices acknowledged and logged to SEOC HP-SDMA.");
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Alert Center Header Panel */}
      <section className="bg-[#F1F4F2] p-4 sm:p-5 rounded-xl border border-[#DCE4DF] shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#BA1A1A] text-white">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight">
              Emergency Alert Center
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FFDAD6] text-[#93000A] text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#BA1A1A] animate-ping"></span>
            DEFCON 2
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5D6B63]">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-[#181C1B]">2 High Severity Alerts</span>
            <span>•</span>
            <span>1 Active Watch</span>
          </div>
          <span className="font-semibold text-[#2C694C] font-mono">
            HPSDMA Protocol Synced • ISO-22320
          </span>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAcknowledgeAll}
            className="flex-1 h-10 px-3 rounded-lg bg-[#012016] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#17352A] active:scale-[0.98] transition-all shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#B0F1CB]" />
            <span>Acknowledge All Notices</span>
          </button>
          <button
            onClick={() => showToast("CAP XML Relay dispatched to telecom gateway.")}
            className="h-10 px-3 rounded-lg bg-white text-[#012016] text-xs font-bold border border-[#DCE4DF] flex items-center justify-center gap-1.5 hover:bg-[#F7FAF8] active:scale-[0.98] transition-all shadow-sm"
          >
            <Radio className="w-3.5 h-3.5 text-[#2C694C]" />
            <span>CAP Broadcast</span>
          </button>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeFilter === "all"
                ? "bg-[#17352A] text-white shadow-sm"
                : "bg-white text-[#5D6B63] border border-[#DCE4DF] hover:border-[#17352A]"
            }`}
          >
            <span>All Alerts</span>
            <span className="w-4 h-4 rounded-full bg-[#2C694C] text-white flex items-center justify-center text-[10px]">
              3
            </span>
          </button>
          <button
            onClick={() => setActiveFilter("high")}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeFilter === "high"
                ? "bg-[#BA1A1A] text-white shadow-sm"
                : "bg-white text-[#5D6B63] border border-[#DCE4DF] hover:border-[#BA1A1A]"
            }`}
          >
            <span>High Severity</span>
            <span className="w-4 h-4 rounded-full bg-[#BA1A1A] text-white flex items-center justify-center text-[10px]">
              2
            </span>
          </button>
          <button
            onClick={() => setActiveFilter("elevated")}
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeFilter === "elevated"
                ? "bg-[#ED8936] text-white shadow-sm"
                : "bg-white text-[#5D6B63] border border-[#DCE4DF] hover:border-[#ED8936]"
            }`}
          >
            <span>Elevated</span>
            <span className="w-4 h-4 rounded-full bg-[#ED8936] text-white flex items-center justify-center text-[10px]">
              1
            </span>
          </button>
          <button
            onClick={() => setActiveFilter("resolved")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              activeFilter === "resolved"
                ? "bg-[#2C694C] text-white shadow-sm"
                : "bg-white text-[#5D6B63] border border-[#DCE4DF]"
            }`}
          >
            <span>Resolved</span>
          </button>
        </div>
      </section>

      {/* List of Active Alerts */}
      <div className="flex flex-col gap-4">
        {/* Alert 1: Kangra */}
        {(activeFilter === "all" || activeFilter === "high") && (
          <article className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-[#BA1A1A]/30">
            {/* Alert Header Strip */}
            <div className="bg-[#FFDAD6] text-[#93000A] px-4 py-2 flex items-center justify-between border-b border-[#BA1A1A]/20">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#BA1A1A] animate-ping shrink-0"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                  HIGH SEVERITY • FLASH FLOOD & CLOUDBURST
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#BA1A1A] text-white text-[10px] font-extrabold uppercase shrink-0">
                {acknowledged["kangra"] ? "Acknowledged" : "Critical"}
              </span>
            </div>

            <div className="p-4 sm:p-5 flex flex-col gap-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-[#012016] tracking-tight">
                    Kangra District
                  </h3>
                  <p className="text-xs text-[#5D6B63]">
                    Dharamshala, Shahpur & Palampur subdivisions
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-[#BA1A1A]/10 text-[#BA1A1A] text-xs font-bold border border-[#BA1A1A]/20 font-mono">
                  78% Probability
                </span>
              </div>

              {/* Time Details */}
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] text-xs font-mono">
                <div>
                  <span className="text-[#5D6B63] block text-[10px] uppercase">Issued</span>
                  <span className="font-bold text-[#181C1B]">14:05 IST</span>
                </div>
                <div>
                  <span className="text-[#5D6B63] block text-[10px] uppercase">Valid Until</span>
                  <span className="font-bold text-[#BA1A1A]">20:00 IST (5h 28m)</span>
                </div>
              </div>

              {/* Driver */}
              <div className="text-xs leading-relaxed text-[#181C1B]">
                <strong className="text-[#012016] block font-semibold mb-0.5">Primary Weather Driver:</strong>
                Severe convective cloud cell over Dhauladhar range (&gt;45 mm/h). High saturation & surge in Neugal & Gaj khads indicate imminent flash flood risk.
              </div>

              {/* Vulnerable Corridors */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5D6B63]">
                  Vulnerable Infrastructure Corridors:
                </span>
                <div className="flex flex-col gap-1 text-xs">
                  <div className="p-2 rounded bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between">
                    <span className="font-medium text-[#181C1B]">Neugal Catchment (Upper reach overflow)</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#FFDAD6] text-[#93000A] text-[10px] font-bold">Critical</span>
                  </div>
                  <div className="p-2 rounded bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between">
                    <span className="font-medium text-[#181C1B]">Dharamshala-McLeodganj road (Km 4-8 debris)</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#BA1A1A]/10 text-[#BA1A1A] text-[10px] font-bold">Blocked</span>
                  </div>
                  <div className="p-2 rounded bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between">
                    <span className="font-medium text-[#181C1B]">Gaggal Airport perimeter drainage sector</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#EBF0ED] text-[#17352A] text-[10px] font-bold">Alert</span>
                  </div>
                </div>
              </div>

              {/* Mandatory Field Actions Checklist */}
              <div className="p-3.5 rounded-xl bg-[#FFDAD6]/40 border border-[#BA1A1A]/20 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#93000A]">
                  <span>Mandatory Emergency Actions:</span>
                  <span className="text-[10px] uppercase tracking-wider bg-[#BA1A1A] text-white px-1.5 py-0.2 rounded">Immediate</span>
                </div>
                <div className="flex flex-col gap-1.5 text-xs text-[#181C1B]">
                  <label onClick={() => toggleCheck("evac-1")} className="flex items-start gap-2 cursor-pointer select-none">
                    {checklist["evac-1"] ? <CheckSquare className="w-4 h-4 text-[#2C694C] shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-[#BA1A1A] shrink-0 mt-0.5" />}
                    <span className={checklist["evac-1"] ? "line-through text-[#5D6B63]" : "font-medium"}>
                      Evacuate settlements within 200m of riverbanks immediately.
                    </span>
                  </label>
                  <label onClick={() => toggleCheck("ndrf-1")} className="flex items-start gap-2 cursor-pointer select-none">
                    {checklist["ndrf-1"] ? <CheckSquare className="w-4 h-4 text-[#2C694C] shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-[#BA1A1A] shrink-0 mt-0.5" />}
                    <span className={checklist["ndrf-1"] ? "line-through text-[#5D6B63]" : "font-medium"}>
                      Pre-position NDRF 14th Bn & SDRF response teams at Shahpur.
                    </span>
                  </label>
                  <label onClick={() => toggleCheck("halt-1")} className="flex items-start gap-2 cursor-pointer select-none">
                    {checklist["halt-1"] ? <CheckSquare className="w-4 h-4 text-[#2C694C] shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-[#BA1A1A] shrink-0 mt-0.5" />}
                    <span className={checklist["halt-1"] ? "line-through text-[#5D6B63]" : "font-medium"}>
                      Enforce vehicle halt towards Triund & upper Dharamkot trails.
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => handleAcknowledge("kangra", "Kangra District")}
                  disabled={acknowledged["kangra"]}
                  className="flex-1 h-10 px-3 rounded-lg bg-[#2C694C] hover:bg-[#1E4D37] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-60"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{acknowledged["kangra"] ? "Notice Acknowledged" : "Acknowledge Notice"}</span>
                </button>
                {onOpenSitRep && (
                  <button
                    onClick={onOpenSitRep}
                    className="h-10 px-3 rounded-lg bg-[#F1F4F2] text-[#012016] text-xs font-bold border border-[#DCE4DF] hover:bg-[#E6E9E7] transition-all"
                  >
                    Dossier
                  </button>
                )}
                <button
                  onClick={() => showToast("SMS Broadcast initiated to 12,400 registered handsets in Kangra valley.")}
                  className="w-full sm:w-auto h-10 px-3 rounded-lg bg-[#F7FAF8] text-[#012016] text-xs font-semibold border border-[#DCE4DF] hover:bg-[#EBF0ED] flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#2C694C]" />
                  <span>Relay Emergency SMS Broadcast</span>
                </button>
              </div>
            </div>
          </article>
        )}

        {/* Alert 2: Mandi */}
        {(activeFilter === "all" || activeFilter === "high") && (
          <article className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-[#BA1A1A]/30">
            <div className="bg-[#FFDAD6] text-[#93000A] px-4 py-2 flex items-center justify-between border-b border-[#BA1A1A]/20">
              <div className="flex items-center gap-2 min-w-0">
                <Waves className="w-4 h-4 text-[#BA1A1A] shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                  HIGH SEVERITY • BEAS RIVER SURGE ADVISORY
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#BA1A1A] text-white text-[10px] font-extrabold uppercase shrink-0">
                {acknowledged["mandi"] ? "Acknowledged" : "Alert"}
              </span>
            </div>

            <div className="p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-[#012016] tracking-tight">
                    Mandi District
                  </h3>
                  <p className="text-xs text-[#5D6B63]">
                    Beas River Basin & Pandoh Dam Upstream
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-[#BA1A1A]/10 text-[#BA1A1A] text-xs font-bold border border-[#BA1A1A]/20 font-mono">
                  71% Probability
                </span>
              </div>

              <div className="text-xs leading-relaxed text-[#181C1B]">
                Rapid discharge surge caused by cloudburst runoff in Kullu valley. Inflow projection to Pandoh reservoir exceeds <strong className="text-[#BA1A1A]">1,800 m³/s</strong> threshold within 90 minutes.
              </div>

              <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#5D6B63] block text-[10px]">Telemetry Station: Pandoh Inflow</span>
                  <span className="font-bold text-sm text-[#BA1A1A]">1,480 m³/s <span className="text-[11px] font-normal text-[#5D6B63]">(+340 m³/h surge)</span></span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#FFDAD6] text-[#93000A] font-bold text-[10px]">Critical Rise</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleAcknowledge("mandi", "Mandi District")}
                  disabled={acknowledged["mandi"]}
                  className="flex-1 h-10 px-3 rounded-lg bg-[#2C694C] hover:bg-[#1E4D37] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-60"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{acknowledged["mandi"] ? "Notice Acknowledged" : "Acknowledge"}</span>
                </button>
                {onOpenSitRep && (
                  <button
                    onClick={onOpenSitRep}
                    className="h-10 px-3 rounded-lg bg-[#F1F4F2] text-[#012016] text-xs font-bold border border-[#DCE4DF] hover:bg-[#E6E9E7] transition-all"
                  >
                    Hydrograph Telemetry
                  </button>
                )}
              </div>
            </div>
          </article>
        )}

        {/* Alert 3: Kullu */}
        {(activeFilter === "all" || activeFilter === "elevated") && (
          <article className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-[#ED8936]/30">
            <div className="bg-[#B0F1CB]/50 text-[#002112] px-4 py-2 flex items-center justify-between border-b border-[#2C694C]/20">
              <div className="flex items-center gap-2 min-w-0">
                <Mountain className="w-4 h-4 text-[#2C694C] shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                  ELEVATED • LANDSLIDE WATCH
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#ED8936] text-white text-[10px] font-extrabold uppercase shrink-0">
                Watch
              </span>
            </div>

            <div className="p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-[#012016] tracking-tight">
                    Kullu District
                  </h3>
                  <p className="text-xs text-[#5D6B63]">
                    NH-3 Aut-Sainj corridor (Chainage Km 12-28)
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-[#ED8936]/15 text-[#AB5A14] text-xs font-bold border border-[#ED8936]/30 font-mono">
                  64% Probability
                </span>
              </div>

              <p className="text-xs leading-relaxed text-[#181C1B]">
                Antecedent rainfall reached <strong className="text-[#012016]">94 mm over 48 hours</strong>, crossing slope failure saturation baseline. Heavy rockfall reported near Aut tunnel South portal.
              </p>

              <div className="p-2.5 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between text-xs">
                <span className="text-[#181C1B] font-medium">PWD JCBs deployed at Banjar & Larji</span>
                <span className="px-2 py-0.5 rounded bg-[#B0F1CB] text-[#002112] font-bold text-[10px]">Standby</span>
              </div>

              <button
                onClick={() => handleAcknowledge("kullu", "Kullu District")}
                disabled={acknowledged["kullu"]}
                className="h-10 px-3 rounded-lg bg-[#2C694C] hover:bg-[#1E4D37] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-60"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{acknowledged["kullu"] ? "Watch Acknowledged" : "Acknowledge Watch"}</span>
              </button>
            </div>
          </article>
        )}
      </div>

      {/* Verification & Incident Protocols Box */}
      <section className="bg-[#F1F4F2] p-4 sm:p-5 rounded-xl border border-[#DCE4DF] shadow-sm flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#2C694C]" />
            <h3 className="text-sm font-bold text-[#012016] uppercase tracking-wider">
              Verification & Incident Protocols
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#5D6B63] bg-white px-2 py-0.5 rounded border border-[#DCE4DF]">
            Protocol ID: HP-24-082
          </span>
        </div>

        <div className="flex flex-col gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-white border border-[#DCE4DF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2C694C]" />
              <span className="font-medium text-[#181C1B]">IMD Doppler Radar Cross-Referenced</span>
            </div>
            <span className="font-mono text-[11px] text-[#5D6B63]">14:10 IST</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-[#DCE4DF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2C694C]" />
              <span className="font-medium text-[#181C1B]">CWC River Gauge Telemetry Verified</span>
            </div>
            <span className="font-mono text-[11px] text-[#5D6B63]">14:18 IST</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-[#DCE4DF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2C694C]" />
              <span className="font-medium text-[#181C1B]">SDMA Automated Bulletin Broadcast</span>
            </div>
            <span className="font-mono text-[11px] text-[#5D6B63]">14:20 IST</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FFDAD6]/60 border border-[#BA1A1A]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#BA1A1A]" />
              <span className="font-bold text-[#93000A]">District Magistrate Final Confirmation</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#BA1A1A] text-white text-[10px] font-bold font-mono">
              Pending Sign-off
            </span>
          </div>
        </div>

        {/* Quick Dial Helplines */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#5D6B63]">
            Dedicated 24/7 Response Helplines:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href="tel:01892229000"
              className="h-10 px-3 rounded-lg bg-[#012016] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#17352A] transition-all shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#B0F1CB]" />
              <span>Kangra DEOC (01892-229000)</span>
            </a>
            <a
              href="tel:1070"
              className="h-10 px-3 rounded-lg bg-[#BA1A1A] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#93000A] transition-all shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>State EOC Toll-Free 1070</span>
            </a>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#012016] text-white px-4 py-2 rounded-xl shadow-2xl border border-[#DCE4DF] text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#B0F1CB]" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
