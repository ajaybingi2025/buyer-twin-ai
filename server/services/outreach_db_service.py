from datetime import datetime
from db.connection import get_connection
from services.cache_utils import is_stale

def get_outreach_by_buyer_and_listing(buyer_id: str, listing_id: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT *
                FROM outreach_assets
                WHERE buyer_id = %s AND listing_id = %s;
                """,
                (buyer_id, listing_id),
            )
            row = cur.fetchone()
            if not row:
                return None

            result = dict(row)
            if isinstance(result.get("generated_at"), datetime):
                result["generated_at"] = result["generated_at"].isoformat()
            return result


def upsert_outreach(outreach: dict):
    generated_at = outreach["generated_at"].replace("Z", "") if isinstance(outreach["generated_at"], str) else outreach["generated_at"]

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO outreach_assets (
                    id,
                    buyer_id,
                    listing_id,
                    sms_text,
                    email_subject,
                    email_body,
                    call_script,
                    generated_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id)
                DO UPDATE SET
                    buyer_id = EXCLUDED.buyer_id,
                    listing_id = EXCLUDED.listing_id,
                    sms_text = EXCLUDED.sms_text,
                    email_subject = EXCLUDED.email_subject,
                    email_body = EXCLUDED.email_body,
                    call_script = EXCLUDED.call_script,
                    generated_at = EXCLUDED.generated_at;
                """,
                (
                    outreach["id"],
                    outreach["buyer_id"],
                    outreach["listing_id"],
                    outreach["sms_text"],
                    outreach["email_subject"],
                    outreach["email_body"],
                    outreach["call_script"],
                    generated_at,
                ),
            )
            conn.commit()


def generate_and_store_outreach(
    buyer: dict,
    twin: dict,
    top_recommendation: dict,
    generate_outreach_func
):
    existing_outreach = get_outreach_by_buyer_and_listing(
        buyer["id"],
        top_recommendation["listing_id"]
    )
    if existing_outreach:
        return existing_outreach

    outreach = generate_outreach_func(buyer, twin, top_recommendation)
    upsert_outreach(outreach)
    return outreach


def refresh_and_store_outreach(
    buyer: dict,
    twin: dict,
    top_recommendation: dict,
    generate_outreach_func
):
    outreach = generate_outreach_func(buyer, twin, top_recommendation)
    upsert_outreach(outreach)
    return outreach