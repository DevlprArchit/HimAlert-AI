from cachetools import cached, TTLCache
import requests

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

@cached(cache=TTLCache(maxsize=100, ttl=600))
def get_weather(latitude: float, longitude: float):
    """
    Fetch current, hourly, and daily weather data from Open-Meteo.
    Includes OpenWeatherMap-style metrics (visibility, pressure) and 7-day forecast.
    """

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m,precipitation,rain,showers,wind_speed_10m,surface_pressure,visibility",
        "hourly": "precipitation,rain,showers,precipitation_probability,soil_moisture_0_to_7cm",
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,precipitation_sum",
        "timezone": "Asia/Kolkata",
    }

    try:
        response = requests.get(
            OPEN_METEO_URL,
            params=params,
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Error fetching weather: {e}")
        return {"error": str(e)}

    current = data.get("current", {})
    hourly = data.get("hourly", {})
    daily = data.get("daily", {})

    # --------------------------------
    # Hourly data (Next 24h starting from CURRENT HOUR)
    # --------------------------------
    times = hourly.get("time", [])
    precipitation = hourly.get("precipitation", [])
    rain = hourly.get("rain", [])
    showers = hourly.get("showers", [])
    probability = hourly.get("precipitation_probability", [])
    soil_moisture = hourly.get("soil_moisture_0_to_7cm", [])

    current_time_str = current.get("time", "")
    start_idx = 0
    if current_time_str and times:
        current_hour_prefix = current_time_str[:13]
        for idx, t in enumerate(times):
            if t.startswith(current_hour_prefix):
                start_idx = idx
                break

    next_24_hours = []
    end_idx = min(len(times), start_idx + 24)
    for i in range(start_idx, end_idx):
        next_24_hours.append({
            "time": times[i],
            "precipitation": precipitation[i] if i < len(precipitation) else 0.0,
            "rain": rain[i] if i < len(rain) else 0.0,
            "showers": showers[i] if i < len(showers) else 0.0,
            "precipitation_probability": probability[i] if i < len(probability) else 0,
            "soil_moisture": soil_moisture[i] if i < len(soil_moisture) else 0.0,
        })

    rainfall_24h = sum(value or 0 for value in precipitation[start_idx:start_idx+24])
    max_hourly_rain = max([value or 0 for value in precipitation[start_idx:start_idx+24]], default=0)
    max_rain_probability = max([value or 0 for value in probability[start_idx:start_idx+24]], default=0)
    curr_soil = soil_moisture[start_idx] if start_idx < len(soil_moisture) and soil_moisture[start_idx] is not None else 0.45

    # --------------------------------
    # Daily data (Next 7 days)
    # --------------------------------
    daily_forecast = []
    if daily and "time" in daily:
        for i in range(min(7, len(daily["time"]))):
            daily_forecast.append({
                "date": daily["time"][i],
                "weather_code": daily["weather_code"][i] if "weather_code" in daily else 0,
                "temp_max": daily["temperature_2m_max"][i] if "temperature_2m_max" in daily else 0,
                "temp_min": daily["temperature_2m_min"][i] if "temperature_2m_min" in daily else 0,
                "rain_prob": daily["precipitation_probability_max"][i] if "precipitation_probability_max" in daily else 0,
                "precip_sum": daily["precipitation_sum"][i] if "precipitation_sum" in daily else 0,
            })

    return {
        "location": {
            "latitude": latitude,
            "longitude": longitude,
        },
        "current": {
            "temperature": current.get("temperature_2m", 0),
            "humidity": current.get("relative_humidity_2m", 0),
            "precipitation": current.get("precipitation", 0),
            "rain": current.get("rain", 0),
            "showers": current.get("showers", 0),
            "wind_speed": current.get("wind_speed_10m", 0),
            "pressure": current.get("surface_pressure", 1013),
            "visibility": current.get("visibility", 10000), # meters
            "soil_moisture": curr_soil,
        },
        "forecast": {
            "rainfall_next_24h": round(rainfall_24h, 2),
            "max_hourly_rain": round(max_hourly_rain, 2),
            "max_rain_probability": max_rain_probability,
            "hours": next_24_hours,
        },
        "daily": daily_forecast,
        "source": "Open-Meteo",
    }


