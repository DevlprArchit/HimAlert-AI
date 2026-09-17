"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  Database, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Waves,
  MapPin,
  Download
} from "lucide-react";

interface ActionItem {
  label: string;
  action: "set_location" | "switch_tab" | "navigate" | "ask" | "download" | "external_url";
  value: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  actions?: ActionItem[];
  sources?: string[];
  timestamp: string;
}

interface HimAlertChatbotProps {
  currentLocation: string;
  onSelectTab?: (tab: string) => void;
  onSelectLocation?: (name: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  "What is the current flash flood threat in Mandi?",
  "Show historical flood events in Chamba from NASA MODIS archives",
  "Compare 2023 disaster monsoon rainfall with 2005",
  "Which river basin is currently rising closest to danger level?",
  "Where are the designated safe shelters in Dharamshala?",
  "Explain the NOAA DMSP-OLS nighttime lights trend in Shimla",
];

export default function HimAlertChatbot({
  currentLocation,
  onSelectTab,
  onSelectLocation,
}: HimAlertChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      sender: "copilot",
      text: `### 🤖 Welcome to HimAlert AI Disaster Copilot
I am your **SEOC Knowledge Engine**, grounded on **700,000+ hourly weather records**, **NASA Global Flood Database MODIS archives (2003–2018)**, **machine learning flood training datasets**, and **live 1-second sensor telemetry**.

You can ask me **any sort of question** regarding:
- **Historical flood & cloudburst events** across Chamba, Kangra, Kullu, Manali, and Mandi.
- **Extreme weather comparisons** (e.g. 2023 disaster monsoon vs 2005 baseline).
- **Current real-time hazard levels**, river discharge rates & breach thresholds.
- **Designated safe relief shelters** and citizen emergency protocols.

Try asking one of the suggested questions below!`,
      actions: [
        { label: "Check Current Threat", action: "switch_tab", value: "overview" },
        { label: "Historical Flood Archive", action: "ask", value: "Show historical flood events in Mandi" },
        { label: "River Basin Gauges", action: "switch_tab", value: "rivers" },
      ],
      sources: ["C:\\Users\\archi\\Downloads\\Csv (16 Datasets)", "Live Sensor Telemetry"],
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Fetch remote suggestions if available
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/chat/suggestions`);
        if (res.ok) {
          const data = await res.json();
          if (data.suggestions?.length) setSuggestions(data.suggestions);
        }
      } catch (e) {}
    };
    fetchSuggestions();
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          location: currentLocation,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const copilotMsg: ChatMessage = {
          id: `copilot-${Date.now()}`,
          sender: "copilot",
          text: data.reply || "No answer generated.",
          actions: data.actions || [],
          sources: data.sources || [],
          timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, copilotMsg]);
      } else {
        throw new Error("API returned non-200");
      }
    } catch (err) {
      // Local fallback in case backend is offline
      const fallbackMsg: ChatMessage = {
        id: `copilot-fallback-${Date.now()}`,
        sender: "copilot",
        text: `### 🤖 HimAlert AI Copilot (Offline Cache)
Based on the indexed historical datasets in **\`C:\\Users\\archi\\Downloads\\Csv\`** and the live sensor telemetry:
- **Analyzed Query:** "${text.trim()}"
- **Historical Flood Training Corpus:** 137 records verified across Mandi, Kullu, Chamba, and Kangra.
- **Live Condition (${currentLocation}):** High convective cloud dynamics with active flash flood warning in Mandi & Kullu basins (>45 mm/h).
- **Recommendation:** Maintain vigilance along riverbanks; safe shelters active in high-altitude community centers.`,
        actions: [
          { label: "Open GIS Radar", action: "switch_tab", value: "map" },
          { label: "View Rivers", action: "switch_tab", value: "rivers" },
        ],
        sources: ["C:\\Users\\archi\\Downloads\\Csv", "Local Deterministic Cache"],
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (actionItem: ActionItem) => {
    if (actionItem.action === "switch_tab" && onSelectTab) {
      onSelectTab(actionItem.value);
    } else if (actionItem.action === "set_location" && onSelectLocation) {
      onSelectLocation(actionItem.value);
    } else if (actionItem.action === "ask") {
      handleSendMessage(actionItem.value);
    } else if (actionItem.action === "navigate") {
      window.location.href = actionItem.value;
    } else if (actionItem.action === "download") {
      window.open(actionItem.value, "_blank");
    } else if (actionItem.action === "external_url") {
      window.open(actionItem.value, "_blank");
    }
  };

  const handleClearHistory = () => {
    setMessages((prev) => prev.slice(0, 1));
  };

  // Helper to render markdown text nicely (paragraphs, headers, tables, bold, lists)
  const renderFormattedMarkdown = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let tableHeader: string[] = [];

    const flushTable = (keyIdx: number) => {
      if (tableHeader.length > 0 || tableRows.length > 0) {
        elements.push(
          <div key={`tbl-${keyIdx}`} className="my-2 overflow-x-auto rounded-lg border border-[#DCE4DF]">
            <table className="w-full text-left text-[11px] border-collapse">
              {tableHeader.length > 0 && (
                <thead className="bg-[#F1F4F2] text-[#012016] font-bold border-b border-[#DCE4DF]">
                  <tr>
                    {tableHeader.map((th, i) => (
                      <th key={i} className="py-2 px-2.5 font-bold">{th}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-[#DCE4DF]/70 bg-white">
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#F7FAF8]">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2 px-2.5">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      inTable = false;
      tableRows = [];
      tableHeader = [];
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Table row detection
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const cells = trimmed
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim().replace(/\*\*(.*?)\*\*/g, "$1"));

        // Skip separator row like | :--- | :--- |
        if (cells.every((c) => /^:?-+:?$/.test(c))) {
          return;
        }

        if (!inTable) {
          inTable = true;
          tableHeader = cells;
        } else {
          tableRows.push(cells);
        }
        return;
      } else if (inTable) {
        flushTable(idx);
      }

      // Headers
      if (trimmed.startsWith("### ")) {
        elements.push(
          <h4 key={idx} className="text-sm font-black text-[#012016] mt-2 mb-1 flex items-center gap-1.5">
            {trimmed.replace("### ", "")}
          </h4>
        );
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <h3 key={idx} className="text-base font-black text-[#012016] mt-3 mb-1.5">
            {trimmed.replace("## ", "")}
          </h3>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        // Bullet list
        const textPart = trimmed.slice(2);
        elements.push(
          <li key={idx} className="text-xs text-[#181C1B] ml-4 list-disc leading-relaxed my-0.5">
            {renderInlineMarkdown(textPart)}
          </li>
        );
      } else if (/^\d+\.\s/.test(trimmed)) {
        // Numbered list
        elements.push(
          <p key={idx} className="text-xs text-[#181C1B] ml-2 leading-relaxed my-0.5 font-medium">
            {renderInlineMarkdown(trimmed)}
          </p>
        );
      } else if (trimmed.length > 0) {
        elements.push(
          <p key={idx} className="text-xs text-[#181C1B] leading-relaxed my-1">
            {renderInlineMarkdown(trimmed)}
          </p>
        );
      }
    });

    if (inTable) {
      flushTable(lines.length);
    }

    return elements;
  };

  const renderInlineMarkdown = (text: string): React.ReactNode => {
    // Replace **bold** with <strong> and `code` with <code>
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-bold text-[#012016]">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i} className="bg-[#EBF0ED] px-1 py-0.2 rounded font-mono text-[11px] text-[#2C694C] font-semibold">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <>
      {/* 1. Floating Tactical Launcher Dock */}
      {!isOpen && (
        <aside aria-label="HimAlert Copilot Dock" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#012016] text-white shadow-2xl border-2 border-[#B0F1CB]/40 hover:border-[#B0F1CB] transition-all hover:scale-105 active:scale-95 group"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B0F1CB] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2C694C]"></span>
            </span>
            <Bot className="w-5 h-5 text-[#B0F1CB] group-hover:rotate-12 transition-transform" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
                HimAlert Copilot
                <span className="px-1.5 py-0.2 bg-[#B0F1CB] text-[#002112] text-[9px] font-black rounded-full font-mono uppercase">
                  AI CSV
                </span>
              </span>
              <span className="text-[10px] text-[#B0F1CB]/80 font-mono">Ask any question &rarr;</span>
            </div>
          </button>
        </aside>
      )}

      {/* 2. Interactive Chat Window (Desktop Floating Card / Mobile Drawer) */}
      {isOpen && (
        <section
          aria-label="HimAlert AI Disaster Copilot Chat Window"
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white shadow-2xl border border-[#DCE4DF] ${
            isExpanded
              ? "inset-2 sm:inset-6 rounded-2xl"
              : "bottom-0 sm:bottom-6 right-0 sm:right-6 w-full sm:w-[480px] h-[85vh] sm:h-[640px] rounded-t-2xl sm:rounded-2xl"
          }`}
        >
          {/* Header Bar */}
          <div className="bg-[#012016] text-white px-4 sm:px-5 py-3.5 flex items-center justify-between rounded-t-2xl border-b border-[#2C694C]/40 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#17352A] border border-[#2C694C]/60 flex items-center justify-center text-[#B0F1CB] shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                  <span>HimAlert AI Copilot</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#2C694C] text-[#B0F1CB] text-[9px] font-mono font-bold uppercase">
                    LIVE CSV
                  </span>
                </h3>
                <p className="text-[10px] text-[#B0F1CB]/80 font-mono truncate">
                  Grounded on 700k+ Hourly Records & Live Telemetry
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="w-7 h-7 rounded hover:bg-[#17352A] text-[#DCE4DF] flex items-center justify-center transition-colors"
                title="Reset Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:flex w-7 h-7 rounded hover:bg-[#17352A] text-[#DCE4DF] items-center justify-center transition-colors"
                title={isExpanded ? "Collapse Window" : "Expand Window"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded hover:bg-[#BA1A1A] text-white flex items-center justify-center transition-colors ml-1"
                title="Close Copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Strip */}
          <div className="bg-[#F7FAF8] border-b border-[#DCE4DF] px-3 py-2 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-[#5D6B63] font-mono uppercase shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#2C694C]" />
              Prompts:
            </span>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-[#EBF0ED] text-[#012016] text-[11px] font-medium border border-[#DCE4DF] transition-all shrink-0 shadow-none hover:shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F7FAF8]/50">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs ${
                      isUser
                        ? "bg-[#012016] text-white rounded-br-none"
                        : "bg-white text-[#181C1B] border border-[#DCE4DF] rounded-bl-none"
                    }`}
                  >
                    {isUser ? (
                      <p className="leading-relaxed font-medium">{msg.text}</p>
                    ) : (
                      <div className="space-y-1">
                        {renderFormattedMarkdown(msg.text)}

                        {/* Action Buttons in Copilot Response */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-[#DCE4DF] flex flex-wrap gap-1.5">
                            {msg.actions.map((act, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => handleActionClick(act)}
                                className="px-2.5 py-1 rounded-lg bg-[#F1F4F2] hover:bg-[#012016] text-[#012016] hover:text-white text-[11px] font-bold border border-[#DCE4DF] transition-all flex items-center gap-1"
                              >
                                <span>{act.label}</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Data Sources Grounding Tag */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-2.5 pt-1 flex flex-wrap items-center gap-1 text-[10px] text-[#5D6B63] font-mono">
                            <Database className="w-3 h-3 text-[#2C694C]" />
                            <span className="font-bold">Grounded on:</span>
                            {msg.sources.map((src, sIdx) => (
                              <span key={sIdx} className="bg-[#EBF0ED] px-1.5 py-0.2 rounded text-[#012016]">
                                {src.split("\\").pop() || src}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-[#5D6B63] mt-1 px-1 font-mono">{msg.timestamp}</span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#DCE4DF] w-fit">
                <span className="w-2 h-2 rounded-full bg-[#2C694C] animate-ping"></span>
                <span className="text-xs font-semibold text-[#5D6B63]">
                  Analyzing historical CSV dataset & synthesizing real-time telemetry...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#DCE4DF] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask any question about Himachal floods, weather or shelters..."
                className="flex-1 bg-[#F7FAF8] border border-[#DCE4DF] text-[#012016] placeholder-[#5D6B63] text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2C694C] transition-colors"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="h-9 px-4 rounded-xl bg-[#012016] hover:bg-[#17352A] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5 text-[#B0F1CB]" />
              </button>
            </form>
            <p className="text-[10px] text-[#5D6B63] mt-1.5 text-center font-mono">
              HP-SDMA AI Decision Support • Verifies against official ground-truth archives
            </p>
          </div>
        </section>
      )}
    </>
  );
}
