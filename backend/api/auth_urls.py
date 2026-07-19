from django.urls import path

from api import auth_views

urlpatterns = [
    path("register", auth_views.RegisterView.as_view(), name="auth-register"),
    path("verify-email", auth_views.VerifyEmailView.as_view(), name="auth-verify-email"),
    path(
        "resend-verification-email",
        auth_views.ResendVerificationEmailView.as_view(),
        name="auth-resend-verification",
    ),
    path("login", auth_views.LoginView.as_view(), name="auth-login"),
    path("refresh", auth_views.RefreshView.as_view(), name="auth-refresh"),
    path("logout", auth_views.LogoutView.as_view(), name="auth-logout"),
    path("forgot-password", auth_views.ForgotPasswordView.as_view(), name="auth-forgot-password"),
    path("reset-password", auth_views.ResetPasswordView.as_view(), name="auth-reset-password"),
    path("me", auth_views.MeView.as_view(), name="auth-me"),
]
