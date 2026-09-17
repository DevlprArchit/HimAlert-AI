"use client";

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Wifi,
  QrCode,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface PhoneConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhoneConnectModal({
  isOpen,
  onClose,
}: PhoneConnectModalProps) {
  const [copied, setCopied] = useState(false);
  const [currentHost, setCurrentHost] = useState("");
  const [customIp, setCustomIp] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setCurrentHost(hostname === "localhost" ? "127.0.0.1" : hostname);
    }
  }, []);

  if (!isOpen) return null;

  const targetIp = customIp.trim() || currentHost || "192.168.1.10";
  const mobileUrl = `http://${targetIp}:3000`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    mobileUrl
  )}&bgcolor=F7FAF8&color=012016&margin=10`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(mobileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#DCE4DF] overflow-hidden">
        {/* Header */}
        <div className="bg-[#012016] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2C694C] flex items-center justify-center text-[#B0F1CB]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight flex items-center gap-1.5">
                Run HimAlert on Your Phone
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B0F1CB] text-[#002114] font-bold">
                  0.0.0.0:3000
                </span>
              </h3>
              <p className="text-xs text-[#B0F1CB]/80">
                Live Responsive Mobile Disaster App
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

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF0ED] text-xs font-semibold text-[#012016]">
            <Wifi className="w-3.5 h-3.5 text-[#2C694C] animate-pulse" />
            <span>Connect both devices to the same Wi-Fi</span>
          </div>

          {/* QR Code Container */}
          <div className="p-3 bg-[#F7FAF8] rounded-2xl border-2 border-dashed border-[#2C694C]/40 shadow-inner flex flex-col items-center">
            {/* QR Code Image */}
            <img
              src={qrCodeUrl}
              alt="Scan QR Code to open HimAlert on mobile"
              width={200}
              height={200}
              className="rounded-xl shadow-sm"
            />
            <span className="text-[11px] font-mono font-bold text-[#5D6B63] mt-2 flex items-center gap-1">
              <QrCode className="w-3 h-3 text-[#2C694C]" />
              Scan with your phone camera
            </span>
          </div>

          {/* URL Box with Copy */}
          <div className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-[#F1F4F2] border border-[#DCE4DF]">
            <span className="flex-1 text-xs font-mono font-bold text-[#012016] truncate text-left px-2">
              {mobileUrl}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#2C694C] hover:bg-[#1E4D36] text-white text-xs font-bold flex items-center gap-1 transition-all shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Wi-Fi IP configuration helper */}
          <div className="w-full text-left bg-[#F7FAF8] p-3 rounded-xl border border-[#DCE4DF] text-xs text-[#5D6B63] space-y-2">
            <p className="font-bold text-[#012016] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2C694C]" />
              How to connect in 30 seconds:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
              <li>Open Wi-Fi on your phone and join the same router/hotspot.</li>
              <li>Open your phone's Camera app and tap the detected link.</li>
              <li>
                If you know your PC's IP, enter it below to generate a direct QR code:
              </li>
            </ol>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-mono text-[#012016]">http://</span>
              <input
                type="text"
                placeholder="e.g. 192.168.1.5"
                value={customIp}
                onChange={(e) => setCustomIp(e.target.value)}
                className="flex-1 px-2.5 py-1 text-xs font-mono rounded bg-white border border-[#DCE4DF] text-[#012016] focus:outline-none focus:ring-1 focus:ring-[#2C694C]"
              />
              <span className="text-[11px] font-mono text-[#012016]">:3000</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#012016] hover:bg-black text-white text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
