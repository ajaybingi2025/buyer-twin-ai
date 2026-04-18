from fastapi import APIRouter, HTTPException
from services.loader_service import load_json
from services.inference_service import infer_decision_twin
from services.recommendation_service import generate_recommendations
from services.outreach_service import generate_outreach

router = APIRouter()


@router.post("/{buyer_id}")
def create_outreach(buyer_id: str):
    buyers = load_json("buyers.json")
    buyer = next((buyer for buyer in buyers if buyer["id"] == buyer_id), None)

    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")

    events = load_json("events.json")
    buyer_events = [event for event in events if event["buyer_id"] == buyer_id]

    twin = infer_decision_twin(buyer, buyer_events)
    listings = load_json("listings.json")
    recommendations = generate_recommendations(buyer, twin, listings)

    if not recommendations:
        raise HTTPException(status_code=404, detail="No recommendations available")

    top_recommendation = recommendations[0]
    return generate_outreach(buyer, twin, top_recommendation)