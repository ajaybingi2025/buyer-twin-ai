from fastapi import APIRouter, Header, HTTPException
from services.auth_service import get_current_user_from_header, require_role
from services.buyer_intelligence_service import get_buyer_intelligence_by_buyer_id

router = APIRouter()


@router.get("/{buyer_id}")
def get_recommendations(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)

    if current_user["role"] == "agent":
        pass
    elif current_user["role"] == "buyer":
        if str(current_user["id"]) != str(buyer_id):
            raise HTTPException(status_code=403, detail="Buyers can only view their own recommendations")
    else:
        raise HTTPException(status_code=403, detail="Not authorized")

    intelligence = get_buyer_intelligence_by_buyer_id(buyer_id)

    return {
        "status": "success",
        "recommendations": intelligence["recommendations"]
    }


@router.post("/{buyer_id}/refresh")
def refresh_recommendations(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    intelligence = get_buyer_intelligence_by_buyer_id(buyer_id)
    return {
        "status": "success",
        "message": "Recommendations refreshed or retrieved",
        "recommendations": intelligence["recommendations"]
    }