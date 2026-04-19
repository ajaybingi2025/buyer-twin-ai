import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from dotenv import load_dotenv
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Header, HTTPException

from db.connection import get_connection

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-dev-key-change-this")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_data: dict) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_data["id"]),
        "email": user_data["email"],
        "role": user_data["role"],
        "exp": expire,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_user_by_email(email: str) -> Optional[dict]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, name, email, password_hash, role, created_at
                FROM users
                WHERE email = %s;
                """,
                (email,),
            )
            row = cur.fetchone()
            return dict(row) if row else None


def get_user_by_id(user_id: int) -> Optional[dict]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, name, email, role, created_at
                FROM users
                WHERE id = %s;
                """,
                (user_id,),
            )
            row = cur.fetchone()
            return dict(row) if row else None


def get_buyer_profile_by_user_id(user_id: int) -> Optional[dict]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, name, email, phone, budget_min, budget_max,
                       desired_locations, timeline, must_have_features,
                       inquiry_text, created_at, user_id
                FROM buyers
                WHERE user_id = %s;
                """,
                (str(user_id),),
            )
            row = cur.fetchone()
            return dict(row) if row else None


def generate_next_buyer_id(cur) -> str:
    cur.execute(
        """
        SELECT id
        FROM buyers
        WHERE id LIKE 'buyer_%'
        ORDER BY id DESC
        LIMIT 1;
        """
    )
    row = cur.fetchone()

    if not row:
        return "buyer_001"

    row = dict(row)
    last_id = row["id"]
    last_num = int(last_id.split("_")[1])
    return f"buyer_{last_num + 1:03d}"


def attach_buyer_profile_id(user: dict) -> dict:
    user = dict(user)
    buyer_profile = get_buyer_profile_by_user_id(int(user["id"]))
    user["buyer_profile_id"] = buyer_profile["id"] if buyer_profile else None
    return user


def create_user(name: str, email: str, password: str, role: str) -> dict:
    existing_user = get_user_by_email(email)
    if existing_user:
        raise ValueError("User with this email already exists")

    password_hash = hash_password(password)

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO users (name, email, password_hash, role)
                VALUES (%s, %s, %s, %s)
                RETURNING id, name, email, role, created_at;
                """,
                (name, email, password_hash, role),
            )
            created_user = dict(cur.fetchone())

            if role == "buyer":
                cur.execute(
                    """
                    SELECT id
                    FROM buyers
                    WHERE email = %s
                    LIMIT 1;
                    """,
                    (email,),
                )
                existing_buyer = cur.fetchone()

                if existing_buyer:
                    existing_buyer = dict(existing_buyer)
                    cur.execute(
                        """
                        UPDATE buyers
                        SET user_id = %s
                        WHERE id = %s;
                        """,
                        (str(created_user["id"]), existing_buyer["id"]),
                    )
                    buyer_profile_id = existing_buyer["id"]
                else:
                    buyer_profile_id = generate_next_buyer_id(cur)

                    cur.execute(
                        """
                        INSERT INTO buyers (
                            id,
                            name,
                            email,
                            phone,
                            budget_min,
                            budget_max,
                            desired_locations,
                            timeline,
                            must_have_features,
                            inquiry_text,
                            created_at,
                            user_id
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s);
                        """,
                        (
                            buyer_profile_id,
                            name,
                            email,
                            "",
                            0,
                            0,
                            "[]",
                            "",
                            "[]",
                            "",
                            str(created_user["id"]),
                        ),
                    )

                created_user["buyer_profile_id"] = buyer_profile_id
            else:
                created_user["buyer_profile_id"] = None

            conn.commit()
            return created_user


def authenticate_user(email: str, password: str) -> Optional[dict]:
    user = get_user_by_email(email)
    if not user:
        return None

    if not verify_password(password, user["password_hash"]):
        return None

    authenticated_user = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "created_at": user["created_at"],
    }

    return attach_buyer_profile_id(authenticated_user)


def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_current_user_from_header(authorization: str = Header(default=None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.split(" ", 1)[1]
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = get_user_by_id(int(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return attach_buyer_profile_id(user)


def require_role(user: dict, allowed_roles: list[str]) -> None:
    if user["role"] not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail=f"Access denied. Allowed roles: {', '.join(allowed_roles)}"
        )