from fastapi import HTTPException

from services.buyer_service import get_buyer_by_id, get_all_buyers
from services.event_service import get_events_by_buyer_id
from services.listing_service import get_all_listings
from services.buyer_profile_service import get_buyer_by_user_id

from services.inference_service import infer_decision_twin
from services.recommendation_service import generate_recommendation_bundle
from services.outreach_service import generate_outreach

from services.twin_service import generate_and_store_twin
from services.recommendation_db_service import generate_and_store_recommendations
from services.outreach_db_service import generate_and_store_outreach


def build_buyer_summary(buyer: dict, twin: dict, recommendations: list) -> dict:
    top_recommendation = recommendations[0] if recommendations else None

    return {
        "buyer_name": buyer["name"],
        "readiness": twin["tour_readiness"],
        "primary_driver": twin["primary_driver"],
        "top_listing_id": top_recommendation["listing_id"] if top_recommendation else None,
        "top_listing_address": top_recommendation["address_label"] if top_recommendation else None,
        "top_fit_score": top_recommendation["fit_score"] if top_recommendation else None,
        "next_best_action": twin["next_best_action"]
    }


def get_buyer_intelligence_by_buyer_id(buyer_id: str) -> dict:
    buyer = get_buyer_by_id(buyer_id)
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")

    buyer_events = get_events_by_buyer_id(buyer_id)
    listings = get_all_listings()

    twin = generate_and_store_twin(buyer, buyer_events, infer_decision_twin)

    recommendations = generate_and_store_recommendations(
        buyer,
        twin,
        listings,
        generate_recommendation_bundle
    )

    # recommendations is either a list (from cache) or a bundle dict (fresh)
    rec_list = recommendations if isinstance(recommendations, list) else recommendations.get("ranked_recommendations", [])

    outreach = (
        generate_and_store_outreach(
            buyer,
            twin,
            rec_list[0],
            generate_outreach
        )
        if rec_list else None
    )

    summary = build_buyer_summary(buyer, twin, rec_list)

    return {
        "status": "success",
        "summary": summary,
        "buyer": buyer,
        "events": buyer_events,
        "twin": twin,
        "recommendations": rec_list,
        "outreach": outreach
    }


def get_buyer_intelligence_by_user_id(user_id: int) -> dict:
    buyer = get_buyer_by_user_id(user_id)
    if not buyer:
        raise HTTPException(status_code=404, detail="No buyer profile linked to this user")

    return get_buyer_intelligence_by_buyer_id(buyer["id"])


def build_inbox_item(buyer: dict) -> dict:
    buyer_events = get_events_by_buyer_id(buyer["id"])
    listings = get_all_listings()

    twin = generate_and_store_twin(buyer, buyer_events, infer_decision_twin)

    recommendations = generate_and_store_recommendations(
        buyer,
        twin,
        listings,
        generate_recommendation_bundle
    )

    rec_list = recommendations if isinstance(recommendations, list) else recommendations.get("ranked_recommendations", [])
    top_recommendation = rec_list[0] if rec_list else None

    return {
        "buyer_id": buyer["id"],
        "buyer_name": buyer["name"],
        "readiness": twin["tour_readiness"],
        "urgency": twin["urgency"],
        "primary_driver": twin["primary_driver"],
        "top_recommendation_address": top_recommendation["address_label"] if top_recommendation else None,
        "top_fit_score": top_recommendation["fit_score"] if top_recommendation else None,
        "next_best_action": twin["next_best_action"]
    }


def get_buyer_inbox_data() -> dict:
    buyers = get_all_buyers()
    inbox_items = [build_inbox_item(buyer) for buyer in buyers]

    urgency_order = {"high": 0, "medium": 1, "low": 2}
    readiness_order = {
        "tour ready": 0,
        "active consideration": 1,
        "research mode": 2,
        "follow-up needed": 3
    }

    inbox_items.sort(
        key=lambda item: (
            urgency_order.get(item["urgency"], 99),
            readiness_order.get(item["readiness"], 99),
            -item["top_fit_score"] if item["top_fit_score"] is not None else 999
        )
    )

    return {
        "status": "success",
        "count": len(inbox_items),
        "buyers": inbox_items
    }