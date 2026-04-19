from fastapi import APIRouter, HTTPException, Header

from services.auth_service import get_current_user_from_header, require_role
from services.buyer_service import get_all_buyers, get_buyer_by_id
from services.event_service import get_events_by_buyer_id, get_saved_listings_by_buyer_id
from services.buyer_intelligence_service import (
    get_buyer_inbox_data,
    get_buyer_intelligence_by_buyer_id,
    get_buyer_intelligence_by_user_id,
)

router = APIRouter()


@router.get("/inbox")
def get_buyer_inbox(authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])
    return get_buyer_inbox_data()


@router.get("/")
def get_buyers(authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])
    return get_all_buyers()


@router.get("/me/dashboard")
def get_my_buyer_dashboard(authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["buyer"])
    return get_buyer_intelligence_by_user_id(current_user["id"])


@router.get("/{buyer_id}")
def get_buyer_by_id_route(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    buyer = get_buyer_by_id(buyer_id)
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    return buyer


@router.get("/{buyer_id}/events")
def get_buyer_events(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    buyer = get_buyer_by_id(buyer_id)
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")

    return get_events_by_buyer_id(buyer_id)


@router.get("/{buyer_id}/saved-listings")
def get_buyer_saved_listings(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    buyer = get_buyer_by_id(buyer_id)
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")

    return {
        "status": "success",
        "buyer_id": buyer_id,
        "saved_listings": get_saved_listings_by_buyer_id(buyer_id),
    }


@router.get("/{buyer_id}/dashboard")
def get_buyer_dashboard(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    buyer = get_buyer_by_id(buyer_id)
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")

    dashboard = get_buyer_intelligence_by_buyer_id(buyer_id)
    dashboard["saved_listings"] = get_saved_listings_by_buyer_id(buyer_id)
    dashboard["saved_count"] = len(dashboard["saved_listings"])

    return dashboard