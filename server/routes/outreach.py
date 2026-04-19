from fastapi import APIRouter, Header, HTTPException
from services.auth_service import get_current_user_from_header, require_role
from services.buyer_intelligence_service import get_buyer_intelligence_by_buyer_id
from services.email_service import send_recommendation_email

router = APIRouter()


@router.post("/{buyer_id}")
def create_outreach(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    intelligence = get_buyer_intelligence_by_buyer_id(buyer_id)
    return intelligence["outreach"]


@router.post("/{buyer_id}/refresh")
def refresh_outreach(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    intelligence = get_buyer_intelligence_by_buyer_id(buyer_id)
    return {
        "status": "success",
        "message": "Outreach refreshed or retrieved",
        "outreach": intelligence["outreach"]
    }


@router.post("/{buyer_id}/send-email")
def send_email(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    result = send_recommendation_email(buyer_id)

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])

    return result