def clamp_score(value: float) -> float:
    return max(0.0, min(100.0, value))


def calculate_budget_fit(buyer: dict, listing: dict) -> float:
    budget_min = buyer["budget_min"]
    budget_max = buyer["budget_max"]
    price = listing["price"]

    if budget_min <= price <= budget_max:
        return 100.0

    if price < budget_min:
        diff_ratio = (budget_min - price) / max(budget_min, 1)
        return clamp_score(90.0 - diff_ratio * 100)

    diff_ratio = (price - budget_max) / max(budget_max, 1)
    return clamp_score(100.0 - diff_ratio * 120)


def calculate_location_fit(buyer: dict, listing: dict) -> float:
    desired_locations = [location.lower() for location in buyer.get("desired_locations", [])]
    city = listing["city"].lower()

    if city in desired_locations:
        return 100.0
    return 45.0


def calculate_feature_fit(buyer: dict, listing: dict) -> float:
    features = [feature.lower() for feature in buyer.get("must_have_features", [])]
    tags = [tag.lower() for tag in listing["tags"]]
    score = 40.0

    if any("3 bedrooms" in feature for feature in features) and listing["bedrooms"] >= 3:
        score += 20
    if any("4 bedrooms" in feature for feature in features) and listing["bedrooms"] >= 4:
        score += 20
    if any("backyard" in feature for feature in features) and "backyard" in tags:
        score += 15
    if any("good schools" in feature or "top school district" in feature for feature in features):
        score += listing["school_score"] * 2
    if any("modern kitchen" in feature for feature in features) and (
        "modern" in tags or "updated" in tags or "move-in ready" in tags
    ):
        score += 20
    if any("close commute" in feature for feature in features):
        score += listing["commute_score"] * 2

    return clamp_score(score)


def calculate_behavior_fit(twin: dict, listing: dict) -> float:
    primary_driver = twin["primary_driver"].lower()
    communication_angle = twin["communication_angle"].lower()
    tags = [tag.lower() for tag in listing["tags"]]

    score = 50.0

    if "school" in primary_driver:
        score += listing["school_score"] * 4
    if "commute" in primary_driver:
        score += listing["commute_score"] * 4
    if "family" in primary_driver and "family" in tags:
        score += 25
    if "value" in communication_angle and "value" in tags:
        score += 20
    if "schools" in communication_angle and "schools" in tags:
        score += 20
    if "commute" in communication_angle and "commute" in tags:
        score += 20
    if "family space" in communication_angle and "family" in tags:
        score += 20

    return clamp_score(score)


def calculate_message_angle_fit(twin: dict, listing: dict) -> float:
    angle = twin["communication_angle"].lower()
    tags = [tag.lower() for tag in listing["tags"]]

    if angle == "schools" and "schools" in tags:
        return 100.0
    if angle == "commute" and "commute" in tags:
        return 100.0
    if angle == "family space" and "family" in tags:
        return 100.0
    if angle == "value" and "value" in tags:
        return 100.0

    return 55.0


def calculate_fit_score(buyer: dict, twin: dict, listing: dict) -> dict:
    budget_fit = calculate_budget_fit(buyer, listing)
    location_fit = calculate_location_fit(buyer, listing)
    feature_fit = calculate_feature_fit(buyer, listing)
    behavior_fit = calculate_behavior_fit(twin, listing)
    message_angle_fit = calculate_message_angle_fit(twin, listing)

    fit_score = (
        0.25 * budget_fit
        + 0.20 * location_fit
        + 0.20 * feature_fit
        + 0.20 * behavior_fit
        + 0.15 * message_angle_fit
    )

    return {
        "fit_score": round(clamp_score(fit_score), 2),
        "budget_fit": round(budget_fit, 2),
        "location_fit": round(location_fit, 2),
        "feature_fit": round(feature_fit, 2),
        "behavior_fit": round(behavior_fit, 2),
        "message_angle_fit": round(message_angle_fit, 2)
    }