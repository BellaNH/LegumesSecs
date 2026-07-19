import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger("api")


def _client_origin() -> str:
    return getattr(settings, "CLIENT_ORIGIN", "http://localhost:5173")


def _app_name() -> str:
    return getattr(settings, "APP_NAME", "LegumeSec")


def _send_email(subject: str, text: str, html: str, to: str) -> None:
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", None) or "no-reply@localhost"

    try:
        send_mail(
            subject=subject,
            message=text,
            from_email=from_email,
            recipient_list=[to],
            html_message=html,
            fail_silently=False,
        )
    except Exception:
        logger.exception("[email failed] %s -> %s", subject, to)
        if settings.DEBUG:
            logger.info(text)
        # In local/dev without SMTP, still expose the link in logs.
        if settings.DEBUG:
            return
        raise


def send_verification_email(email: str, token: str) -> None:
    verification_url = f"{_client_origin()}/verify-email?token={token}"
    app_name = _app_name()

    if settings.DEBUG:
        logger.info("[dev verification link] %s: %s", email, verification_url)

    text = "\n".join(
        [
            f"Welcome to {app_name}.",
            "Verify your email address to activate your account.",
            "",
            verification_url,
            "",
            "This link expires in 24 hours.",
        ]
    )
    html = f"""
      <p>Welcome to {app_name}.</p>
      <p>Verify your email address to activate your account.</p>
      <p><a href="{verification_url}">Verify email</a></p>
      <p>This link expires in 24 hours.</p>
    """
    _send_email("Verify your email address", text, html, email)


def send_password_reset_email(email: str, token: str) -> None:
    reset_url = f"{_client_origin()}/reset-password?token={token}"

    if settings.DEBUG:
        logger.info("[dev password reset link] %s: %s", email, reset_url)

    text = "\n".join(
        [
            "You requested a password reset.",
            "",
            reset_url,
            "",
            "This link expires in 30 minutes. If you did not request this, you can ignore this email.",
        ]
    )
    html = f"""
      <p>You requested a password reset.</p>
      <p><a href="{reset_url}">Reset password</a></p>
      <p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>
    """
    _send_email("Reset your password", text, html, email)
