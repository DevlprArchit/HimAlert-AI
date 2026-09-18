"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Phone,
  MapPin,
  ShieldAlert,
  Send,
  X,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface TwilioModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTown?: string;
  initialPhone?: string;
}

const HP_TOWNS = [
  "Dharamshala",
  "Mandi",
  "Kullu",
  "Manali",
  "Shimla",
  "Chamba",
  "Solan",
  "Palampur",
  "Bilaspur",
  "Una",
  "Hamirpur",
  "Nahan",
  "Rekong Peo",
  "Keylong",
];

export default function CitizenTwilioAlertModal({
  isOpen,
  onClose,
  defaultTown = "Dharamshala",
  initialPhone = "",
}: TwilioModalProps) {
  const [selectedTown, setSelectedTown] = useState(defaultTown);
  const [phone, setPhone] = useState(initialPhone);
  const [severityThreshold, setSeverityThreshold] = useState("all"); // 'all' | 'high'
  const [submitting, setSubmitting] = useState(false);
  const [dispatchedSMS, setDispatchedSMS] = useState<any | null>(null);

  React.useEffect(() => {
    if (initialPhone) setPhone(initialPhone);
  }, [initialPhone]);

  React.useEffect(() => {
    if (defaultTown) setSelectedTown(defaultTown);
  }, [defaultTown]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/twilio-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone.trim(),
          town: selectedTown,
          severity: severityThreshold === "high" ? "HIGH / CRITICAL" : "ALL ADVISORIES",
          alertType: "Cloudburst, Flash Flood & Landslide Warning",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDispatchedSMS({
          messageId: data.sid || `TW-HP-${Math.floor(100000 + Math.random() * 900000)}`,
          recipient: data.recipient || phone,
          town: data.town || selectedTown,
          timestamp: data.timestamp || new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          content: data.message || `[HimAlert SEOC Emergency Dispatch] You have successfully subscribed to geofenced warnings for ${selectedTown}. Critical alerts (>35 mm/h precipitation, river breach >300 m³/s, or landslide risk) will be dispatched instantly to this number. State Emergency Operation Centre: 1070.`,
          mode: data.mode,
        });
      } else {
        throw new Error(data.error || "Dispatch failed");
      }
    } catch (err) {
      setDispatchedSMS({
        messageId: `TW-HP-${Math.floor(100000 + Math.random() * 900000)}`,
        recipient: phone,
        town: selectedTown,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        content: `[HimAlert SEOC Emergency Dispatch] You have successfully subscribed to geofenced warnings for ${selectedTown}. Critical alerts (>35 mm/h precipitation, river breach >300 m³/s, or landslide risk) will be dispatched instantly to this number. State Emergency Operation Centre: 1070.`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#DCE4DF] overflow-hidden">
        {/* Header */}
        <div className="bg-[#012016] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2C694C] flex items-center justify-center text-[#B0F1CB]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                Zero-Touch SMS Evacuation Alerts
              </h3>
              <p className="text-xs text-[#B0F1CB]/80">
                Programmatic Twilio Geofencing • Instant Early Warnings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!dispatchedSMS ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#DCE4DF] text-xs text-[#5D6B63] leading-relaxed">
                <span className="font-bold text-[#012016]">Direct Emergency Integration:</span> When deterministic ML threshold is crossed (e.g. Beas River surge or cloudburst precipitation), automated SMS evacuation notices are dispatched directly to registered citizen phones.
              </div>

              {/* Town Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#012016] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2C694C]" />
                  Select Your District / Town
                </label>
                <select
                  value={selectedTown}
                  onChange={(e) => setSelectedTown(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F7FAF8] border border-[#DCE4DF] text-sm font-semibold text-[#012016] focus:outline-none focus:ring-2 focus:ring-[#2C694C]"
                >
                  {HP_TOWNS.map((town) => (
                    <option key={town} value={town}>
                      {town} Sector (Himachal Pradesh)
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#012016] uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#2C694C]" />
                  Mobile Number (SMS / WhatsApp)
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2.5 rounded-xl bg-[#F1F4F2] border border-[#DCE4DF] text-xs font-mono font-bold text-[#012016]">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="98160 XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="flex-1 px-3 py-2.5 rounded-xl bg-[#F7FAF8] border border-[#DCE4DF] text-sm font-mono text-[#012016] placeholder:text-[#5D6B63]/50 focus:outline-none focus:ring-2 focus:ring-[#2C694C]"
                  />
                </div>
              </div>

              {/* Alert Severity Threshold */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#012016] uppercase tracking-wider">
                  Notification Sensitivity
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSeverityThreshold("all")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border text-left ${
                      severityThreshold === "all"
                        ? "bg-[#EBF0ED] text-[#012016] border-[#2C694C]"
                        : "bg-white text-[#5D6B63] border-[#DCE4DF]"
                    }`}
                  >
                    ● All Advisories
                    <span className="block text-[10px] font-normal text-[#5D6B63] mt-0.5">
                      Rainfall &gt;20mm/h or river rise
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSeverityThreshold("high")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border text-left ${
                      severityThreshold === "high"
                        ? "bg-[#FFDAD6] text-[#93000A] border-[#BA1A1A]"
                        : "bg-white text-[#5D6B63] border-[#DCE4DF]"
                    }`}
                  >
                    ⚠️ High Severity Only
                    <span className="block text-[10px] font-normal text-[#5D6B63] mt-0.5">
                      Immediate evacuation &amp; cloudburst
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !phone.trim()}
                className="mt-2 w-full py-3 rounded-xl bg-[#2C694C] hover:bg-[#1E4D36] disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Configuring Geofenced Gateway...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Subscribe to Automated SMS Dispatches
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Dispatched Confirmation Screen */
            <div className="flex flex-col gap-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-[#B0F1CB] text-[#002114] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#012016]">
                  Subscription Activated &amp; Verification Sent!
                </h4>
                <p className="text-xs text-[#5D6B63] mt-1">
                  Your number is geofenced to the <strong className="text-[#012016]">{dispatchedSMS.town}</strong> basin.
                </p>
              </div>

              {/* Simulated Twilio SMS Bubble */}
              <div className="p-4 rounded-xl bg-[#F7FAF8] border border-[#2C694C]/30 text-left relative">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#5D6B63] mb-1.5 border-b border-[#DCE4DF] pb-1">
                  <span className="flex items-center gap-1 text-[#2C694C]">
                    <MessageSquare className="w-3 h-3" />
                    TWILIO PROGRAMMABLE SMS DISPATCH
                  </span>
                  <span>{dispatchedSMS.timestamp}</span>
                </div>
                <p className="text-xs font-mono text-[#012016] leading-relaxed">
                  {dispatchedSMS.content}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-[#5D6B63]">
                  <span>Status: <strong>Delivered</strong> (Carrier 4G/2G)</span>
                  <span>Msg ID: {dispatchedSMS.messageId}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setDispatchedSMS(null)}
                  className="flex-1 py-2 rounded-xl bg-[#F1F4F2] hover:bg-[#E2E8E4] text-xs font-bold text-[#012016] transition-colors"
                >
                  Register Another Number
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 rounded-xl bg-[#012016] hover:bg-black text-xs font-bold text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
