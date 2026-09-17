from cachetools import cached, TTLCache
import requests

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

@cached(cache=TTLCache(maxsize=10, ttl=600))
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
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code",
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
    # Hourly data (Next 24h)
    # --------------------------------
    times = hourly.get("time", [])
    precipitation = hourly.get("precipitation", [])
    rain = hourly.get("rain", [])
    showers = hourly.get("showers", [])
    probability = hourly.get("precipitation_probability", [])
    soil_moisture = hourly.get("soil_moisture_0_to_7cm", [])

    next_24_hours = []
    for i in range(min(24, len(times))):
        next_24_hours.append({
            "time": times[i],
            "precipitation": precipitation[i],
            "rain": rain[i],
            "showers": showers[i],
            "precipitation_probability": probability[i],
            "soil_moisture": soil_moisture[i],
        })

    rainfall_24h = sum(value or 0 for value in precipitation[:24])
    max_hourly_rain = max([value or 0 for value in precipitation[:24]], default=0)
    max_rain_probability = max([value or 0 for value in probability[:24]], default=0)

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


