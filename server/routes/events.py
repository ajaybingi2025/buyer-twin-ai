from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import psycopg2
import psycopg2.extras
import uuid
from datetime import datetime

router = APIRouter()

class EventCreate(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None
    event_type: str
    page: Optional[str] = None
    target_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    timestamp: Optional[str] = None

def get_db_connection():
    return psycopg2.connect(
        host="127.0.0.1",
        port=5432,
        dbname="buyertwin",
        user="postgres",
        password="postgres",
    )

LISTING_EVENT_TYPES = {
    "listing_viewed",
    "listing_saved",
    "tour_requested",
}

@router.post("")
def create_event(event: EventCreate):
    if event.event_type not in LISTING_EVENT_TYPES:
        return {
            "message": "Event received but not stored (non-listing event)",
            "stored": False,
            "event_type": event.event_type,
        }

    if not event.user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    if not event.target_id:
        raise HTTPException(status_code=400, detail="target_id is required")

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute(
        "SELECT id FROM buyers WHERE user_id = %s",
        (str(event.user_id),)
    )
    buyer_row = cur.fetchone()

    if not buyer_row:
        cur.close()
        conn.close()
        raise HTTPException(status_code=404, detail="No buyer profile linked to this user")

    buyer_id = buyer_row["id"]

    cur.execute(
        "SELECT id FROM listings WHERE id = %s",
        (event.target_id,)
    )
    listing_row = cur.fetchone()

    if not listing_row:
        cur.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Listing not found")

    event_id = str(uuid.uuid4())
    event_timestamp = (
        datetime.fromisoformat(event.timestamp.replace("Z", "+00:00")).replace(tzinfo=None)
        if event.timestamp
        else datetime.utcnow()
    )

    cur.execute(
        """
        INSERT INTO buyer_events (
            id,
            buyer_id,
            listing_id,
            event_type,
            timestamp,
            source_channel,
            metadata
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """,
        (
            event_id,
            buyer_id,
            event.target_id,
            event.event_type,
            event_timestamp,
            event.page,
            psycopg2.extras.Json(event.metadata or {}),
        ),
    )

    conn.commit()
    cur.close()
    conn.close()

    return {
        "message": "Event stored successfully",
        "stored": True,
        "event_id": event_id,
        "buyer_id": buyer_id,
    }   