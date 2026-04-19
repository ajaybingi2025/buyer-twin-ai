from db.connection import get_connection


def get_buyer_by_user_id(user_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT * FROM buyers
                WHERE user_id = %s;
                """,
                (user_id,),
            )
            row = cur.fetchone()
            return dict(row) if row else None