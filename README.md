# HIM-ALERT AI

> **AI/ML-Based Integrated Early Warning & Impact Prediction System**  
> *Heavy Rainfall • Flash Floods • Landslides | Himachal Pradesh*  
> **HackerVilla Hackathon 2026 | Team Udbhav**  
> *Sustainability & Climate Tech • From Data → Action*

[![HimAlert Live](https://img.shields.io/badge/HimAlert-LIVE%20APP-2C694C?style=for-the-badge&logo=next.js)](http://localhost:3000)
[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Google Earth Engine](https://img.shields.io/badge/Earth%20Engine-NOAA%20DMSP--OLS-4285F4?style=for-the-badge&logo=google)](https://developers.google.com/earth-engine)

---

## 🏔️ The Core Problem

Himachal Pradesh is highly exposed to sudden cloudbursts, catastrophic flash floods, landslides, and flash river surges along the Beas, Sutlej, and Ravi basins. **The gap is not a lack of data — it is fragmented intelligence.**



*Today, these signals are gathered in silos. HimAlert connects them into a single, real-time threat picture.*

---

## ⚡ Four Signals. One Decision.

| Signal | Source | Role in HimAlert |
| :--- | :--- | :--- |
| **1. 🛰️ Satellite** | Google Earth Engine NOAA DMSP-OLS | Nighttime lights radiometry (+0.42 DN/yr) tracking human exposure, infrastructure expansion & topsoil saturation. |
| **2. 🌦️ Weather / Radar** | Open-Meteo & IMD Radar | Convective precipitation intensity (>45 mm/h), 12-hour hyetograph forecasts, and barometric tracking. |
| **3. 🌊 Hydrology** | CWC / NWIC Gauges | Real-time inflow discharge across Beas, Sutlej, Ravi, Chenab, and Parvati with danger capacity breach limits. |
| **4. ⛰️ Terrain** | DEM & Geotechnical Models | Subsurface soil saturation (0–28 cm depth), steep cuttings stability, and mountain drainage gradient analysis. |

---

## 🌟 Key Innovations & Features

### 1. 🧠 Hybrid "Neuro-Symbolic" AI Architecture
- **XGBoost Classifier**: Calculates strict deterministic mathematical risk scores across 12 HP districts.
- **Gemini AI**: Synthesizes the quantitative risk output into contextual, human-readable evacuation advisories and historical benchmark comparisons.

### 2. 🌧️ Interactive Rain Simulator: *"What if it rains more?"*
- Real-time simulation tool allowing disaster operators and citizens to inject simulated precipitation surges:
  - `[Live Telemetry]` (Baseline Open-Meteo Mountain Gauge)
  - `[+10mm Showers]` (Moderate runoff alert)
  - `[+25mm Downpour]` (Upper soil profile saturation exceeded)
  - `[+50mm Cloudburst]` (Critical slope shear collapse & flash flood surge)
- Instantly updates Top Surface Soil (0–7cm), Deep Mountain Soil (7–28cm), and Safe Rain Capacity in real time.

### 3. 🤖 HimAlert AI Disaster Copilot Chatbot
- Grounded directly on **16 datasets** (over 700,000 hourly records) in `C:\Users\archi\Downloads\Csv`:
  - `flood_training.csv` (137 ground-truth records across Chamba, Kangra, Kullu, Manali, Mandi).
  - `reviewed_flood_events_raw.csv` (142 NASA Global Flood Database MODIS verified flood events).
  - `weather_2004.csv` through `weather_2023.csv` (Decadal monsoon extreme weather comparisons).
- Answers any natural language inquiry with rich markdown tables, evacuation directives, and live sensor context.

### 4. 📲 Zero-Touch Automated SMS Dispatch (Twilio Geofencing)
- Programmatic geofencing triggers automated SMS evacuation notices to vulnerable communities when deterministic risk thresholds are mathematically breached.
- Citizen registration modal with custom sensitivity settings.

### 5. ⏱️ 1-Second Real-Time Telemetry Engine
- 1.0 Hz buffered telemetry streaming with live packet ticker, green heartbeat pulse, IST clock, and rolling 20-point animated SVG sparklines.

### 6. 📱 Live Mobile Phone Port (0.0.0.0:3000)
- Built with a mobile-first responsive architecture.
- Tap **"📱 Phone Port"** in the top navigation bar to generate an instant local network QR code for camera scanning.

---

## 🛠️ System Architecture

```
                               ┌───────────────────────────┐
                               │   Next.js 14 Dashboard    │
                               │  (Mobile + Desktop PWA)   │
                               └─────────────┬─────────────┘
                                             │ HTTP / SSE (1.0s Buffer)
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   HimAlert Core Engine                                 │
├──────────────────────────┬───────────────────────────┬─────────────────────────────────┤
│    FastAPI Backend       │     Edge API Routes       │        Grounded Knowledge       │
│  • Hydrological Gauges   │  • /api/chat (Node fs)    │  • 700k+ Hourly Weather CSVs    │
│  • Risk Engine Model     │  • /api/night-lights      │  • NASA MODIS Flood Archives    │
│  • XGBoost Risk Scores   │  • /api/system-info       │  • NOAA DMSP-OLS Radiometry     │
└────────────┬─────────────┴─────────────┬─────────────┴────────────────┬────────────────┘
             │                           │                              │
             ▼                           ▼                              ▼
┌──────────────────────────┐┌──────────────────────────┐┌────────────────────────────────┐
│   Twilio SMS Dispatch    ││     Google Earth Engine  ││    Open-Meteo & IMD Sensors    │
│ (Zero-Touch Evacuation)  ││   (NOAA Night Lights)    ││    (Convective Preciptation)   │
└──────────────────────────┘└──────────────────────────┘└────────────────────────────────┘
```

---

## 🚀 Quick Start & How to Run

### Option A: Run Full Application (Self-Contained Next.js)
```powershell
cd frontend-fixed
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option B: Run on Your Phone (Local Wi-Fi Network)
1. Ensure your phone and laptop are on the same Wi-Fi.
2. Click the **"📱 Phone Port"** button in the dashboard header to view your network IP and scan the QR code.
3. Or open `http://<YOUR_LAN_IP>:3000` in Safari/Chrome on your phone!

### Option C: Run Python FastAPI Backend (Optional)
```powershell
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

---

## 📜 Verified Live Endpoints

| Endpoint | Method | Latency | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | ~300 ms | Main Disaster Intelligence Dashboard |
| `/local` | `GET` | ~150 ms | Citizen Safety SOS & Nearest Relief Shelter Finder |
| `/api/chat` | `POST` | < 100 ms | HimAlert AI Copilot grounded on 16 CSVs |
| `/api/chat/suggestions` | `GET` | 50 ms | Situational prompts carousel |
| `/api/night-lights/trend` | `GET` | 28 ms | NOAA DMSP-OLS radiometry trend (+0.42 DN/yr) |
| `/api/search/cse-config` | `GET` | 40 ms | Google CSE `cx=34671dd3e5b214437` configuration |
| `/noaa_dmsp_ols_himachal.csv` | `GET` | 15 ms | Calibrated radiometry dataset download |

---

## 👥 Authors & Acknowledgments

- **Team Udbhav / VyomForge** (HackerVilla Hackathon 2026)
- **Data Grounding:** NASA Earth Data, Google Earth Engine, Open-Meteo, Central Water Commission (CWC), HP SDMA & NDMA.

*“Buying the ultimate currency: time.”*
