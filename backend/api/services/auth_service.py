from django.db import transaction
from django.utils import timezone

from api.models import (
    AuthRefreshToken,
    CustomUser,
    EmailVerificationToken,
    PasswordResetToken,
    Role,
)
from api.services.auth_email import send_password_reset_email, send_verification_email
from api.services.auth_tokens import (
    EMAIL_VERIFICATION_TTL_HOURS,
    PASSWORD_RESET_TTL_MINUTES,
    REFRESH_TOKEN_TTL_DAYS,
    add_days,
    add_hours,
    add_minutes,
    create_access_token,
    create_secure_token,
    hash_token,
)


class AuthError(Exception):
    def __init__(self, message: str, status_code: int = 400, code: str = "AUTH_ERROR"):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code


def _split_full_name(full_name: str) -> tuple[str, str]:
    parts = full_name.strip().split()
    if not parts:
        return "User", "Account"
    if len(parts) == 1:
        return parts[0][:15], parts[0][:15]
    return parts[0][:15], " ".join(parts[1:])[:15]


def _to_public_user(user: CustomUser) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "fullName": f"{user.prenom} {user.nom}".strip(),
        "nom": user.nom,
        "prenom": user.prenom,
        "emailVerified": user.email_verified,
        "createdAt": user.createDate.isoformat() if user.createDate else None,
    }


def _issue_session(user: CustomUser) -> dict:
    refresh_token = create_secure_token()
    AuthRefreshToken.objects.create(
        user=user,
        token_hash=hash_token(refresh_token),
        expires_at=add_days(REFRESH_TOKEN_TTL_DAYS),
    )
    return {
        "accessToken": create_access_token(user),
        "refreshToken": refresh_token,
        "user": _to_public_user(user),
    }


def register_user(*, email: str, password: str, full_name: str) -> dict:
    email = email.strip().lower()
    existing = CustomUser.objects.filter(email=email).first()
    if existing is not None:
        raise AuthError("An account with this email already exists.", 409, "EMAIL_ALREADY_EXISTS")

    nom, prenom = _split_full_name(full_name)
    role, _ = Role.objects.get_or_create(nom="user")
    verification_token = create_secure_token()

    with transaction.atomic():
        user = CustomUser(
            email=email,
            nom=nom,
            prenom=prenom,
            role=role,
            phoneNum=None,
            email_verified=False,
            is_staff=False,
            is_superuser=False,
        )
        user.set_password(password)
        user.save()
        EmailVerificationToken.objects.create(
            user=user,
            token_hash=hash_token(verification_token),
            expires_at=add_hours(EMAIL_VERIFICATION_TTL_HOURS),
        )

    send_verification_email(user.email, verification_token)
    return _to_public_user(user)


def verify_email(*, token: str) -> None:
    token_hash = hash_token(token)
    verification = (
        EmailVerificationToken.objects.select_related("user")
        .filter(token_hash=token_hash)
        .first()
    )

    if (
        verification is None
        or verification.used
        or verification.expires_at < timezone.now()
        or getattr(verification.user, "deleted", None)
    ):
        raise AuthError(
            "Verification token is invalid or expired.",
            400,
            "INVALID_VERIFICATION_TOKEN",
        )

    with transaction.atomic():
        verification.used = True
        verification.save(update_fields=["used"])
        verification.user.email_verified = True
        verification.user.save(update_fields=["email_verified"])


def resend_verification_email(*, email: str) -> None:
    email = email.strip().lower()
    user = CustomUser.objects.filter(email=email).first()
    if user is None or user.email_verified:
        return

    verification_token = create_secure_token()
    with transaction.atomic():
        EmailVerificationToken.objects.filter(user=user, used=False).update(used=True)
        EmailVerificationToken.objects.create(
            user=user,
            token_hash=hash_token(verification_token),
            expires_at=add_hours(EMAIL_VERIFICATION_TTL_HOURS),
        )

    send_verification_email(user.email, verification_token)


def login_user(*, email: str, password: str) -> dict:
    email = email.strip().lower()
    user = CustomUser.objects.filter(email=email).first()

    if user is None:
        raise AuthError("No account found with this email.", 401, "USER_NOT_FOUND")

    if not user.check_password(password):
        raise AuthError(
            "The email or password you entered is incorrect.",
            401,
            "INVALID_CREDENTIALS",
        )

    if not user.email_verified:
        raise AuthError(
            "Please verify your email before logging in.",
            403,
            "EMAIL_NOT_VERIFIED",
        )

    if not user.is_active:
        raise AuthError("This account is inactive.", 403, "ACCOUNT_INACTIVE")

    return _issue_session(user)


def refresh_session(*, refresh_token: str | None) -> dict:
    if not refresh_token:
        raise AuthError("Refresh token is missing.", 401, "REFRESH_TOKEN_MISSING")

    stored = (
        AuthRefreshToken.objects.select_related("user")
        .filter(token_hash=hash_token(refresh_token))
        .first()
    )

    if (
        stored is None
        or stored.revoked
        or stored.expires_at < timezone.now()
        or not stored.user.is_active
    ):
        raise AuthError("Refresh token is invalid or expired.", 401, "INVALID_REFRESH_TOKEN")

    next_refresh = create_secure_token()
    with transaction.atomic():
        stored.revoked = True
        stored.save(update_fields=["revoked"])
        AuthRefreshToken.objects.create(
            user=stored.user,
            token_hash=hash_token(next_refresh),
            expires_at=add_days(REFRESH_TOKEN_TTL_DAYS),
        )

    return {
        "accessToken": create_access_token(stored.user),
        "refreshToken": next_refresh,
        "user": _to_public_user(stored.user),
    }


def logout_user(*, refresh_token: str | None) -> None:
    if not refresh_token:
        return

    AuthRefreshToken.objects.filter(
        token_hash=hash_token(refresh_token),
        revoked=False,
    ).update(revoked=True)


def request_password_reset(*, email: str) -> None:
    email = email.strip().lower()
    user = CustomUser.objects.filter(email=email).first()
    if user is None:
        return

    reset_token = create_secure_token()
    PasswordResetToken.objects.create(
        user=user,
        token_hash=hash_token(reset_token),
        expires_at=add_minutes(PASSWORD_RESET_TTL_MINUTES),
    )
    send_password_reset_email(user.email, reset_token)


def reset_password(*, token: str, password: str) -> None:
    stored = (
        PasswordResetToken.objects.select_related("user")
        .filter(token_hash=hash_token(token))
        .first()
    )

    if (
        stored is None
        or stored.used
        or stored.expires_at < timezone.now()
    ):
        raise AuthError(
            "Password reset token is invalid or expired.",
            400,
            "INVALID_RESET_TOKEN",
        )

    with transaction.atomic():
        stored.used = True
        stored.save(update_fields=["used"])
        stored.user.set_password(password)
        stored.user.save(update_fields=["password"])
        AuthRefreshToken.objects.filter(user=stored.user, revoked=False).update(revoked=True)


def get_current_auth_user(user_id: int) -> dict:
    user = CustomUser.objects.filter(id=user_id, is_active=True).first()
    if user is None:
        raise AuthError("User not found.", 404, "USER_NOT_FOUND")
    return _to_public_user(user)
