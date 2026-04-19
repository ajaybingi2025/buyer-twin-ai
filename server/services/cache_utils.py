from datetime import datetime


def normalize_timestamp(value):
    if value is None:
        return None

    if isinstance(value, datetime):
        return value

    if isinstance(value, str):
        cleaned = value.replace("Z", "")
        return datetime.fromisoformat(cleaned)

    return None


def is_stale(latest_event_ts, generated_at) -> bool:
    latest_event_ts = normalize_timestamp(latest_event_ts)
    generated_at = normalize_timestamp(generated_at)

    if latest_event_ts is None or generated_at is None:
        return False

    return latest_event_ts > generated_at