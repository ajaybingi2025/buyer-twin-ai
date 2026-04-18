def build_angle_phrase(angle: str) -> str:
    angle = angle.lower()

    if angle == "schools":
        return "the strong school fit"
    if angle == "commute":
        return "the easy commute"
    if angle == "family space":
        return "the extra family space"
    if angle == "value":
        return "the overall value"
    return "the overall fit"


def generate_outreach(buyer: dict, twin: dict, top_recommendation: dict) -> dict:
    buyer_name = buyer["name"]
    address = top_recommendation["address_label"]
    city = top_recommendation["city"]
    price = top_recommendation["price"]
    fit_score = top_recommendation["fit_score"]
    angle_phrase = build_angle_phrase(twin["communication_angle"])
    readiness = twin["tour_readiness"]
    next_action = twin["next_best_action"]

    sms_text = (
        f"Hi {buyer_name}, I found a home I think really stands out for you — {address} in {city}. "
        f"It looks like a strong match based on {angle_phrase}. "
        f"Would you like me to send more details or set up a tour?"
    )

    email_subject = f"Top home match for you: {address}"

    email_body = (
        f"Hi {buyer_name},\n\n"
        f"I wanted to share a home that looks like a particularly strong fit for what you’ve been looking for.\n\n"
        f"Property: {address}, {city}\n"
        f"Price: ${price:,}\n"
        f"Fit Score: {fit_score}\n\n"
        f"This recommendation stands out because of {angle_phrase}, and your current activity suggests you are in {readiness}.\n\n"
        f"My recommendation would be to {next_action}. "
        f"If you'd like, I can also send you 2 to 3 similar options.\n\n"
        f"Best,\n"
        f"Your Agent"
    )

    call_script = (
        f"Hi {buyer_name}, this is your agent. I wanted to quickly mention a home that seems like a strong fit: "
        f"{address} in {city}, listed at ${price:,}. "
        f"What stands out most is {angle_phrase}. "
        f"Based on your recent activity, I think this could be a good time to {next_action}. "
        f"Would you like me to send the details or help schedule a tour?"
    )

    return {
        "id": f"outreach_{buyer['id']}_{top_recommendation['listing_id']}",
        "buyer_id": buyer["id"],
        "listing_id": top_recommendation["listing_id"],
        "sms_text": sms_text,
        "email_subject": email_subject,
        "email_body": email_body,
        "call_script": call_script,
        "generated_at": "2026-04-18T12:30:00Z"
    }