"use client";

import { useState, useEffect } from "react";
import { Terminal, Cpu } from "lucide-react";

export default function AITerminal() {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const messages = [
    "Hydrological Risk Engine Online.",
    "Establishing secure uplink with NWIC Government Sensors...",
    "High saturation detected. Flash flood probability 85%.",
    "Weather API sync complete. Next 24h rainfall: 42mm.",
    "Continuous risk evaluation running for Himachal Pradesh.",
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let currentText = "";
    let i = 0;
    const targetText = messages[messageIndex];
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      currentText += targetText.charAt(i);
      setText(currentText);
      i++;
      if (i >= targetText.length) {
        clearInterval(typeInterval);
        setIsTyping(false);
        setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 3000);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [messageIndex]);

  return (
    <div className="w-full bg-black/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-blue-400" />
          <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">AI Core</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"></div>
        </div>
      </div>
      
      <div className="font-mono text-xs md:text-sm min-h-[40px] flex items-start text-blue-100/90 relative z-10 leading-relaxed">
        <Terminal size={14} className="mt-1 mr-2 text-blue-500 shrink-0" />
        <span className="flex-1">
          {text}
          {isTyping && <span className="inline-block w-2 h-4 bg-blue-400 ml-1 translate-y-0.5 animate-pulse"></span>}
        </span>
      </div>
    </div>
  );
}


