def clamp(value, minimum=0, maximum=100):
    return max(minimum, min(maximum, value))


def calculate_risk(
    weather,
    water_level_data=None,
    government_rainfall=None,
):
    """
    Multi-factor disaster risk engine.

    Data sources:
    - Weather API
    - Government rainfall telemetry
    - CWC/NWIC water level, when available
    - Soil moisture
    - Humidity
    - Wind
    - Rain probability

    IMPORTANT:
    Missing water-level data is NOT treated as
    a real 0 cm reading.
    """

    if not weather: return {"flash_flood": 0, "landslide": 0, "extreme_rainfall": 0, "overall": "MINIMAL", "inputs": {}}
    current = weather.get("current", {})
    forecast = weather.get("forecast", {})

    # ========================================================
    # WEATHER INPUTS
    # ========================================================

    current_rain = float(
        current.get("rain", 0) or 0
    )

    humidity = float(
        current.get("humidity", 0) or 0
    )

    wind_speed = float(
        current.get("wind_speed", 0) or 0
    )

    rainfall_24h = sum(forecast.get("precipitation", [])[:24]) if "precipitation" in forecast else 0.0

    rain_probability = float(
        forecast.get("max_rain_probability", 0) or 0
    )

    # ========================================================
    # GOVERNMENT RAINFALL
    # ========================================================

    government_rain = None

    if government_rainfall:

        value = government_rainfall.get(
            "rainfall"
        )

        if value is not None:

            try:
                government_rain = float(value)
            except (
                TypeError,
                ValueError,
            ):
                government_rain = None

    # ========================================================
    # COMBINED RAINFALL SIGNAL
    # ========================================================
    #
    # Government telemetry is observed rainfall.
    # Weather forecast is future rainfall.
    #
    # We don't simply add them together because that would
    # double-count rainfall.
    #
    # Instead:
    # - observed rainfall gets stronger weight
    # - forecast rainfall supplements it
    #

    if government_rain is not None:

        observed_rain_score = clamp(
            government_rain * 5
        )

        forecast_rain_score = clamp(
            rainfall_24h * 3
        )

        combined_rain_score = (
            observed_rain_score * 0.55
            + forecast_rain_score * 0.45
        )

    else:

        combined_rain_score = clamp(
            rainfall_24h * 3.5
        )

    # ========================================================
    # SOIL MOISTURE
    # ========================================================

    soil_moisture = 0

    hours = forecast.get(
        "hours",
        []
    )

    if hours:

        soil_values = [

            float(
                h.get(
                    "soil_moisture",
                    0
                ) or 0
            )

            for h in hours

            if h.get(
                "soil_moisture"
            ) is not None

        ]

        if soil_values:

            soil_moisture = (
                sum(soil_values)
                / len(soil_values)
            )

    # ========================================================
    # WATER LEVEL
    # ========================================================

    water_level = None
    water_status = "UNAVAILABLE"

    if water_level_data:

        raw_level = water_level_data.get(
            "water_level"
        )

        if raw_level is not None:

            try:

                water_level = float(
                    raw_level
                )

                water_status = (
                    water_level_data.get(
                        "status",
                        "AVAILABLE"
                    )
                )

            except (
                TypeError,
                ValueError,
            ):

                water_level = None
                water_status = "UNAVAILABLE"

    # ========================================================
    # WATER LEVEL SCORE
    # ========================================================

    if water_level is not None:

        water_level_score = clamp(
            water_level
        )

    else:

        water_level_score = None

    # ========================================================
    # EXTREME RAINFALL RISK
    # ========================================================

    probability_score = clamp(
        rain_probability
    )

    extreme_rainfall = (
        combined_rain_score * 0.65
        + probability_score * 0.35
    )

    # ========================================================
    # FLASH FLOOD RISK
    # ========================================================

    flood_probability_score = clamp(
        rain_probability
    )

    flood_humidity_score = clamp(
        humidity
    )

    # Weather + observed rainfall
    weather_flood_risk = (
        combined_rain_score * 0.45
        + flood_probability_score * 0.25
        + flood_humidity_score * 0.10
    )

    # --------------------------------------------------------
    # Water level is ONLY used when real data exists.
    # --------------------------------------------------------

    if water_level_score is not None:

        flash_flood = (
            weather_flood_risk * 0.75
            + water_level_score * 0.25
        )

    else:

        flash_flood = (
            weather_flood_risk
        )

    # ========================================================
    # LANDSLIDE RISK
    # ========================================================

    landslide_rain_score = clamp(
        combined_rain_score
    )

    landslide_humidity_score = clamp(
        humidity
    )

    soil_score = clamp(
        soil_moisture * 100
    )

    wind_score = clamp(
        wind_speed * 2
    )

    landslide = (
        landslide_rain_score * 0.40
        + landslide_humidity_score * 0.25
        + soil_score * 0.25
        + wind_score * 0.10
    )

    # ========================================================
    # FINAL CLAMP
    # ========================================================

    flash_flood = round(
        clamp(
            flash_flood
        )
    )

    landslide = round(
        clamp(
            landslide
        )
    )

    extreme_rainfall = round(
        clamp(
            extreme_rainfall
        )
    )

    # ========================================================
    # OVERALL THREAT
    # ========================================================

    overall_score = max(
        flash_flood,
        landslide,
        extreme_rainfall,
    )

    if overall_score >= 75:

        overall = "CRITICAL"

    elif overall_score >= 60:

        overall = "HIGH"

    elif overall_score >= 40:

        overall = "MODERATE"

    elif overall_score >= 20:

        overall = "LOW"

    else:

        overall = "MINIMAL"

    # ========================================================
    # RETURN
    # ========================================================

    return {

        "flash_flood": flash_flood,

        "landslide": landslide,

        "extreme_rainfall": extreme_rainfall,

        "overall": overall,
        "flash_flood_24h": round(clamp(flash_flood * (1 + (rainfall_24h / 100)))),
        "landslide_24h": round(clamp(landslide * (1 + (rainfall_24h / 100)))),
        "extreme_rainfall_24h": round(clamp(extreme_rainfall * (1 + (rainfall_24h / 100)))),
        "overall_24h": "CRITICAL" if round(clamp(flash_flood * (1 + (rainfall_24h / 100)))) >= 75 else ("HIGH" if round(clamp(flash_flood * (1 + (rainfall_24h / 100)))) >= 60 else "MODERATE"),

        "inputs": {

            "current_rain": round(
                current_rain,
                2
            ),

            "government_rainfall": (
                round(
                    government_rain,
                    2
                )
                if government_rain
                is not None
                else None
            ),

            "rainfall_next_24h": round(
                rainfall_24h,
                2
            ),

            "rain_probability": round(
                rain_probability,
                1
            ),

            "humidity": round(
                humidity,
                1
            ),

            "wind_speed": round(
                wind_speed,
                1
            ),

            "soil_moisture": round(
                soil_moisture,
                3
            ),

            "water_level": (
                round(
                    water_level,
                    1
                )
                if water_level
                is not None
                else None
            ),

            "water_status": (
                water_status
            ),
        },
    }


