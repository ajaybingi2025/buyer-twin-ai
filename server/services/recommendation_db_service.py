from datetime import datetime
from psycopg2.extras import Json
from db.connection import get_connection
from services.cache_utils import is_stale
from services.event_service import get_latest_event_timestamp


def get_recommendations_by_buyer_id(buyer_id: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT *
                FROM recommendations
                WHERE buyer_id = %s
                ORDER BY rank ASC;
                """,
                (buyer_id,),
            )
            rows = cur.fetchall()
            results = [dict(row) for row in rows]

            for row in results:
                if isinstance(row.get("created_at"), datetime):
                    row["created_at"] = row["created_at"].isoformat()
                if row.get("fit_score") is not None:
                    row["fit_score"] = float(row["fit_score"])

            return results


def delete_recommendations_by_buyer_id(buyer_id: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM recommendations
                WHERE buyer_id = %s;
                """,
                (buyer_id,),
            )
            conn.commit()


def save_recommendations(recommendations: list):
    if not recommendations:
        return

    buyer_id = recommendations[0]["buyer_id"]
    delete_recommendations_by_buyer_id(buyer_id)

    with get_connection() as conn:
        with conn.cursor() as cur:
            for recommendation in recommendations:
                cur.execute(
                    """
                    INSERT INTO recommendations (
                        id,
                        buyer_id,
                        listing_id,
                        address_label,
                        city,
                        price,
                        fit_score,
                        explanation,
                        matching_factors,
                        score_breakdown,
                        rank
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                    """,
                    (
                        recommendation["id"],
                        recommendation["buyer_id"],
                        recommendation["listing_id"],
                        recommendation["address_label"],
                        recommendation["city"],
                        recommendation["price"],
                        recommendation["fit_score"],
                        recommendation["explanation"],
                        Json(recommendation["matching_factors"]),
                        Json(recommendation["score_breakdown"]),
                        recommendation["rank"],
                    ),
                )
            conn.commit()


def generate_and_store_recommendations(
    buyer: dict,
    twin: dict,
    listings: list,
    generate_recommendations_func
):
    existing_recommendations = get_recommendations_by_buyer_id(buyer["id"])
    latest_event_ts = get_latest_event_timestamp(buyer["id"])

    if existing_recommendations:
        newest_created_at = existing_recommendations[0].get("created_at")

        if not is_stale(latest_event_ts, newest_created_at):
            return existing_recommendations

    recommendations = generate_recommendations_func(buyer, twin, listings)
    save_recommendations(recommendations)
    return recommendations


def refresh_and_store_recommendations(
    buyer: dict,
    twin: dict,
    listings: list,
    generate_recommendations_func
):
    recommendations = generate_recommendations_func(buyer, twin, listings)
    save_recommendations(recommendations)
    return recommendations