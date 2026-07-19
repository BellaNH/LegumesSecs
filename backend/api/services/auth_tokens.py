import hashlib
import secrets
from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from rest_framework_simplejwt.tokens import AccessToken

REFRESH_TOKEN_COOKIE_NAME = "refreshToken"
REFRESH_TOKEN_TTL_DAYS = 7
EMAIL_VERIFICATION_TTL_HOURS = 24
PASSWORD_RESET_TTL_MINUTES = 30


def create_secure_token() -> str:
    return secrets.token_hex(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def add_minutes(minutes: int):
    return timezone.now() + timedelta(minutes=minutes)


def add_hours(hours: int):
    return timezone.now() + timedelta(hours=hours)


def add_days(days: int):
    return timezone.now() + timedelta(days=days)


def create_access_token(user) -> str:
    token = AccessToken.for_user(user)
    token["email"] = user.email
    if getattr(user, "role", None) is not None:
        token["role"] = user.role.nom
    return str(token)


def refresh_cookie_kwargs():
    secure = not settings.DEBUG
    return {
        "key": REFRESH_TOKEN_COOKIE_NAME,
        "httponly": True,
        "secure": secure,
        "samesite": "Lax",
        "path": "/auth",
        "max_age": REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60,
    }
