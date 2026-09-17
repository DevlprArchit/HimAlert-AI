"use client";

import React from "react";
import { X, Printer, Download, CheckCircle, ShieldAlert } from "lucide-react";

interface SitRepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SitRepModal({ isOpen, onClose }: SitRepModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              State Emergency Operations Center (SEOC) • Situation Report #24-HP
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 font-sans leading-relaxed">
          <div className="border-b border-slate-800 pb-3 flex justify-between text-slate-400">
            <div>
              <strong>Issued by:</strong> HimAlert Multi-Hazard Early Warning AI
            </div>
            <div>
              <strong>Date/Time:</strong> {new Date().toLocaleString("en-IN")}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-cyan-400 uppercase tracking-wider mb-1">1. Executive Threat Summary</h4>
            <p>
              Monsoon trough intensification observed across Central and Northern Himachal Pradesh.
              High soil moisture saturation (&gt;80%) in Mandi, Kullu, and Kangra elevates the probability
              of triggered debris flows and slope failures in the next 12–24 hours.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-rose-400 uppercase tracking-wider mb-1">2. Critical River & Dam Status</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Sutlej River (Rampur/Bilaspur):</strong> Flow rate at 84% capacity. Pandoh Dam discharge on standby.</li>
              <li><strong>Beas River (Mandi/Pandoh):</strong> Flow at 72% capacity. Moderate inundation risk for downstream settlements.</li>
              <li><strong>Ravi & Chenab:</strong> Normal flow, within safety envelope.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-1">3. Road & Infrastructure Impact</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>NH-21 (Chandigarh-Manali):</strong> Heavy debris reported near 7-Mile Mandi. Traffic suspended.</li>
              <li><strong>NH-5 (Hindustan-Tibet Road):</strong> One-way traffic permitted near Jeori due to shooting stones.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-emerald-400 uppercase tracking-wider mb-1">4. Recommended Command Directives</h4>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <p>✔️ Deploy 2 NDRF teams to Pandoh & Larji choke points.</p>
              <p>✔️ Issue immediate evacuation broadcasts via CAP/Cell Broadcast to low-lying zones.</p>
              <p>✔️ Position earthmovers at vulnerable landslide corridors on NH-3, NH-5, and NH-21.</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">Confidential • For Official Disaster Response Use</span>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-md shadow"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
