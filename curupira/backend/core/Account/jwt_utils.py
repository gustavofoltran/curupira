import jwt
from django.conf import settings
from datetime import datetime, timedelta, timezone

def create_jwt_token(user_id, exp_hours: int = 1) -> str:
    """Create a JWT token encoding the user_id and expiration time.

    The token is signed with Django's SECRET_KEY using HS256.
    """
    now = datetime.now(tz=timezone.utc)
    payload = {
        "user_id": int(user_id),
        "iat": now,
        "exp": now + timedelta(hours=exp_hours),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token


def decode_jwt_token(token: str) -> dict:
    """Decode and verify the JWT token. Raises jwt exceptions on failure."""
    return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])