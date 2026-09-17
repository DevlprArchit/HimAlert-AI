from collections import Counter
from typing import Any

from services.risk_history import get_risk_history


def predict_risk(location: str = "all") -> dict[str, Any]:
    history = get_risk_history(None if location == "all" else location)
    if len(history) < 5:
        return {
            "status": "insufficient_history",
            "model": "Random Forest",
            "samples": len(history),
            "message": "At least 5 historical risk snapshots are required for training.",
        }

    try:
        from sklearn.ensemble import RandomForestClassifier
    except ImportError:
        return {"status": "unavailable", "model": "Random Forest", "message": "scikit-learn is not installed."}

    features = []
    labels = []
    for item in history:
        features.append([
            float(item.get("flash_flood", 0)),
            float(item.get("landslide", 0)),
            float(item.get("extreme_rainfall", 0)),
        ])
        labels.append(str(item.get("overall", "UNKNOWN")))

    if len(set(labels)) < 2:
        return {
            "status": "insufficient_classes",
            "model": "Random Forest",
            "samples": len(history),
            "message": "Historical data currently contains only one threat class.",
        }

    latest = features[-1]
    models = {
        "random_forest": RandomForestClassifier(
            n_estimators=120,
            random_state=42,
            class_weight="balanced",
            min_samples_leaf=2,
        )
    }
    try:
        from xgboost import XGBClassifier

        label_names = sorted(set(labels))
        label_to_id = {name: index for index, name in enumerate(label_names)}
        models["xgboost"] = XGBClassifier(
            n_estimators=100,
            max_depth=3,
            learning_rate=0.08,
            subsample=0.9,
            colsample_bytree=0.9,
            objective="multi:softprob",
            num_class=len(label_names),
            eval_metric="mlogloss",
            random_state=42,
        )
    except ImportError:
        label_names = []
        label_to_id = {}

    results = {}
    for name, model in models.items():
        training_labels = [label_to_id[label] for label in labels] if name == "xgboost" else labels
        model.fit(features, training_labels)
        probabilities = model.predict_proba([latest])[0]
        prediction_id = model.predict([latest])
        if name == "xgboost":
            prediction = label_names[int(prediction_id.ravel()[0])]
        else:
            prediction = str(prediction_id[0])
        results[name] = {
            "prediction": prediction,
            "confidence": round(float(max(probabilities)) * 100, 1),
        }

    primary = results["xgboost"] if "xgboost" in results else results["random_forest"]

    return {
        "status": "trained",
        "model": "XGBoost + Random Forest" if "xgboost" in results else "Random Forest",
        "samples": len(history),
        "prediction": primary["prediction"],
        "confidence": primary["confidence"],
        "models": results,
        "class_distribution": dict(Counter(labels)),
        "features": {"flash_flood": latest[0], "landslide": latest[1], "extreme_rainfall": latest[2]},
    }
