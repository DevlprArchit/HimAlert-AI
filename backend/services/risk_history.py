import json
import os
from datetime import datetime

HISTORY_FILE = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "data",
    "risk_history.json",
)


def save_risk_history(
    location: str,
    risk_data: dict,
):
    """
    Save one risk snapshot to risk_history.json.
    """

    # Make sure data directory exists
    os.makedirs(
        os.path.dirname(HISTORY_FILE),
        exist_ok=True,
    )

    # Read existing history
    try:
        with open(
            HISTORY_FILE,
            "r",
            encoding="utf-8",
        ) as file:
            history = json.load(file)

    except (
        FileNotFoundError,
        json.JSONDecodeError,
    ):
        history = []

    # Create snapshot
    snapshot = {
        "timestamp": datetime.now().isoformat(),
        "location": location,
        "flash_flood": risk_data.get(
            "flash_flood",
            0,
        ),
        "landslide": risk_data.get(
            "landslide",
            0,
        ),
        "extreme_rainfall": risk_data.get(
            "extreme_rainfall",
            0,
        ),
        "overall": risk_data.get(
            "overall",
            "UNKNOWN",
        ),
    }

    history.append(snapshot)

    # Keep latest 500 records
    history = history[-500:]

    # Save
    with open(
        HISTORY_FILE,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            history,
            file,
            indent=2,
        )

    return snapshot


def get_risk_history(
    location: str | None = None,
):
    """
    Return saved risk history.

    If location is provided,
    return only that location.
    """

    try:
        with open(
            HISTORY_FILE,
            "r",
            encoding="utf-8",
        ) as file:
            history = json.load(file)

    except (
        FileNotFoundError,
        json.JSONDecodeError,
    ):
        return []

    if location:
        history = [
            item
            for item in history
            if item.get("location") == location
        ]

    return history