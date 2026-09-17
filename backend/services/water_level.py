from cachetools import cached, TTLCache
import requests
from datetime import datetime

# ============================================
# Real Water-Level Data via Open-Meteo
# ============================================

LOCATIONS = {
    "Dharamshala": {"lat": 32.2190, "lon": 76.3234},
    "Kangra": {"lat": 32.0998, "lon": 76.2691},
    "Mandi": {"lat": 31.7080, "lon": 76.9320},
}

def get_water_level(location: str = "Dharamshala", lat: float = None, lon: float = None):
    """
    Fetch real-time river discharge (water level indicator) from Open-Meteo Flood API
    """
    coords = {"lat": lat, "lon": lon} if lat else LOCATIONS.get(location, LOCATIONS["Dharamshala"])
    
    url = "https://flood-api.open-meteo.com/v1/flood"
    params = {
        "latitude": coords["lat"],
        "longitude": coords["lon"],
        "daily": "river_discharge",
        "forecast_days": 1
    }
    
    try:
        res = requests.get(url, params=params, timeout=10)
        res.raise_for_status()
        data = res.json()
        discharge = data.get("daily", {}).get("river_discharge", [None])[0]
        
        return {
            "location": location,
            "water_level": discharge if discharge is not None else 0.0,
            "unit": "m3/s",
            "status": "AVAILABLE" if discharge is not None else "UNAVAILABLE",
            "sensor": "Open-Meteo Flood API",
            "data_available": discharge is not None,
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        return {
            "location": location,
            "water_level": None,
            "unit": "m3/s",
            "status": "UNAVAILABLE",
            "sensor": "Open-Meteo Flood API",
            "data_available": False,
            "timestamp": datetime.now().isoformat(),
        }

def get_all_water_levels():
    results = {}
    for loc in LOCATIONS:
        results[loc] = get_water_level(loc)
    return results

