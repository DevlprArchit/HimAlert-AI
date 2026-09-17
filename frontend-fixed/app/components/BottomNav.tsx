"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, Waves, Building2, ShieldAlert } from "lucide-react";

interface BottomNavProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export default function BottomNav({ activeTab = "overview", onSelectTab }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      id: "overview",
      label: "Command",
      href: "/#overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "map",
      label: "GIS Radar",
      href: "/#map",
      icon: Map,
      badge: null,
    },
    {
      id: "rivers",
      label: "Basins",
      href: "/#rivers",
      icon: Waves,
      badge: null,
    },
    {
      id: "districts",
      label: "Districts",
      href: "/#districts",
      icon: Building2,
      badge: "12",
    },
    {
      id: "local",
      label: "Citizen SOS",
      href: "/local",
      icon: ShieldAlert,
      badge: "112",
    },
  ];

  return (
    <nav
      aria-label="Tactical Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#DCE4DF] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === "local"
              ? pathname === "/local"
              : activeTab === item.id && pathname !== "/local";

          const handleClick = (e: React.MouseEvent) => {
            if (item.id !== "local" && onSelectTab && pathname !== "/local") {
              e.preventDefault();
              onSelectTab(item.id);
            }
          };

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={handleClick}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors relative ${
                isActive ? "text-[#012016] font-bold" : "text-[#5D6B63] hover:text-[#012016]"
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all ${
                  isActive ? "bg-[#2C694C]/15 text-[#012016] scale-105" : ""
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.badge && (
                  <span
                    className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[15px] h-3.5 px-1 rounded-full text-[8px] font-mono font-bold leading-none ${
                      item.badge === "112"
                        ? "bg-[#BA1A1A] text-white animate-pulse"
                        : "bg-[#2C694C] text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-sans tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
