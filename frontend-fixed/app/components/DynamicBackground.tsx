"use client";

import React from "react";

export default function DynamicBackground({
  condition,
  mode = "authority",
  children,
}: {
  condition?: string;
  mode?: "individual" | "authority";
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-[#F7FAF8] overflow-x-hidden selection:bg-[#2C694C]/20">
      {/* 1. Dreamcore Ambient Lighting Canvas (Floating Slow Orbs) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
        {/* Top Left Alpine Pine Aurora */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#2C694C]/20 via-[#B0F1CB]/25 to-transparent blur-[120px] animate-dreamcore-aura"
          style={{ animationDuration: "14s" }}
        />

        {/* Top Right Ethereal Moonlight Glow */}
        <div
          className="absolute top-10 -right-20 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-[#B0F1CB]/30 via-[#2C694C]/15 to-transparent blur-[130px] animate-dreamcore-aura"
          style={{ animationDuration: "18s", animationDelay: "-4s" }}
        />

        {/* Center-Left Mountain Twilight Mist */}
        <div
          className="absolute top-1/2 -left-40 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#17352A]/15 via-[#72DA9F]/15 to-transparent blur-[140px] animate-dreamcore-aura"
          style={{ animationDuration: "22s", animationDelay: "-8s" }}
        />

        {/* Bottom Right Golden Amber Accent */}
        <div
          className="absolute -bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#FFE088]/20 via-[#B0F1CB]/15 to-transparent blur-[120px] animate-dreamcore-aura"
          style={{ animationDuration: "16s", animationDelay: "-6s" }}
        />
      </div>

      {/* 2. Dreamcore Tactile Noise & Grain Overlay */}
      <div className="dreamcore-noise fixed inset-0 pointer-events-none -z-10" />

      {/* 3. Subtle Atmospheric Grid Lines (Signature Motion Sites) */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(rgba(44, 105, 76, 0.12) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* 4. Content Layer */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
