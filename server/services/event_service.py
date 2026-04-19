from db.connection import get_connection


def get_events_by_buyer_id(buyer_id: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT * FROM buyer_events
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
                FROM buyer_events
                WHERE buyer_id = %s;
                """,
                (buyer_id,),
            )
            row = cur.fetchone()
            if not row:
                return None
            return row["latest_event_timestamp"]