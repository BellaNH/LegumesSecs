from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.services.auth_service import (
    AuthError,
    get_current_auth_user,
    login_user,
    logout_user,
    refresh_session,
    register_user,
    request_password_reset,
    resend_verification_email,
    reset_password,
    verify_email,
)
from api.services.auth_tokens import REFRESH_TOKEN_COOKIE_NAME, refresh_cookie_kwargs


def _error_response(error: AuthError) -> Response:
    return Response(
        {
            "success": False,
            "error": {
                "code": error.code,
                "message": error.message,
            },
        },
        status=error.status_code,
    )


def _validation_error(message: str, code: str = "VALIDATION_ERROR") -> Response:
    return Response(
        {
            "success": False,
            "error": {
                "code": code,
                "message": message,
            },
        },
        status=status.HTTP_400_BAD_REQUEST,
    )


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    kwargs = refresh_cookie_kwargs()
    response.set_cookie(value=refresh_token, **kwargs)


def _clear_refresh_cookie(response: Response) -> None:
    kwargs = refresh_cookie_kwargs()
    response.delete_cookie(
        key=REFRESH_TOKEN_COOKIE_NAME,
        path=kwargs["path"],
        samesite=kwargs["samesite"],
    )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        full_name = request.data.get("fullName") or request.data.get("full_name")

        if not email or not password or not full_name:
            return _validation_error("email, password, and fullName are required.")
        if len(str(password)) < 8:
            return _validation_error("Password must be at least 8 characters long.")

        try:
            user = register_user(email=email, password=password, full_name=full_name)
        except AuthError as error:
            return _error_response(error)

        return Response(
            {"success": True, "data": {"user": user}},
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token or len(str(token)) < 32:
            return _validation_error("Verification token is invalid.")

        try:
            verify_email(token=token)
        except AuthError as error:
            return _error_response(error)

        return Response(
            {"success": True, "message": "Email verified successfully."},
            status=status.HTTP_200_OK,
        )


class ResendVerificationEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return _validation_error("email is required.")

        try:
            resend_verification_email(email=email)
        except AuthError as error:
            return _error_response(error)

        return Response(
            {
                "success": True,
                "message": "If the account exists and is not verified, a new verification email has been sent.",
            },
            status=status.HTTP_200_OK,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return _validation_error("email and password are required.")

        try:
            session = login_user(email=email, password=password)
        except AuthError as error:
            return _error_response(error)

        refresh_token = session.pop("refreshToken")
        response = Response(
            {"success": True, "data": session},
            status=status.HTTP_200_OK,
        )
        _set_refresh_cookie(response, refresh_token)
        return response


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            session = refresh_session(
                refresh_token=request.COOKIES.get(REFRESH_TOKEN_COOKIE_NAME)
            )
        except AuthError as error:
            return _error_response(error)

        refresh_token = session.pop("refreshToken")
        response = Response(
            {"success": True, "data": session},
            status=status.HTTP_200_OK,
        )
        _set_refresh_cookie(response, refresh_token)
        return response


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        logout_user(refresh_token=request.COOKIES.get(REFRESH_TOKEN_COOKIE_NAME))
        response = Response(
            {"success": True, "message": "Logged out successfully."},
            status=status.HTTP_200_OK,
        )
        _clear_refresh_cookie(response)
        return response


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return _validation_error("email is required.")

        try:
            request_password_reset(email=email)
        except AuthError as error:
            return _error_response(error)

        return Response(
            {"success": True, "message": "A reset link was sent to your email."},
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        password = request.data.get("password")

        if not token or len(str(token)) < 32:
            return _validation_error("Reset token is invalid.")
        if not password or len(str(password)) < 8:
            return _validation_error("Password must be at least 8 characters long.")

        try:
            reset_password(token=token, password=password)
        except AuthError as error:
            return _error_response(error)

        response = Response(
            {"success": True, "message": "Password reset successfully."},
            status=status.HTTP_200_OK,
        )
        _clear_refresh_cookie(response)
        return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = get_current_auth_user(request.user.id)
        except AuthError as error:
            return _error_response(error)

        return Response(
            {"success": True, "data": {"user": user}},
            status=status.HTTP_200_OK,
        )
