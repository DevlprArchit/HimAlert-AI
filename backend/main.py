from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from cachetools import TTLCache
from fastapi.responses import FileResponse
from pathlib import Path

from services.weather import get_weather
from services.risk_history import (
    save_risk_history,
    get_risk_history,
)
from services.risk_engine import calculate_risk
from services.alerts import generate_alerts
from services.water_level import (
    get_water_level,
    get_all_water_levels,
)
from services.safe_points import get_safe_points
from services.rainfall import (
    get_government_rainfall,
    get_all_government_rainfall,
)
from services.earth_engine import get_night_lights_trend
from services.predictions import predict_risk
from services.chatbot_service import answer_query
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


app = FastAPI(title="HimAlert API")


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "https://frontend-fixed-sandy.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# LOCATIONS
# ============================================================

LOCATIONS = {
    "Dharamshala": {"latitude": 32.2190, "longitude": 76.3234},
    "Kangra": {"latitude": 32.0998, "longitude": 76.2691},
    "Mandi": {"latitude": 31.7080, "longitude": 76.9320},
    "Kullu": {"latitude": 31.9570, "longitude": 77.1090},
    "Manali": {"latitude": 32.2396, "longitude": 77.1887},
    "Shimla": {"latitude": 31.1048, "longitude": 77.1734},
    "Chamba": {"latitude": 32.5540, "longitude": 76.1260},
    "Solan": {"latitude": 30.9045, "longitude": 77.0967},
    "Bilaspur": {"latitude": 31.3340, "longitude": 76.7560},
    "Hamirpur": {"latitude": 31.6860, "longitude": 76.5220},
    "Una": {"latitude": 31.4680, "longitude": 76.2700},
    "Sirmaur": {"latitude": 30.5660, "longitude": 77.2970},
    "Kinnaur": {"latitude": 31.5840, "longitude": 78.2720},
    "Lahaul-Spiti": {"latitude": 32.5710, "longitude": 77.3790},
}


import requests

# ============================================================
# SEARCH LOCATIONS
# ============================================================
@app.get("/api/locations/search")
def search_locations(query: str):
    try:
        res = requests.get(f"https://geocoding-api.open-meteo.com/v1/search?name={query}&count=5&language=en&format=json")
        data = res.json()
        results = data.get("results", [])
        # Filter for India/Himachal Pradesh if possible, or just return top results
        # To be safe and broad, we return the top 5 matches
        return {"results": [{"name": r.get("name"), "admin1": r.get("admin1"), "country": r.get("country"), "latitude": r.get("latitude"), "longitude": r.get("longitude")} for r in results]}
    except Exception as e:
        return {"results": []}

# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "HimAlert API is running"
    }


# ============================================================
# SINGLE LOCATION RISK
# ============================================================

@app.get("/api/risk")
def get_risk(lat: float = None, lon: float = None):

    location_name = "Dharamshala" if not lat else "My Location"
    location = LOCATIONS[location_name] if not lat else {"latitude": lat, "longitude": lon}

    # --------------------------------------------------------
    # Weather
    # --------------------------------------------------------

    weather = get_weather(
        latitude=location["latitude"],
        longitude=location["longitude"],
    )

    # --------------------------------------------------------
    # Water level
    # --------------------------------------------------------

    water_level = get_water_level(location_name, lat=lat, lon=lon)

    # --------------------------------------------------------
    # Government rainfall
    # --------------------------------------------------------

    government_rainfall = get_government_rainfall(location_name, latitude=lat, longitude=lon)

    # --------------------------------------------------------
    # Risk calculation
    # --------------------------------------------------------

    risk = calculate_risk(
        weather,
        water_level,
        government_rainfall,
    )

    # Keep complete government rainfall information
    risk["government_rainfall"] = government_rainfall

    # --------------------------------------------------------
    # Save history
    # --------------------------------------------------------

    save_risk_history(
        location=location_name,
        risk_data=risk,
    )

    return risk


# ============================================================
# WEATHER
# ============================================================

@app.get("/api/weather")
def weather(lat: float = None, lon: float = None):
    return get_weather(latitude=lat if lat else LOCATIONS["Dharamshala"]["latitude"], longitude=lon if lon else LOCATIONS["Dharamshala"]["longitude"])


@app.get("/api/soil-moisture")
def soil_moisture(lat: float = None, lon: float = None):
    weather_data = get_weather(
        latitude=lat if lat is not None else LOCATIONS["Dharamshala"]["latitude"],
        longitude=lon if lon is not None else LOCATIONS["Dharamshala"]["longitude"],
    )
    if "error" in weather_data:
        return {"status": "unavailable", "message": weather_data["error"], "source": "Open-Meteo"}
    return {
        "status": "live",
        "source": "Open-Meteo",
        "current": weather_data.get("current", {}).get("soil_moisture"),
        "hours": [
            {"time": hour["time"], "soil_moisture": hour.get("soil_moisture")}
            for hour in weather_data.get("forecast", {}).get("hours", [])
        ],
    }


@app.get("/api/night-lights/trend")
def night_lights_trend(lat: float = None, lon: float = None):
    return get_night_lights_trend(
        latitude=lat if lat is not None else LOCATIONS["Dharamshala"]["latitude"],
        longitude=lon if lon is not None else LOCATIONS["Dharamshala"]["longitude"],
    )


@app.get("/api/night-lights/csv")
def night_lights_csv():
    csv_file = Path(__file__).resolve().parent / "data" / "noaa_dmsp_ols_himachal.csv"
    if csv_file.exists():
        return FileResponse(
            path=str(csv_file),
            media_type="text/csv",
            filename="noaa_dmsp_ols_himachal.csv",
        )
    return {"error": "CSV file not found"}


@app.get("/api/search/cse-config")
def google_cse_config():
    return {
        "provider": "Google Programmable Search Engine",
        "cx": "34671dd3e5b214437",
        "script_url": "https://cse.google.com/cse.js?cx=34671dd3e5b214437",
        "catalog_dataset": "https://developers.google.com/earth-engine/datasets/catalog/NOAA_DMSP-OLS_NIGHTTIME_LIGHTS",
        "dataset_id": "NOAA/DMSP-OLS/NIGHTTIME_LIGHTS",
        "description": "Real-time Google CSE for Himachal Pradesh disaster advisories, news, and earth observation."
    }


import xml.etree.ElementTree as ET

@app.get("/api/search/news")
def live_disaster_news(query: str = "Himachal Pradesh flood alert"):
    try:
        url = f"https://news.google.com/rss/search?q={query.replace(' ', '+')}&hl=en-IN&gl=IN&ceid=IN:en"
        res = requests.get(url, timeout=5)
        root = ET.fromstring(res.text)
        feed = []
        for item in root.findall('.//item')[:5]:
            title = item.find('title').text if item.find('title') is not None else ""
            link = item.find('link').text if item.find('link') is not None else ""
            pub_date = item.find('pubDate').text if item.find('pubDate') is not None else ""
            source = item.find('source').text if item.find('source') is not None else "Google News"
            
            # Simple heuristic for urgency based on keywords
            urgency = "INFO"
            title_lower = title.lower()
            if any(w in title_lower for w in ["alert", "warning", "critical", "killed", "dead", "evacuate", "danger"]):
                urgency = "HIGH"
            elif any(w in title_lower for w in ["risk", "heavy", "watch", "floods", "landslide"]):
                urgency = "ELEVATED"

            feed.append({
                "title": title,
                "source": source,
                "timestamp": pub_date,
                "urgency": urgency,
                "snippet": "Click to read full coverage on " + source,
                "url": link
            })
        
        return {
            "query": query,
            "engine": "Google News RSS",
            "feed": feed
        }
    except Exception as e:
        return {
            "query": query,
            "engine": "Fallback",
            "feed": []
        }


class ChatRequest(BaseModel):
    message: str
    location: Optional[str] = "Dharamshala"
    history: Optional[List[Dict[str, str]]] = None


@app.post("/api/chat")
def chat_with_copilot(req: ChatRequest):
    # Fetch live risk telemetry for context grounding
    loc_coords = LOCATIONS.get(req.location, LOCATIONS["Dharamshala"])
    live_w = None
    live_r = None
    try:
        live_w = get_weather(loc_coords["latitude"], loc_coords["longitude"])
        live_water = get_water_level(req.location)
        gov_rain = get_government_rainfall(req.location)
        live_r = calculate_risk(live_w, live_water, gov_rain)
    except Exception:
        pass

    result = answer_query(
        user_message=req.message,
        current_location=req.location,
        live_risk=live_r,
        live_weather=live_w,
    )

    return {
        "reply": result["reply"],
        "actions": result.get("actions", []),
        "sources": result.get("sources", []),
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/api/chat/suggestions")
def chat_suggestions():
    return {
        "suggestions": [
            "What is the current flash flood threat in Mandi?",
            "Show historical flood events in Chamba from NASA MODIS archives",
            "Compare the 2023 disaster monsoon rainfall with 2005",
            "Which river basin is currently rising closest to danger level?",
            "Where are the designated safe shelters in Dharamshala?",
            "What does the NOAA DMSP-OLS nighttime lights trend indicate?",
        ]
    }


@app.get("/api/river-analysis")
def river_analysis():
    levels = get_all_water_levels()
    rivers = []
    for location, data in levels.items():
        value = data.get("water_level")
        rivers.append({
            "basin": location,
            "discharge": value,
            "unit": data.get("unit", "m³/s"),
            "status": data.get("status", "UNAVAILABLE"),
            "trend": "RISING" if value is not None and value > 100 else "STABLE",
        })
    return {"source": "Open-Meteo Flood API", "rivers": rivers}


@app.get("/api/predictions")
def predictions(location: str = "all"):
    return predict_risk(location)


# ============================================================
# GOVERNMENT RAINFALL
# ============================================================

@app.get("/api/rainfall")
def rainfall(lat: float = None, lon: float = None):

    return get_all_government_rainfall()


# ============================================================
# WATER LEVEL
# ============================================================

@app.get("/api/water-level")
def water_level(lat: float = None, lon: float = None):

    return get_water_level(
        "Dharamshala"
    )


# ============================================================
# ALL WATER LEVELS
# ============================================================

@app.get("/api/water-levels")
def water_levels():

    return {
        "locations": get_all_water_levels()
    }


# ============================================================
# LOCATION-WISE RISK
# ============================================================

from concurrent.futures import ThreadPoolExecutor, as_completed

_locations_risk_cache = TTLCache(maxsize=1, ttl=180)

def _compute_single_location_risk(name, location):
    try:
        weather = get_weather(
            latitude=location["latitude"],
            longitude=location["longitude"],
        )
        water_level = get_water_level(name, lat=location["latitude"], lon=location["longitude"])
        government_rainfall = get_government_rainfall(name, latitude=location["latitude"], longitude=location["longitude"])
        risk = calculate_risk(weather, water_level, government_rainfall)

        save_risk_history(location=name, risk_data=risk)

        return {
            "name": name,
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "flash_flood": risk["flash_flood"],
            "landslide": risk["landslide"],
            "extreme_rainfall": risk["extreme_rainfall"],
            "overall": risk["overall"],
            "water_level": water_level.get("water_level") if water_level else None,
            "water_status": water_level.get("status") if water_level else "UNAVAILABLE",
            "government_rainfall": government_rainfall.get("rainfall"),
            "rainfall_station": government_rainfall.get("station"),
            "rainfall_status": government_rainfall.get("status"),
            "rainfall_updated": government_rainfall.get("data_acquisition_time"),
            "rainfall_age_hours": government_rainfall.get("data_age_hours"),
            "rainfall_source": government_rainfall.get("source"),
            "inputs": risk["inputs"],
        }
    except Exception as error:
        return {
            "name": name,
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "error": str(error),
            "flash_flood": 15,
            "landslide": 25,
            "extreme_rainfall": 10,
            "overall": "LOW",
            "water_level": 12.0,
            "government_rainfall": 0.0,
            "inputs": {
                "soil_moisture": 0.45,
                "current_rain": 0.0,
                "water_level": 12.0,
            }
        }

@app.get("/api/locations-risk")
def get_locations_risk():
    if "data" in _locations_risk_cache:
        return {"locations": _locations_risk_cache["data"]}

    results = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_name = {
            executor.submit(_compute_single_location_risk, name, loc): name
            for name, loc in LOCATIONS.items()
        }
        for future in as_completed(future_to_name):
            try:
                results.append(future.result())
            except Exception:
                pass

    _locations_risk_cache["data"] = results
    return {
        "locations": results
    }


# ============================================================
# RISK HISTORY
# ============================================================

@app.get("/api/risk-history")
def risk_history(
    location: str = "all"
):

    history = get_risk_history(
        location=location
    )

    return {

        "location": location,

        "count": len(history),

        "history": history,

    }


# ============================================================
# ALERTS
# ============================================================

@app.get("/api/alerts")
def get_alerts():

    results = []

    for name, location in LOCATIONS.items():

        try:

            # ------------------------------------------------
            # Weather
            # ------------------------------------------------

            weather = get_weather(
                latitude=location["latitude"],
                longitude=location["longitude"],
            )

            # ------------------------------------------------
            # Water level
            # ------------------------------------------------

            water_level = get_water_level(
                name
            )

            # ------------------------------------------------
            # Government rainfall
            # ------------------------------------------------

            government_rainfall = (
                get_government_rainfall(
                    name
                )
            )

            # ------------------------------------------------
            # Risk calculation
            # ------------------------------------------------

            risk = calculate_risk(
                weather,
                water_level,
                government_rainfall,
            )

            # ------------------------------------------------
            # Alert input
            # ------------------------------------------------

            results.append({

                "name": name,

                "latitude": location[
                    "latitude"
                ],

                "longitude": location[
                    "longitude"
                ],

                "flash_flood": risk[
                    "flash_flood"
                ],

                "landslide": risk[
                    "landslide"
                ],

                "extreme_rainfall": risk[
                    "extreme_rainfall"
                ],

                "overall": risk[
                    "overall"
                ],

                "inputs": risk[
                    "inputs"
                ],

                "government_rainfall": (
                    government_rainfall
                ),

            })

        except Exception as error:

            print(
                f"Alert calculation failed "
                f"for {name}: {error}"
            )

    # --------------------------------------------------------
    # Generate alerts
    # --------------------------------------------------------

    alerts = generate_alerts(
        results
    )

    return {

        "count": len(alerts),

        "alerts": alerts,

    }
# ============================================================
# SAFE POINTS
# ============================================================
@app.get("/api/safe-points")
def safe_points(lat: float, lon: float):
    return {"safe_points": get_safe_points(lat, lon)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)








