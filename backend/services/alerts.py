from datetime import datetime


def generate_location_alert(
    location: str,
    risk_data: dict,
) -> list:
    """
    Generate disaster alerts from calculated risk data.
    """

    alerts = []

    flash_flood = float(
        risk_data.get("flash_flood", 0)
    )

    landslide = float(
        risk_data.get("landslide", 0)
    )

    extreme_rainfall = float(
        risk_data.get("extreme_rainfall", 0)
    )

    inputs = risk_data.get("inputs", {})

    rainfall_24h = float(
        inputs.get("rainfall_next_24h", 0)
    )

    rain_probability = float(
        inputs.get("rain_probability", 0)
    )

    # ============================================
    # FLASH FLOOD
    # ============================================

    if flash_flood >= 75:

        alerts.append({
            "location": location,
            "type": "FLASH_FLOOD",
            "severity": "CRITICAL",
            "risk": flash_flood,
            "title": f"Critical Flash Flood Risk — {location}",
            "message": (
                f"Flash flood risk is {flash_flood}%. "
                "Immediate monitoring is recommended."
            ),
            "timestamp": datetime.now().isoformat(),
        })

    elif flash_flood >= 60:

        alerts.append({
            "location": location,
            "type": "FLASH_FLOOD",
            "severity": "HIGH",
            "risk": flash_flood,
            "title": f"High Flash Flood Risk — {location}",
            "message": (
                f"Flash flood risk has reached {flash_flood}%. "
                "Monitor rainfall and local conditions."
            ),
            "timestamp": datetime.now().isoformat(),
        })

    # ============================================
    # LANDSLIDE
    # ============================================

    if landslide >= 75:

        alerts.append({
            "location": location,
            "type": "LANDSLIDE",
            "severity": "CRITICAL",
            "risk": landslide,
            "title": f"Critical Landslide Risk — {location}",
            "message": (
                f"Landslide risk is {landslide}%. "
                "Avoid vulnerable slopes and roads where possible."
            ),
            "timestamp": datetime.now().isoformat(),
        })

    elif landslide >= 60:

        alerts.append({
            "location": location,
            "type": "LANDSLIDE",
            "severity": "HIGH",
            "risk": landslide,
            "title": f"High Landslide Risk — {location}",
            "message": (
                f"Landslide risk has reached {landslide}%. "
                "Monitor vulnerable slopes and roads."
            ),
            "timestamp": datetime.now().isoformat(),
        })

    # ============================================
    # EXTREME RAINFALL
    # ============================================

    if extreme_rainfall >= 75:

        alerts.append({
            "location": location,
            "type": "EXTREME_RAINFALL",
            "severity": "CRITICAL",
            "risk": extreme_rainfall,
            "title": f"Critical Rainfall Risk — {location}",
            "message": (
                f"Extreme rainfall risk is {extreme_rainfall}%. "
                f"Forecast rainfall for the next 24 hours is "
                f"{rainfall_24h} mm."
            ),
            "timestamp": datetime.now().isoformat(),
        })

    elif extreme_rainfall >= 60:

        alerts.append({
            "location": location,
            "type": "EXTREME_RAINFALL",
            "severity": "HIGH",
            "risk": extreme_rainfall,
            "title": f"High Rainfall Risk — {location}",
            "message": (
                f"Extreme rainfall risk has reached "
                f"{extreme_rainfall}%. "
                f"Rain probability is {rain_probability}%."
            ),
            "timestamp": datetime.now().isoformat(),
        })

    return alerts


def generate_alerts(
    locations: list,
) -> list:
    """
    Generate alerts for all locations.
    """

    all_alerts = []

    for location in locations:

        if "error" in location:
            continue

        alerts = generate_location_alert(
            location=location["name"],
            risk_data=location,
        )

        all_alerts.extend(alerts)

    # ============================================
    # Sort by severity
    # ============================================

    severity_order = {
        "CRITICAL": 0,
        "HIGH": 1,
        "MODERATE": 2,
        "LOW": 3,
    }

    all_alerts.sort(
        key=lambda alert: (
            severity_order.get(
                alert["severity"],
                99,
            ),
            -float(alert["risk"]),
        )
    )

    return all_alerts
