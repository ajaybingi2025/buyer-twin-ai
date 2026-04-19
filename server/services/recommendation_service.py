from __future__ import annotations

import json
import os
import pickle
import re
from functools import lru_cache
from pathlib import Path
from typing import Any, Optional

import pandas as pd
from groq import Groq

from services.event_service import get_events_by_buyer_id

BASE_DIR = Path(__file__).resolve().parents[1]
BUNDLE_PATH = BASE_DIR / "model" / "recommender_bundle.pkl"


@lru_cache(maxsize=1)
def load_recommender_bundle() -> dict:
    with BUNDLE_PATH.open("rb") as f:
        bundle = pickle.load(f)

    if "model" not in bundle or "feature_cols" not in bundle:
        raise ValueError("Invalid recommender bundle. Expected keys: model, feature_cols")

    return bundle


BUNDLE = load_recommender_bundle()
MODEL = BUNDLE["model"]
FEATURE_COLS = BUNDLE["feature_cols"]

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
GROQ_CLIENT = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


def _as_list(value: Any) -> list:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, tuple):
        return list(value)
    if isinstance(value, str):
        text = value.strip()
        if not text:
            return []
        try:
            parsed = json.loads(text)
            if isinstance(parsed, list):
                return parsed
        except json.JSONDecodeError:
            pass
        return [v.strip() for v in text.split(",") if v.strip()]
    return [value]


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        if value is None or value == "":
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def _parse_bedroom_need(must_have_features: list[str] | None) -> Optional[int]:
    for feature in must_have_features or []:
        match = re.search(r"(\d+)\s*bed", str(feature).lower())
        if match:
            return int(match.group(1))
    return None


def _event_stats(app_events: list[dict] | None) -> dict[str, float]:
    app_events = app_events or []

    viewed = sum(1 for e in app_events if e.get("event_type") == "listing_viewed")
    saved = sum(1 for e in app_events if e.get("event_type") == "listing_saved")
    skipped = sum(1 for e in app_events if e.get("event_type") == "listing_skipped")
    tours = sum(1 for e in app_events if e.get("event_type") == "tour_requested")

    durations = [
        _safe_float(e.get("duration_seconds"))
        for e in app_events
        if e.get("duration_seconds") not in (None, "", 0)
    ]
    avg_view_duration = sum(durations) / len(durations) if durations else 0.0

    return {
        "viewed_count": float(viewed),
        "saved_count": float(saved),
        "skipped_count": float(skipped),
        "tour_requested_count": float(tours),
        "avg_view_duration": float(avg_view_duration),
    }


def _get_urgency_score(buyer: dict) -> float:
    urgency = str(buyer.get("urgency", buyer.get("timeline", "medium"))).lower()
    if urgency in {"high", "asap", "now"}:
        return 1.0
    if urgency in {"medium", "1 month", "2-3 months"}:
        return 0.6
    return 0.25


def _build_feature_row(
    buyer: dict,
    listing: dict,
    twin: dict | None = None,
    app_events: list[dict] | None = None,
) -> dict[str, Any]:
    stats = _event_stats(app_events)

    buyer_desired_locations = _as_list(buyer.get("desired_locations"))
    buyer_must_have = _as_list(buyer.get("must_have_features"))
    listing_tags = _as_list(listing.get("tags"))

    budget_min = _safe_float(buyer.get("budget_min"))
    budget_max = _safe_float(buyer.get("budget_max"))
    price = _safe_float(listing.get("price"))
    mid_budget = (budget_min + budget_max) / 2 if budget_min and budget_max else price

    listing_city = str(listing.get("city") or "").lower()
    normalized_locations = {str(loc).lower() for loc in buyer_desired_locations}
    normalized_tags = {str(tag).lower() for tag in listing_tags}
    normalized_must_have = {str(feat).lower() for feat in buyer_must_have}

    bedroom_need = _parse_bedroom_need(buyer_must_have)

    urgency_score = (
        _safe_float(twin.get("urgency")) if twin and twin.get("urgency") else _get_urgency_score(buyer)
    )

    row = {
        "budget_min": budget_min,
        "budget_max": budget_max,
        "listing_price": price,
        "simulated_duration_seconds": stats["avg_view_duration"] or 60.0,
        "price": price,
        "bedrooms": _safe_float(listing.get("bedrooms")),
        "bathrooms": _safe_float(listing.get("bathrooms")),
        "sqft": _safe_float(listing.get("sqft")),
        "school_score": _safe_float(listing.get("school_score")),
        "commute_score": _safe_float(listing.get("commute_score")),
        "within_budget": 1 if budget_min <= price <= budget_max else 0,
        "price_gap_from_mid": abs(price - mid_budget),
        "city_match": 1 if listing_city in normalized_locations else 0,
        "bedroom_match": 1 if bedroom_need and _safe_float(listing.get("bedrooms")) >= bedroom_need else 0,
        "school_match": 1 if _safe_float(listing.get("school_score")) >= 8 else 0,
        "backyard_match": 1 if "backyard" in normalized_tags else 0,
        "garage_match": 1 if "garage" in normalized_tags else 0,
        "pool_match": 1 if "pool" in normalized_tags else 0,
        "feature_overlap_count": len(normalized_tags & normalized_must_have),
        "viewed_count": stats["viewed_count"],
        "saved_count": stats["saved_count"],
        "skipped_count": stats["skipped_count"],
        "tour_requested_count": stats["tour_requested_count"],
        "avg_view_duration": stats["avg_view_duration"],
        "urgency_score": urgency_score,
        "desired_locations_count": float(len(buyer_desired_locations)),
        "must_have_count": float(len(buyer_must_have)),
    }

    return {col: row.get(col, 0) for col in FEATURE_COLS}


def build_explanation(buyer: dict, listing: dict, feature_row: dict[str, Any]) -> tuple[str, list[str]]:
    factors: list[str] = []

    if feature_row.get("within_budget") == 1:
        factors.append("fits the buyer's budget")
    if feature_row.get("city_match") == 1:
        factors.append("matches a desired location")
    if feature_row.get("feature_overlap_count", 0) >= 1:
        factors.append("aligns with key features")
    if feature_row.get("school_match") == 1:
        factors.append("supports the school preference")
    if feature_row.get("bedroom_match") == 1:
        factors.append("meets the bedroom need")
    if feature_row.get("saved_count", 0) > 0:
        factors.append("builds on prior saved-home behavior")
    if feature_row.get("tour_requested_count", 0) > 0:
        factors.append("reflects strong tour intent")

    if not factors:
        factors.append("is a reasonable overall match")

    if len(factors) == 1:
        factor_text = factors[0]
    else:
        factor_text = ", ".join(factors[:-1]) + ", and " + factors[-1]

    explanation = (
        f"{listing['address_label']} is a good match for {buyer['name']} because it {factor_text}."
    )
    return explanation, factors


def score_listings_with_model(
    buyer: dict,
    listings: list[dict],
    twin: dict | None = None,
    app_events: list[dict] | None = None,
) -> list[dict]:
    scored: list[dict] = []

    for listing in listings:
        feature_row = _build_feature_row(buyer, listing, twin, app_events)
        X = pd.DataFrame([feature_row], columns=FEATURE_COLS)

        if hasattr(MODEL, "predict_proba"):
            model_score = float(MODEL.predict_proba(X)[0][1])
        else:
            model_score = float(MODEL.predict(X)[0])

        explanation, factors = build_explanation(buyer, listing, feature_row)

        scored.append(
            {
                "id": f"rec_{buyer['id']}_{listing['id']}",
                "buyer_id": buyer["id"],
                "listing_id": listing["id"],
                "address_label": listing["address_label"],
                "city": listing.get("city"),
                "price": listing.get("price"),
                "fit_score": round(model_score * 100, 2),
                "model_score": model_score,
                "explanation": explanation,
                "matching_factors": factors,
                "score_breakdown": feature_row,
                "rank": 0,
                "listing": listing,
            }
        )

    scored.sort(key=lambda item: item["model_score"], reverse=True)
    for index, rec in enumerate(scored, start=1):
        rec["rank"] = index

    return scored


def generate_groq_summary_and_email(
    buyer: dict,
    ranked_recommendations: list[dict],
) -> dict[str, Any]:
    if not GROQ_CLIENT:
        return {
            "summary": None,
            "email_subject": None,
            "email_body": None,
            "top_pick_reason": None,
        }

    top_three = ranked_recommendations[:3]

    prompt = f"""
You are helping a real estate agent write a concise recommendation summary and outreach email.

Buyer:
- Name: {buyer.get("name")}
- Budget min: {buyer.get("budget_min")}
- Budget max: {buyer.get("budget_max")}
- Desired locations: {buyer.get("desired_locations")}
- Must-have features: {buyer.get("must_have_features")}
- Timeline: {buyer.get("timeline")}

Top recommendations:
{json.dumps(top_three, indent=2)}

Return ONLY valid JSON with these keys:
- summary
- email_subject
- email_body
- top_pick_reason

Keep the email warm, short, and specific.
"""

    response = GROQ_CLIENT.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role": "system",
                "content": "You write concise real-estate summaries and email drafts. Return valid JSON only.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
    )

    content = response.choices[0].message.content.strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "summary": content,
            "email_subject": None,
            "email_body": None,
            "top_pick_reason": None,
        }


def generate_recommendation_bundle(
    buyer: dict,
    twin: dict | None,
    listings: list[dict],
) -> dict[str, Any]:
    app_events = get_events_by_buyer_id(buyer["id"])

    ranked = score_listings_with_model(buyer, listings, twin, app_events)
    copy = generate_groq_summary_and_email(buyer, ranked)

    return {
        "buyer_id": buyer["id"],
        "ranked_recommendations": ranked[:3],
        "summary": copy.get("summary"),
        "email_subject": copy.get("email_subject"),
        "email_body": copy.get("email_body"),
        "top_pick_reason": copy.get("top_pick_reason"),
    }