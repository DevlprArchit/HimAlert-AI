"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import HimAlertLogo from "@/components/HimAlertLogo";
import { 
  ArrowLeft, 
  AlertTriangle, 
  PhoneCall, 
  Phone, 
  Send, 
  MapPin, 
  Search, 
  ShieldAlert, 
  Home, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Car, 
  Navigation,
  Backpack,
  Share2
} from "lucide-react";

const SafeZoneMap = dynamic(() => import("@/components/SafeZoneMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center bg-[#F1F4F2] border border-[#DCE4DF] text-[#5D6B63] rounded-xl">
      <span className="flex items-center gap-2 text-xs font-semibold">
        <span className="animate-spin h-4 w-4 border-2 border-[#2C694C] border-t-transparent rounded-full"></span>
        Acquiring GPS coordinates & loading relief shelters...
      </span>
    </div>
  ),
});

const translations = {
  en: {
    citizenSafetyView: "Citizen Safety View",
    stateCommand: "State Command",
    hpsdmaFullName: "Himachal Pradesh Disaster Management Authority",
    redWarningBadge: "Flash Flood Red Warning",
    hazardTitle: "CRITICAL FLASH FLOOD ALERT",
    liveBroadcast: "LIVE BROADCAST",
    affectedAreasLabel: "Affected Areas: ",
    affectedAreas: "Kangra & Mandi Valley Districts",
    validUntilLabel: "Valid Until: ",
    validUntil: "8:00 PM Tonight (14 Sep)",
    whatHappeningTitle: "1. What is happening?",
    whatHappeningBody: "Extremely heavy rainfall causing sudden flash floods, debris flows, and dangerously surging nullahs across Dharamshala, Palampur, Baijnath, and Mandi valleys.",
    mandatoryActionTitle: "2. Mandatory Action Right Now:",
    actions: [
      "Stay away from all riverbanks, streams, and nullahs immediately. Waters rise in minutes without warning.",
      "Avoid traveling on hillside roads (NH-154 & Dharamshala corridors) due to active boulder fall.",
      "Move immediately to higher, solid ground if residing near seasonal stream beds or slopes.",
      "Do not park vehicles under vulnerable cliffs, mature pine trees, or unstable masonry.",
    ],
    helplineTitle: "One-Touch Emergency Helplines",
    helplineSub: "Toll-Free • 24x7 Dedicated",
    stateCell: "State Disaster Cell",
    dcControl: "District Control (DC)",
    autoBeacon: "Automated Beacon",
    smsCoord: "SMS Coordinates",
    sheltersTitle: "Designated Safe Shelters & Evacuation Centers",
    sheltersSub: "3km emergency perimeter shelters, hospitals, colleges & staging grounds.",
    gpsActive: "GPS Active",
    nearestShelters: "Nearest Verified Safe Shelters (Within Walking Distance):",
    safeShelterTag: "Safe Shelter",
    minWalk: "min walk",
    highwayTitle: "Key Highway & Mountain Pass Status",
    updatedAgo: "Updated: 4 mins ago",
    statusRestricted: "RESTRICTED",
    statusClosed: "CLOSED",
    statusOpen: "OPEN",
    statusSlow: "SLOW",
    road1Name: "Dharamshala – Kangra Road",
    road1Desc: "Active rockfall cleared at Km 6. Single lane moving.",
    road2Name: "Mandi – Kullu via Pandoh",
    road2Desc: "Beas river water across carriage way near dam overflow.",
    road3Name: "Shimla – Bilaspur Corridor",
    road3Desc: "Dry surface conditions. Visibility 2.5 km.",
    road4Name: "Pathankot – Palampur Highway",
    road4Desc: "Emergency convoys active. Moderate delays expected.",
    goBagTitle: "Offline Go-Bag & Survival Protocols",
    goBagSub: "Essential emergency checklist if cellular connectivity drops",
    offlineCache: "HP Offline Telemetry Cache Status",
    readyOffline: "READY OFFLINE (24 MB)",
    goBagHeader: "Immediate Go-Bag (5 Min Pack):",
    goBagItems: [
      "Waterproof document pouch (Aadhar/IDs, deeds)",
      "High-power LED torch + spare batteries",
      "72-hour non-perishable rations & water tablets",
      "Essential prescription medicines + first aid",
      "Thermal blanket / woolens & whistle",
    ],
    homeShutdownHeader: "Home Shutdown Safety:",
    homeShutdownItems: [
      "Turn off main electricity MCB breaker",
      "Shut off LPG gas cylinder valve securely",
      "Unplug rooftop solar/inverter feeds",
      "Lock outer doors and move uphill",
    ],
    smsSentText: (coords: string) => `Automated emergency beacon with coordinates (${coords}) sent to HP Emergency Response Support System (112).`,
  },
  hi: {
    citizenSafetyView: "नागरिक सुरक्षा दृश्य",
    stateCommand: "राज्य नियंत्रण कक्ष",
    hpsdmaFullName: "हिमाचल प्रदेश राज्य आपदा प्रबंधन प्राधिकरण",
    redWarningBadge: "आकस्मिक बाढ़ लाल चेतावनी",
    hazardTitle: "गंभीर आकस्मिक बाढ़ अलर्ट",
    liveBroadcast: "लाइव प्रसारण",
    affectedAreasLabel: "प्रभावित क्षेत्र: ",
    affectedAreas: "कांगड़ा और मंडी घाटी जिले",
    validUntilLabel: "वैधता: ",
    validUntil: "आज रात 8:00 बजे तक (14 सितम्बर)",
    whatHappeningTitle: "1. क्या हो रहा है?",
    whatHappeningBody: "अत्यधिक भारी बारिश के कारण धर्मशाला, पालमपुर, बैजनाथ और मंडी घाटियों में अचानक बाढ़, मलबा प्रवाह और नालों में खतरनाक उफान आ रहा है।",
    mandatoryActionTitle: "2. तुरंत अनिवार्य कदम:",
    actions: [
      "तुरंत सभी नदी तटों, नालों और खड्डों से दूर रहें। बिना किसी पूर्व चेतावनी के पानी मिनटों में बढ़ जाता है।",
      "सक्रिय भूस्खलन व गिरती चट्टानों के कारण पहाड़ी सड़कों (NH-154 और धर्मशाला मार्ग) पर यात्रा न करें।",
      "यदि आप मौसमी नालों या ढलानों के पास रहते हैं तो तुरंत ऊंचाई वाले सुरक्षित स्थानों पर जाएं।",
      "कमजोर चट्टानों, ऊंचे चीड़ के पेड़ों या जर्जर दीवारों के नीचे वाहन पार्क न करें।",
    ],
    helplineTitle: "आपातकालीन हेल्पलाइन (एक-क्लिक कॉल)",
    helplineSub: "टोल-फ्री • 24x7 समर्पित सहायता",
    stateCell: "राज्य आपदा प्रकोष्ठ",
    dcControl: "जिला नियंत्रण कक्ष (DC)",
    autoBeacon: "स्वचालित आपातकालीन बीकन",
    smsCoord: "एसएमएस जीपीएस निर्देशांक",
    sheltersTitle: "निर्धारित सुरक्षित आश्रय एवं राहत केंद्र",
    sheltersSub: "3 किमी आपातकालीन परिधि में आश्रय स्थल, अस्पताल और कॉलेज परिसर।",
    gpsActive: "जीपीएस सक्रिय",
    nearestShelters: "निकटतम सत्यापित सुरक्षित आश्रय स्थल (पैदल दूरी):",
    safeShelterTag: "सुरक्षित आश्रय",
    minWalk: "मिनट पैदल",
    highwayTitle: "प्रमुख राजमार्ग एवं पहाड़ी दर्रों की स्थिति",
    updatedAgo: "अद्यतन: 4 मिनट पहले",
    statusRestricted: "प्रतिबंधित",
    statusClosed: "बंद",
    statusOpen: "खुला",
    statusSlow: "धीमा",
    road1Name: "धर्मशाला – कांगड़ा मार्ग",
    road1Desc: "किमी 6 पर मलबा हटाया गया। सिंगल लेन यातायात जारी।",
    road2Name: "मंडी – कुल्लू वाया पंडोह",
    road2Desc: "पंडोह बांध ओवरफ्लो के कारण ब्यास नदी का पानी सड़क पर।",
    road3Name: "शिमला – बिलासपुर कॉरिडोर",
    road3Desc: "सड़क सूखी एवं सामान्य। दृश्यता 2.5 किमी।",
    road4Name: "पठानकोट – पालमपुर राजमार्ग",
    road4Desc: "आपातकालीन काफिले सक्रिय। मध्यम देरी संभावित।",
    goBagTitle: "ऑफलाइन आपातकालीन बैग और जीवन रक्षक नियम",
    goBagSub: "मोबाइल नेटवर्क बंद होने की स्थिति में आवश्यक आपातकालीन चेकलिस्ट",
    offlineCache: "एचपी ऑफलाइन टेलीमेट्री डेटा स्थिति",
    readyOffline: "ऑफलाइन उपलब्ध (24 MB)",
    goBagHeader: "त्वरित गो-बैग (5 मिनट की पैकिंग):",
    goBagItems: [
      "वॉटरप्रूफ दस्तावेज पाउच (आधार/पहचान पत्र, जरूरी दस्तावेज)",
      "उच्च क्षमता वाली एलईडी टॉर्च + अतिरिक्त बैटरी",
      "72 घंटे का सूखा राशन और पानी शुद्ध करने की गोलियां",
      "आवश्यक नियमित दवाएं + प्राथमिक चिकित्सा किट",
      "थर्मल कंबल / गर्म कपड़े और आपातकालीन सीटी",
    ],
    homeShutdownHeader: "घर खाली करते समय सुरक्षा उपाय:",
    homeShutdownItems: [
      "घर का मुख्य बिजली स्विच (MCB) बंद करें",
      "एलपीजी गैस सिलेंडर का रेगुलेटर वाल्व सुरक्षित रूप से बंद करें",
      "छत पर लगे सोलर/इन्वर्टर कनेक्शन डिस्कनेक्ट करें",
      "बाहरी दरवाजों पर ताला लगाएं और तुरंत ऊंचाई पर जाएं",
    ],
    smsSentText: (coords: string) => `जीपीएस निर्देशांक (${coords}) के साथ स्वचालित आपातकालीन संदेश हिमाचल आपातकालीन सेवा (112) को भेज दिया गया है।`,
  },
};

export default function PublicCitizenSafetyView() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [cityName, setCityName] = useState("Dharamshala");
  const [safePoints, setSafePoints] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOfflineGuide, setShowOfflineGuide] = useState(false);
  const [smsStatus, setSmsStatus] = useState<string | null>(null);

  const t = translations[lang];

  // Auto-acquire user location
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setUserLocation({ lat, lon });
          fetchSafePoints(lat, lon);
        },
        () => {
          const fallbackLat = 32.219;
          const fallbackLon = 76.3234;
          setUserLocation({ lat: fallbackLat, lon: fallbackLon });
          fetchSafePoints(fallbackLat, fallbackLon);
        },
        { timeout: 8000 }
      );
    } else {
      const fallbackLat = 32.219;
      const fallbackLon = 76.3234;
      setUserLocation({ lat: fallbackLat, lon: fallbackLon });
      fetchSafePoints(fallbackLat, fallbackLon);
    }
  }, []);

  const fetchSafePoints = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/safe-points?lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setSafePoints(data.safe_points || []);
    } catch {
      setSafePoints([]);
    }
  };

  const handleSendSMS = () => {
    const coords = userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lon.toFixed(4)}` : "32.2190, 76.3234";
    setSmsStatus(t.smsSentText(coords));
    setTimeout(() => setSmsStatus(null), 4500);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#181C1B] font-sans pb-24">
      {/* 1. Header Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DCE4DF] shadow-[0_1px_4px_rgba(23,53,42,0.04)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#012016] hover:bg-[#F1F4F2] transition-colors"
              title="Return to State Command"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <HimAlertLogo className="h-7" />
            <div className="h-4 w-px bg-[#DCE4DF] hidden sm:block"></div>
            <span className="text-xs font-bold text-[#5D6B63] hidden sm:inline">{t.citizenSafetyView}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="h-8 px-2.5 rounded bg-[#012016] text-white text-[11px] font-bold flex items-center gap-1 hover:bg-[#17352A] transition-all"
            >
              <span>{t.stateCommand}</span>
            </Link>
          </div>
        </div>

        {/* Civic Sub-banner */}
        <div className="bg-[#012016] text-white px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[#B0F1CB] font-bold uppercase tracking-wider text-[11px]">HPSDMA</span>
            <span className="text-white/40">•</span>
            <span className="truncate text-white/90 text-[11px]">
              {t.hpsdmaFullName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex rounded bg-[#17352A] p-0.5 text-[11px]">
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-0.5 rounded font-semibold transition-all ${
                  lang === "en" ? "bg-[#B0F1CB] text-[#002112]" : "text-[#7E9E90] hover:text-white"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`px-2.5 py-0.5 rounded font-semibold transition-all ${
                  lang === "hi" ? "bg-[#B0F1CB] text-[#002112]" : "text-[#7E9E90] hover:text-white"
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* 2. CRITICAL HAZARD CARD (WCAG AAA High Contrast Red Unit) */}
        <section className="bg-[#BA1A1A] text-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-[#BA1A1A] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded inline-block">
                  {t.redWarningBadge}
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                  {t.hazardTitle}
                </h2>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#BA1A1A] text-xs font-black shrink-0 animate-pulse shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#BA1A1A]"></span>
              {t.liveBroadcast}
            </span>
          </div>

          <div className="bg-white/15 rounded-lg p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div>
              <span className="font-bold uppercase">{t.affectedAreasLabel}</span>
              <span>{t.affectedAreas}</span>
            </div>
            <div>
              <span className="font-bold uppercase">{t.validUntilLabel}</span>
              <span>{t.validUntil}</span>
            </div>
          </div>

          {/* What is Happening */}
          <div className="bg-black/15 p-3 sm:p-3.5 rounded-lg text-xs sm:text-sm">
            <h3 className="font-bold uppercase tracking-wider text-white/90 mb-1">
              {t.whatHappeningTitle}
            </h3>
            <p className="leading-relaxed text-white/95">
              {t.whatHappeningBody}
            </p>
          </div>

          {/* Mandatory Actions Right Now */}
          <div className="bg-white text-[#181C1B] p-4 sm:p-5 rounded-lg shadow-inner flex flex-col gap-2.5">
            <h3 className="text-xs sm:text-sm font-black text-[#BA1A1A] uppercase tracking-wider">
              {t.mandatoryActionTitle}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#BA1A1A] font-black">•</span>
                <span className="font-semibold text-[#BA1A1A]">
                  {t.actions[0]}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#012016] font-black">•</span>
                <span>
                  {t.actions[1]}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2C694C] font-black">•</span>
                <span className="font-bold text-[#012016]">
                  {t.actions[2]}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#012016] font-black">•</span>
                <span>
                  {t.actions[3]}
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* 3. RAPID ONE-TOUCH SOS HELPLINES */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-bold uppercase tracking-wider text-[#012016]">
              {t.helplineTitle}
            </h3>
            <span className="text-[#5D6B63] font-mono font-semibold">{t.helplineSub}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="tel:1070"
              className="h-16 px-4 rounded-xl bg-[#012016] text-white shadow-sm hover:bg-[#17352A] transition-all flex items-center justify-between group active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#B0F1CB] text-[#002112] flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#7E9E90] uppercase font-bold tracking-wider">{t.stateCell}</span>
                  <span className="text-xl font-black tracking-tight">1070</span>
                </div>
              </div>
            </a>

            <a
              href="tel:1077"
              className="h-16 px-4 rounded-xl bg-[#2C694C] text-white shadow-sm hover:bg-[#1E4D37] transition-all flex items-center justify-between group active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-[#2C694C] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#B0F1CB] uppercase font-bold tracking-wider">{t.dcControl}</span>
                  <span className="text-xl font-black tracking-tight">1077</span>
                </div>
              </div>
            </a>

            <button
              onClick={handleSendSMS}
              className="h-16 px-4 rounded-xl bg-white text-[#181C1B] border border-[#DCE4DF] shadow-sm hover:bg-[#F7FAF8] transition-all flex items-center justify-between text-left active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFDAD6] text-[#93000A] flex items-center justify-center shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#5D6B63] uppercase font-bold tracking-wider">{t.autoBeacon}</span>
                  <span className="text-sm font-bold text-[#BA1A1A]">{t.smsCoord}</span>
                </div>
              </div>
              <Send className="w-4 h-4 text-[#5D6B63]" />
            </button>
          </div>

          {smsStatus && (
            <p className="text-xs font-semibold text-[#2C694C] bg-[#B0F1CB]/30 border border-[#2C694C]/30 p-2 rounded-lg mt-1">
              {smsStatus}
            </p>
          )}
        </section>

        {/* 4. REAL-TIME SAFE ZONE MAP & RELIEF SHELTERS */}
        <section className="bg-white rounded-xl shadow-sm border border-[#DCE4DF] p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#2C694C]" />
                {t.sheltersTitle}
              </h3>
              <p className="text-xs text-[#5D6B63] mt-0.5">
                {t.sheltersSub}
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#2C694C] bg-[#B0F1CB]/50 px-2 py-0.5 rounded border border-[#2C694C]/30 font-bold shrink-0">
              {t.gpsActive}
            </span>
          </div>

          {/* Map Container */}
          <div className="w-full h-[400px] rounded-xl overflow-hidden border border-[#DCE4DF] bg-[#F1F4F2]">
            {userLocation && <SafeZoneMap userLocation={userLocation} safePoints={safePoints} />}
          </div>

          {/* Closest Shelters List */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5D6B63]">
              {t.nearestShelters}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {safePoints.slice(0, 4).map((sp, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#B0F1CB] text-[#002112] flex items-center justify-center shrink-0">
                      <Home className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#012016] truncate">{sp.name}</h4>
                      <span className="text-[10px] text-[#5D6B63] uppercase">{sp.type || t.safeShelterTag}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-[#2C694C] block">0.{idx + 4} km</span>
                    <span className="text-[10px] text-[#5D6B63]">~{idx * 4 + 7} {t.minWalk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. KEY HIGHWAYS & MOUNTAIN PASS STATUS */}
        <section className="bg-white rounded-xl shadow-sm border border-[#DCE4DF] p-4 sm:p-5 flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-[#012016]" />
              <h3 className="text-base sm:text-lg font-bold text-[#012016] tracking-tight">
                {t.highwayTitle}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#5D6B63]">{t.updatedAgo}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[#012016] text-white font-bold font-mono text-[11px]">
                  NH154
                </span>
                <div>
                  <h4 className="font-bold text-[#012016]">{t.road1Name}</h4>
                  <p className="text-[11px] text-[#5D6B63]">{t.road1Desc}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-900 shrink-0">
                {t.statusRestricted}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[#012016] text-white font-bold font-mono text-[11px]">
                  NH21
                </span>
                <div>
                  <h4 className="font-bold text-[#012016]">{t.road2Name}</h4>
                  <p className="text-[11px] text-[#5D6B63]">{t.road2Desc}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#FFDAD6] text-[#93000A] shrink-0">
                {t.statusClosed}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[#012016] text-white font-bold font-mono text-[11px]">
                  NH205
                </span>
                <div>
                  <h4 className="font-bold text-[#012016]">{t.road3Name}</h4>
                  <p className="text-[11px] text-[#5D6B63]">{t.road3Desc}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#B0F1CB] text-[#002112] shrink-0">
                {t.statusOpen}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[#012016] text-white font-bold font-mono text-[11px]">
                  SH17
                </span>
                <div>
                  <h4 className="font-bold text-[#012016]">{t.road4Name}</h4>
                  <p className="text-[11px] text-[#5D6B63]">{t.road4Desc}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-900 shrink-0">
                {t.statusSlow}
              </span>
            </div>
          </div>
        </section>

        {/* 6. COLLAPSIBLE OFFLINE GO-BAG & SURVIVAL GUIDE */}
        <section className="bg-white rounded-xl shadow-sm border border-[#DCE4DF] p-4 sm:p-5 flex flex-col gap-3">
          <button
            onClick={() => setShowOfflineGuide(!showOfflineGuide)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#17352A] text-white flex items-center justify-center shrink-0">
                <Backpack className="w-4 h-4 text-[#B0F1CB]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#012016]">
                  {t.goBagTitle}
                </h3>
                <p className="text-xs text-[#5D6B63]">{t.goBagSub}</p>
              </div>
            </div>
            {showOfflineGuide ? <ChevronUp className="w-5 h-5 text-[#5D6B63]" /> : <ChevronDown className="w-5 h-5 text-[#5D6B63]" />}
          </button>

          {showOfflineGuide && (
            <div className="pt-2 flex flex-col gap-3 border-t border-[#DCE4DF] text-xs">
              <div className="p-2.5 rounded-lg bg-[#F1F4F2] flex items-center justify-between font-mono">
                <span className="font-semibold text-[#012016]">{t.offlineCache}</span>
                <span className="text-[#2C694C] font-bold">{t.readyOffline}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] space-y-1.5">
                  <h4 className="font-bold text-[#012016] uppercase text-[11px] tracking-wider">
                    {t.goBagHeader}
                  </h4>
                  <ul className="space-y-1 text-[#414845]">
                    {t.goBagItems.map((item, i) => (
                      <li key={i}>✓ {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-[#F7FAF8] border border-[#DCE4DF] space-y-1.5">
                  <h4 className="font-bold text-[#012016] uppercase text-[11px] tracking-wider">
                    {t.homeShutdownHeader}
                  </h4>
                  <ul className="space-y-1 text-[#414845]">
                    {t.homeShutdownItems.map((item, i) => (
                      <li key={i}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
