from datetime import datetime, timezone


def normalize_timestamp(value):
    if value is None:
        return None

    if isinstance(value, datetime):
        # If timezone-aware, convert to UTC then strip tzinfo
        if value.tzinfo is not None:
            value = value.astimezone(timezone.utc).replace(tzinfo=None)
        return value

    if isinstance(value, str):
        cleaned = value.replace("Z", "")
        try:
            dt = datetime.fromisoformat(cleaned)
            if dt.tzinfo is not None:
                dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
            return dt
        except ValueError:
            return None

    return None


def is_stale(latest_event_ts, generated_at) -> bool:
    latest_event_ts = normalize_timestamp(latest_event_ts)
    generated_at = normalize_timestamp(generated_at)

    if latest_event_ts is None or generated_at is None:
        return False

    return latest_event_ts > generated_at