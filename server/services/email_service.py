import os
import resend
from db.connection import get_connection


resend.api_key = os.getenv("RESEND_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "onboarding@resend.dev")
TEST_RECIPIENT = os.getenv("TEST_RECIPIENT_EMAIL")  # add this to .env


def get_top_recommendation_by_buyer_id(buyer_id: str) -> dict | None:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT r.*, l.image_url
                FROM recommendations r
                JOIN listings l ON l.id = r.listing_id
                WHERE r.buyer_id = %s
                ORDER BY r.rank ASC
                LIMIT 1
                """,
                (buyer_id,),
            )
            row = cur.fetchone()
            return dict(row) if row else None


def get_outreach_by_buyer_id(buyer_id: str) -> dict | None:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT *
                FROM outreach_assets
                WHERE buyer_id = %s
                ORDER BY generated_at DESC
                LIMIT 1
                """,
                (buyer_id,),
            )
            row = cur.fetchone()
            return dict(row) if row else None


def get_buyer_email(buyer_id: str) -> dict | None:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, name, email
                FROM buyers
                WHERE id = %s
                """,
                (buyer_id,),
            )
            row = cur.fetchone()
            return dict(row) if row else None


def build_html_email(buyer_name: str, email_body: str, recommendation: dict) -> str:
    address = recommendation.get("address_label", "")
    city = recommendation.get("city", "")
    price = recommendation.get("price", 0)
    fit_score = float(recommendation.get("fit_score", 0))
    image_url = recommendation.get("image_url", "")

    body_html = email_body.replace("\n", "<br>")

    image_block = (
        f'<img src="{image_url}" alt="{address}" style="width:100%;max-width:600px;border-radius:12px;margin-bottom:20px;" />'
        if image_url else ""
    )

    return f"""
    <div style="font-family: Georgia, serif; max-width: 600px; margin: auto; padding: 32px; background: #ffffff; border-radius: 16px;">
        <h2 style="color: #1a1a1a; font-size: 24px; margin-bottom: 8px;">Hi {buyer_name},</h2>
        <p style="color: #555; font-size: 15px; line-height: 1.7;">{body_html}</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 28px 0;" />

        {image_block}

        <div style="background: #f9f9f9; border-radius: 12px; padding: 20px; margin-top: 16px;">
            <h3 style="color: #1a1a1a; margin: 0 0 8px 0;">{address}</h3>
            <p style="color: #666; margin: 0 0 4px 0;">{city}</p>
            <p style="color: #1a1a1a; font-size: 18px; font-weight: bold; margin: 8px 0;">${price:,}</p>
            <p style="color: #4caf50; font-weight: bold; margin: 0;">Fit Score: {fit_score:.0f}%</p>
        </div>

        <p style="color: #999; font-size: 13px; margin-top: 32px;">
            This email was sent by your real estate agent via BuyerTwin.
        </p>
    </div>
    """


def send_recommendation_email(buyer_id: str) -> dict:
    # 1. Get buyer
    buyer = get_buyer_email(buyer_id)
    if not buyer:
        return {"success": False, "error": "Buyer not found"}

    # 2. Get top recommendation
    recommendation = get_top_recommendation_by_buyer_id(buyer_id)
    if not recommendation:
        return {"success": False, "error": "No recommendations found for this buyer"}

    # 3. Get outreach content
    outreach = get_outreach_by_buyer_id(buyer_id)
    if not outreach:
        return {"success": False, "error": "No outreach content found. Generate recommendations first."}

    # 4. Build and send email
    html_content = build_html_email(
        buyer_name=buyer["name"],
        email_body=outreach["email_body"],
        recommendation=recommendation,
    )

    # Use TEST_RECIPIENT if set in .env, otherwise use buyer's actual email
    recipient = TEST_RECIPIENT if TEST_RECIPIENT else buyer["email"]

    try:
        response = resend.Emails.send({
            "from": SENDER_EMAIL,
            "to": recipient,
            "subject": outreach["email_subject"],
            "html": html_content,
        })

        return {
            "success": True,
            "email_id": response.get("id"),
            "sent_to": recipient,
            "subject": outreach["email_subject"],
        }

    except Exception as e:
        return {"success": False, "error": str(e)}