import React from "react";

export default function HimAlertLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        viewBox="0 0 160 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-h-10"
      >
        <g transform="translate(4, 4)">
          {/* Mountain Peaks */}
          <path d="M4 28L14 12L20 20L28 6L38 28H4Z" fill="#17352A" fillOpacity="0.95" />
          <path d="M14 12L19 7L24 14L20 20L14 12Z" fill="#2E6B4D" />
          <path d="M28 6L32 12L26 18L20 20L28 6Z" fill="#3C9964" />
          {/* Warning / radar pulse beacon at summit */}
          <circle cx="28" cy="6" r="3" fill="#D94747" />
          <circle cx="28" cy="6" r="6" stroke="#D94747" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.85">
            <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Brand Wordmark */}
        <text
          x="50"
          y="24"
          fontFamily="system-ui, sans-serif"
          fontSize="19"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="-0.5"
        >
          Him<tspan fill="#D94747">Alert</tspan>
        </text>
        <text
          x="51"
          y="34"
          fontFamily="system-ui, sans-serif"
          fontSize="7.5"
          fontWeight="600"
          fill="#5D6B63"
          letterSpacing="1"
        >
          DISASTER INTELLIGENCE
        </text>
      </svg>
    </div>
  );
}
