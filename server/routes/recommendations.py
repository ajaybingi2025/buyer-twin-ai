from fastapi import APIRouter, Header, HTTPException

from db.connection import get_connection
from services.auth_service import get_current_user_from_header, require_role
from services.buyer_service import get_buyer_by_id
from services.recommendation_service import generate_recommendation_bundle
from services.recommendation_db_service import (
    generate_and_store_recommendations,
    refresh_and_store_recommendations,
)
from services.twin_service import get_twin_by_buyer_id

router = APIRouter()


def get_all_listings() -> list[dict]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    id,
                    address_label,
                    city,
                    price,
                    bedrooms,
                    bathrooms,
                    sqft,
                    neighborhood,
                    tags,
                    school_score,
                    commute_score,
                    description,
                    image_url
                FROM listings
                ORDER BY price ASC, id ASC;
                """
            )
            return [dict(row) for row in cur.fetchall()]


def _get_buyer_or_404(buyer_id: str) -> dict:
    buyer = get_buyer_by_id(buyer_id)
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    return buyer


def _get_twin_or_404(buyer_id: str) -> dict:
    twin = get_twin_by_buyer_id(buyer_id)
    if not twin:
        raise HTTPException(
            status_code=404,
            detail="No decision twin found for this buyer. Generate a twin first."
        )
    return twin


@router.get("/{buyer_id}")
def get_recommendations(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    buyer = _get_buyer_or_404(buyer_id)
    twin = _get_twin_or_404(buyer_id)
    listings = get_all_listings()

    return generate_and_store_recommendations(
        buyer=buyer,
        twin=twin,
        listings=listings,
        generate_recommendations_func=generate_recommendation_bundle,
    )


@router.post("/{buyer_id}/refresh")
def refresh_recommendations(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    buyer = _get_buyer_or_404(buyer_id)
    twin = _get_twin_or_404(buyer_id)
    listings = get_all_listings()

    return refresh_and_store_recommendations(
        buyer=buyer,
        twin=twin,
        listings=listings,
        generate_recommendations_func=generate_recommendation_bundle,
    )