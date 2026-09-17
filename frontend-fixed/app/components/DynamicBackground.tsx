import React from 'react';

// A mapping of weather conditions to beautiful Unsplash images
const backgroundImages: Record<string, string> = {
  'Sunny': 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=2574',
  'Clear': 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=2574',
  'Partly Cloudy': 'https://images.unsplash.com/photo-1595853035070-59a39fb7fa94?q=80&w=2000',
  'Cloudy': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2000',
  'Overcast': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2000',
  'Rain': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2000',
  'Showers': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2000',
  'Thunderstorm': 'https://images.unsplash.com/photo-1605727216801-e27ce1d0ce49?q=80&w=2000',
  'Snow': 'https://images.unsplash.com/photo-1542601098-8fc114e148e2?q=80&w=2000',
  'Fog': 'https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=2000',
  'Mist': 'https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=2000',
};

// Default fallback
const defaultBg = 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2000'; // Moody clouds

export default function DynamicBackground({ 
  condition, 
  mode = "individual",
  children 
}: { 
  condition?: string; 
  mode?: "individual" | "authority";
  children: React.ReactNode;
}) {
  let matchedBg = defaultBg;
  
  if (condition) {
    const lowerCondition = condition.toLowerCase();
    for (const [key, url] of Object.entries(backgroundImages)) {
      if (lowerCondition.includes(key.toLowerCase())) {
        matchedBg = url;
        break;
      }
    }
  }

  const modeBackground = mode === "authority"
    ? "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2200"
    : "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=2200";
  const activeBackground = condition ? matchedBg : modeBackground;

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image Layer */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 -z-20 saturate-[0.7]"
        style={{ backgroundImage: `url('${activeBackground}')` }}
      />
      {/* Overlay to ensure text readability */}
      <div className="fixed inset-0 w-full h-full bg-slate-950/70 backdrop-blur-[3px] -z-10" />
      <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-cyan-950/20 via-slate-950/30 to-slate-950/90 -z-10" />
      
      {/* Content Layer */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
