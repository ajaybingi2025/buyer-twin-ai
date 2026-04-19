from datetime import datetime
import uuid
from typing import Optional, Dict, Any

import psycopg2.extras
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from db.connection import get_connection

router = APIRouter()


class EventCreate(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None
    event_type: str
    page: Optional[str] = None
    target_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    timestamp: Optional[str] = None


LISTING_EVENT_TYPES = {
    "listing_viewed",
    "listing_saved",
    "listing_unsaved",
    "tour_requested",
}


def resolve_buyer_profile_id_from_user_id(user_id: str) -> Optional[str]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id
                FROM buyers
                WHERE user_id = %s
                LIMIT 1;
                """,
                (str(user_id),),
            )
            row = cur.fetchone()
            return row["id"] if row else None


def listing_exists(listing_id: str) -> bool:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 1
                FROM listings
                WHERE id = %s
                LIMIT 1;
                """,
                (listing_id,),
            )
            return cur.fetchone() is not None


@router.post("")
def create_event(event: EventCreate):
    print("EVENT PAYLOAD:", event.model_dump())

    if not event.user_id:
        raise HTTPException(status_code=400, detail="user_id is required")

    buyer_profile_id = resolve_buyer_profile_id_from_user_id(event.user_id)

    if event.timestamp:
        event_timestamp = datetime.fromisoformat(
            event.timestamp.replace("Z", "+00:00")
        ).replace(tzinfo=None)
    else:
        event_timestamp = datetime.utcnow()

    event_id = f"event_{uuid.uuid4().hex[:8]}"

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO app_events (
                    id,
                    user_id,
                    buyer_id,
                    role,
                    event_type,
                    page,
                    target_id,
                    timestamp,
                    metadata
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
                """,
                (
                    event_id,
                    str(event.user_id),
                    buyer_profile_id,
                    event.role,
                    event.event_type,
                    event.page,
                    event.target_id,
                    event_timestamp,
                    psycopg2.extras.Json(event.metadata or {}),
                ),
            )

            stored_in_buyer_events = False

            if (
                event.event_type in LISTING_EVENT_TYPES
                and buyer_profile_id
                and event.target_id
                and listing_exists(event.target_id)
            ):
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
                    VALUES (%s, %s, %s, %s, %s, %s, %s);
                    """,
                    (
                        f"be_{uuid.uuid4().hex[:8]}",
                        buyer_profile_id,
                        event.target_id,
                        event.event_type,
                        event_timestamp,
                        event.page,
                        psycopg2.extras.Json(event.metadata or {}),
                    ),
                )
                stored_in_buyer_events = True

            conn.commit()

    return {
        "message": "Event processed successfully",
        "stored": True,
        "stored_in_buyer_events": stored_in_buyer_events,
        "event_id": event_id,
    }