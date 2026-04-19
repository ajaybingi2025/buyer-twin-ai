from datetime import datetime
from db.connection import get_connection
from services.cache_utils import is_stale
from services.event_service import get_latest_event_timestamp


def get_twin_by_buyer_id(buyer_id: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT * FROM decision_twins
                WHERE buyer_id = %s;
                """,
                (buyer_id,),
            )
            row = cur.fetchone()
            return dict(row) if row else None


def upsert_twin(twin: dict):
    generated_at = twin["generated_at"].replace("Z", "") if isinstance(twin["generated_at"], str) else twin["generated_at"]

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO decision_twins (
                    id,
                    buyer_id,
                    primary_driver,
                    secondary_driver,
                    price_sensitivity,
                    urgency,
                    tour_readiness,
                    communication_angle,
                    confidence_score,
                    next_best_action,
                    summary,
                    generated_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (buyer_id)
                DO UPDATE SET
                    id = EXCLUDED.id,
                    primary_driver = EXCLUDED.primary_driver,
                    secondary_driver = EXCLUDED.secondary_driver,
                    price_sensitivity = EXCLUDED.price_sensitivity,
                    urgency = EXCLUDED.urgency,
                    tour_readiness = EXCLUDED.tour_readiness,
                    communication_angle = EXCLUDED.communication_angle,
                    confidence_score = EXCLUDED.confidence_score,
                    next_best_action = EXCLUDED.next_best_action,
                    summary = EXCLUDED.summary,
                    generated_at = EXCLUDED.generated_at;
                """,
                (
                    twin["id"],
                    twin["buyer_id"],
                    twin["primary_driver"],
                    twin["secondary_driver"],
                    twin["price_sensitivity"],
                    twin["urgency"],
                    twin["tour_readiness"],
                    twin["communication_angle"],
                    twin["confidence_score"],
                    twin["next_best_action"],
                    twin["summary"],
                    generated_at,
                ),
            )
            conn.commit()


def _normalize_twin(existing_twin: dict):
    if isinstance(existing_twin.get("generated_at"), datetime):
        existing_twin["generated_at"] = existing_twin["generated_at"].isoformat()
    if existing_twin.get("confidence_score") is not None:
        existing_twin["confidence_score"] = float(existing_twin["confidence_score"])
    return existing_twin


def generate_and_store_twin(buyer: dict, buyer_events: list, infer_decision_twin_func):
    existing_twin = get_twin_by_buyer_id(buyer["id"])
    latest_event_ts = get_latest_event_timestamp(buyer["id"])

    if existing_twin:
        existing_twin = _normalize_twin(existing_twin)

        if not is_stale(latest_event_ts, existing_twin.get("generated_at")):
            return existing_twin

    twin = infer_decision_twin_func(buyer, buyer_events)
    upsert_twin(twin)
    return twin


def refresh_and_store_twin(buyer: dict, buyer_events: list, infer_decision_twin_func):
    twin = infer_decision_twin_func(buyer, buyer_events)
    upsert_twin(twin)
    return twin