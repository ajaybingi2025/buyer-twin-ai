from services.scoring_service import calculate_fit_score


def build_explanation(buyer: dict, listing: dict, scores: dict) -> tuple[str, list]:
    factors = []

    if scores["budget_fit"] >= 85:
        factors.append("has a strong budget fit")
    if scores["location_fit"] >= 85:
        factors.append("matches the desired location")
    if scores["feature_fit"] >= 80:
        factors.append("aligns with key features")
    if scores["behavior_fit"] >= 80:
        factors.append("fits inferred buyer behavior")
    if scores["message_angle_fit"] >= 90:
        factors.append("supports the best message angle")

    if not factors:
        factors.append("is a reasonable overall match")

    if len(factors) == 1:
        factor_text = factors[0]
    else:
        factor_text = ", ".join(factors[:-1]) + ", and " + factors[-1]

    explanation = f"{listing['address_label']} is a good match for {buyer['name']} because it {factor_text}."
    return explanation, factors


def generate_recommendations(buyer: dict, twin: dict, listings: list) -> list:
    recommendations = []

    for listing in listings:
        scores = calculate_fit_score(buyer, twin, listing)
        explanation, factors = build_explanation(buyer, listing, scores)

        recommendations.append({
            "id": f"rec_{buyer['id']}_{listing['id']}",
            "buyer_id": buyer["id"],
            "listing_id": listing["id"],
            "address_label": listing["address_label"],
            "city": listing["city"],
            "price": listing["price"],
            "fit_score": scores["fit_score"],
            "explanation": explanation,
            "matching_factors": factors,
            "score_breakdown": scores,
            "rank": 0
        })

    recommendations.sort(key=lambda item: item["fit_score"], reverse=True)

    for index, recommendation in enumerate(recommendations, start=1):
        recommendation["rank"] = index

    return recommendations[:3]