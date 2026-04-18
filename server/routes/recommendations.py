from fastapi import APIRouter, HTTPException
from services.loader_service import load_json
from services.inference_service import infer_decision_twin
from services.recommendation_service import generate_recommendations

router = APIRouter()


@router.get("/{buyer_id}")
def get_recommendations(buyer_id: str):
    buyers = load_json("buyers.json")
    buyer = next((buyer for buyer in buyers if buyer["id"] == buyer_id), None)

    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")

    events = load_json("events.json")
    buyer_events = [event for event in events if event["buyer_id"] == buyer_id]

    twin = infer_decision_twin(buyer, buyer_events)
    listings = load_json("listings.json")

    return generate_recommendations(buyer, twin, listings)