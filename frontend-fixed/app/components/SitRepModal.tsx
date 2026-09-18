"use client";

import React from "react";
import { X, Printer, Download, CheckCircle, ShieldAlert, Navigation } from "lucide-react";

interface SitRepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SitRepModal({ isOpen, onClose }: SitRepModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#DCE4DF] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#F7FAF8] px-6 py-5 border-b border-[#DCE4DF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#012016] uppercase tracking-wider">
                Situation Report (SitRep)
              </h3>
              <p className="text-[10px] font-mono text-[#5D6B63] uppercase font-bold tracking-wider mt-0.5">
                State Emergency Operations Center • #24-HP
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-[#5D6B63] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-[#181C1B] font-sans leading-relaxed bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#F7FAF8] rounded-xl border border-[#DCE4DF] gap-4">
            <div>
              <span className="block text-[10px] font-bold text-[#5D6B63] uppercase tracking-wider mb-1">Issued By</span>
              <strong className="text-[#012016]">HimAlert Early Warning AI</strong>
            </div>
            <div className="sm:text-right">
              <span className="block text-[10px] font-bold text-[#5D6B63] uppercase tracking-wider mb-1">Date/Time</span>
              <strong className="text-[#012016] font-mono">{new Date().toLocaleString("en-IN")}</strong>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#2C694C] uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2C694C]/10 flex items-center justify-center text-[10px] border border-[#2C694C]/20">1</span>
              Executive Threat Summary
            </h4>
            <p className="p-4 bg-slate-50 rounded-xl text-[#5D6B63]">
              Monsoon trough intensification observed across Central and Northern Himachal Pradesh.
              High soil moisture saturation (&gt;80%) in Mandi, Kullu, and Kangra elevates the probability
              of triggered debris flows and slope failures in the next 12–24 hours.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-[10px] border border-red-200">2</span>
              Critical River & Dam Status
            </h4>
            <ul className="space-y-2 p-4 border border-red-100 bg-red-50/50 rounded-xl">
              <li className="flex gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>Sutlej River (Rampur/Bilaspur):</strong> Flow rate at 84% capacity. Pandoh Dam discharge on standby.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>Beas River (Mandi/Pandoh):</strong> Flow at 72% capacity. Moderate inundation risk for downstream settlements.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Ravi & Chenab:</strong> Normal flow, within safety envelope.</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-[10px] border border-amber-200">3</span>
              Road & Infrastructure Impact
            </h4>
            <ul className="space-y-2 p-4 border border-amber-100 bg-amber-50/50 rounded-xl">
              <li className="flex gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong>NH-21 (Chandigarh-Manali):</strong> Heavy debris reported near 7-Mile Mandi. Traffic suspended.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong>NH-5 (Hindustan-Tibet Road):</strong> One-way traffic permitted near Jeori due to shooting stones.</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] border border-blue-200">4</span>
              Recommended Command Directives
            </h4>
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2 text-[#012016] font-medium">
              <p className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> Deploy 2 NDRF teams to Pandoh & Larji choke points.</p>
              <p className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> Issue immediate evacuation broadcasts via CAP/Cell Broadcast to low-lying zones.</p>
              <p className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> Position earthmovers at vulnerable landslide corridors on NH-3, NH-5, and NH-21.</p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#F7FAF8] px-6 py-4 border-t border-[#DCE4DF] flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] text-[#5D6B63] font-mono font-bold uppercase tracking-wider text-center sm:text-left">
            Confidential • For Official Use
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-white border border-[#DCE4DF] hover:bg-slate-50 text-[#012016] font-bold text-xs rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
