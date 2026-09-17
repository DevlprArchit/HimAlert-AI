"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { Search, Globe, AlertTriangle, ExternalLink, Sparkles, RefreshCw } from "lucide-react";

export default function GoogleDisasterSearch() {
  const [query, setQuery] = useState("Himachal Pradesh flood alert");
  const [newsFeed, setNewsFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const QUICK_TOPICS = [
    "HP-SDMA Flood Alert",
    "Beas River Water Level",
    "Kangra Mandi Landslide",
    "IMD Dharamshala Warning",
    "NOAA DMSP-OLS Satellites",
  ];

  const fetchLiveNews = async (searchTerm: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/search/news?query=${encodeURIComponent(searchTerm)}`
      );
      if (res.ok) {
        const data = await res.json();
        setNewsFeed(data.feed || []);
      }
    } catch (e) {
      console.error("Search API error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveNews(query);
  }, []);

  return (
    <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#DCE4DF] flex flex-col gap-4">
      {/* Script for Google Programmable Search Engine cx=34671dd3e5b214437 */}
      <Script
        src="https://cse.google.com/cse.js?cx=34671dd3e5b214437"
        strategy="afterInteractive"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE4DF] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#2C694C]/10 text-[#2C694C]">
              <Globe className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight">
              Real-Time Field Intelligence & Web Reports (Google CSE)
            </h3>
          </div>
          <p className="text-xs text-[#5D6B63] mt-0.5">
            Verified Google Programmable Search Engine (CX: 34671dd3e5b214437) for live disaster advisories & news.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#2C694C]/10 text-[#2C694C] text-[10px] font-mono font-bold uppercase self-start sm:self-auto">
          ● Live Engine Synced
        </span>
      </div>

      {/* Quick Search Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-bold text-[#5D6B63] font-mono uppercase mr-1 shrink-0">
          Topics:
        </span>
        {QUICK_TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => {
              setQuery(topic);
              fetchLiveNews(topic);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              query === topic
                ? "bg-[#012016] text-white shadow-sm font-bold"
                : "bg-[#F1F4F2] text-[#5D6B63] hover:text-[#012016] hover:bg-[#E6E9E7]"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Embedded Google Programmable Search Element */}
      <div className="rounded-xl border border-[#DCE4DF] bg-[#F7FAF8] p-3 sm:p-4">
        <div className="gcse-search"></div>
      </div>

      {/* Live Verified Feeds Fallback / Fast Stream */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5D6B63] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2C694C]" />
            Verified Disaster Feeds for: &ldquo;{query}&rdquo;
          </span>
          {loading && (
            <RefreshCw className="w-3.5 h-3.5 text-[#2C694C] animate-spin" />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {newsFeed.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-[#F7FAF8] hover:bg-white border border-[#DCE4DF] hover:border-[#2C694C] transition-all flex flex-col justify-between gap-2 group shadow-none hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-[#5D6B63] uppercase">
                    {item.source}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono ${
                      item.urgency === "HIGH"
                        ? "bg-[#BA1A1A]/15 text-[#BA1A1A]"
                        : item.urgency === "ELEVATED"
                        ? "bg-[#ED8936]/20 text-[#AB5A14]"
                        : "bg-[#2C694C]/15 text-[#2C694C]"
                    }`}
                  >
                    {item.urgency}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#012016] mt-1 group-hover:text-[#2C694C] transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#5D6B63] mt-1 line-clamp-2 leading-relaxed">
                  {item.snippet}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#2C694C] pt-2 border-t border-[#DCE4DF]/60">
                <span>{item.timestamp}</span>
                <span className="flex items-center gap-0.5 font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>View Source</span>
                  <ExternalLink size={11} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
