"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import HimAlertLogo from "./HimAlertLogo";
import { 
  RefreshCw, 
  FileText, 
  ChevronRight, 
  AlertTriangle, 
  ShieldCheck, 
  LayoutDashboard, 
  Map, 
  Waves, 
  Building2, 
  Radio
} from "lucide-react";

interface AuthorityHeaderProps {
  onOpenSitRep?: () => void;
  onOpenPhoneConnect?: () => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onRefresh?: () => void;
  alertCount?: number;
}

export default function AuthorityHeader({
  onOpenSitRep,
  activeTab = "overview",
  onSelectTab,
  onRefresh,
  alertCount = 2,
}: AuthorityHeaderProps) {
  const [time, setTime] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const navTabs = [
    { id: "overview", label: "Command Hub", icon: LayoutDashboard },
    { id: "map", label: "GIS Radar", icon: Map },
    { id: "rivers", label: "River Basins", icon: Waves },
    { id: "districts", label: "All 12 Districts", icon: Building2 },
    { id: "alerts", label: "Emergency Alerts", icon: AlertTriangle, badge: alertCount },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DCE4DF] shadow-[0_1px_4px_rgba(23,53,42,0.04)]">
      {/* Top Application Bar */}
      <div className="max-w-[92rem] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Logo & Operational Sector */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <HimAlertLogo className="h-8" />
          </Link>
          <div className="h-6 w-px bg-[#DCE4DF] hidden sm:block"></div>
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#17352A] bg-[#EBF0ED] px-1.5 py-0.5 rounded">
                SEOC HP-SDMA
              </span>
              <span className="text-[11px] text-[#5D6B63] font-medium">• State Command</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#5D6B63] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C694C] animate-pulse"></span>
              <span>HP Live {time || "14:30:00 IST"}</span>
            </div>
          </div>
        </div>

        {/* Desktop View Navigation Tabs */}
        {onSelectTab && (
          <nav className="hidden lg:flex items-center gap-1 bg-[#F1F4F2] p-1 rounded-xl border border-[#DCE4DF]">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? "bg-[#012016] text-white shadow-sm"
                      : "text-[#5D6B63] hover:text-[#012016] hover:bg-white/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-[#BA1A1A] text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Tactical Actions & Nav */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            aria-label="Refresh Data"
            title="Refresh Live Sensor Feeds"
            className="h-9 px-2.5 sm:px-3 rounded-lg bg-[#F1F4F2] hover:bg-[#E6E9E7] text-[#17352A] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border border-[#DCE4DF]"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2C694C] ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Sync</span>
          </button>

          {/* SitRep Modal Button */}
          {onOpenSitRep && (
            <button
              onClick={onOpenSitRep}
              className="h-9 px-3 rounded-lg bg-[#012016] hover:bg-[#17352A] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-[#B0F1CB]" />
              <span className="hidden sm:inline">Export SitRep</span>
            </button>
          )}

          {/* Run on Phone Button */}
          {onOpenPhoneConnect && (
            <button
              onClick={onOpenPhoneConnect}
              className="h-9 px-2.5 sm:px-3 rounded-lg bg-[#012016] hover:bg-[#17352A] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              title="Open HimAlert on your mobile phone"
            >
              <span>📱</span>
              <span className="hidden sm:inline">Phone Port</span>
            </button>
          )}

          {/* Citizen Emergency View link */}
          <Link
            href="/local"
            className="h-9 px-3 rounded-lg bg-[#B0F1CB]/50 hover:bg-[#B0F1CB] text-[#002112] text-xs font-bold flex items-center gap-1.5 transition-all border border-[#2C694C]/30 active:scale-95 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#D94747] animate-ping"></span>
            <span>Citizen SOS</span>
          </Link>
        </div>
      </div>

      {/* Active Incident Advisory Strip */}
      <aside className="bg-[#012016] text-white px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs shadow-inner">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#BA1A1A] text-white shrink-0 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-white" />
          </span>
          <p className="font-mono text-[11px] tracking-wide truncate text-[#F7FAF8]">
            <span className="font-bold text-[#FFDAD6] uppercase tracking-wider mr-1.5">
              Flash Flood Warning:
            </span>
            Mandi & Kullu Basins • Beas-Neugal breach risk threshold crossed (&gt;45 mm/h)
          </p>
        </div>
        <button
          onClick={onOpenSitRep}
          className="flex items-center gap-0.5 text-[11px] font-semibold text-[#B0F1CB] hover:underline shrink-0"
        >
          <span>Protocol 082</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </aside>
    </header>
  );
}
