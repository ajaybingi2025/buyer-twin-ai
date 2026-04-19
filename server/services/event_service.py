from db.connection import get_connection


def get_events_by_buyer_id(buyer_id: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT *
                FROM app_events
                WHERE buyer_id = %s
                ORDER BY timestamp;
                """,
                (buyer_id,),
            )
            rows = cur.fetchall()
            return [dict(row) for row in rows]


def get_latest_event_timestamp(buyer_id: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT MAX(timestamp) AS latest_event_timestamp
                FROM app_events
                WHERE buyer_id = %s;
                """,
                (buyer_id,),
            )
            row = cur.fetchone()
            if not row:
                return None
            return row["latest_event_timestamp"]


def get_saved_listings_by_buyer_id(buyer_id: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                WITH latest_save_events AS (
                    SELECT DISTINCT ON (ae.target_id)
                        ae.target_id,
                        ae.event_type,
                        ae.timestamp,
                        ae.metadata
                    FROM app_events ae
                    WHERE ae.buyer_id = %s
                      AND ae.event_type IN ('listing_saved', 'listing_unsaved')
                      AND ae.target_id IS NOT NULL
                    ORDER BY ae.target_id, ae.timestamp DESC
                )
                SELECT
                    COALESCE(l.id, lse.target_id) AS id,
                    COALESCE(l.address_label, lse.metadata->>'title', lse.target_id) AS address_label,
                    COALESCE(l.city, lse.metadata->>'city', '') AS city,
                    COALESCE(l.price, (NULLIF(lse.metadata->>'price', '')::numeric), 0) AS price,
                    COALESCE(l.bedrooms, 0) AS bedrooms,
                    COALESCE(l.bathrooms, 0) AS bathrooms,
                    COALESCE(l.sqft, 0) AS sqft,
                    COALESCE(l.neighborhood, lse.metadata->>'neighborhood', '') AS neighborhood,
                    COALESCE(l.school_score, 0) AS school_score,
                    COALESCE(l.commute_score, 0) AS commute_score,
                    COALESCE(l.tags, '[]'::jsonb) AS tags,
                    COALESCE(l.description, '') AS description,
                    COALESCE(l.image_url, '') AS image_url
                FROM latest_save_events lse
                LEFT JOIN listings l
                  ON l.id = lse.target_id
                WHERE lse.event_type = 'listing_saved'
                ORDER BY lse.timestamp DESC;
                """,
                (buyer_id,),
            )
            rows = cur.fetchall()
            return [dict(row) for row in rows]