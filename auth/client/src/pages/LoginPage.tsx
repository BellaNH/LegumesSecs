import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import { AuthShell } from "../components/AuthShell";
import { FormMessage } from "../components/FormMessage";
import { loginRequest, resendVerificationEmailRequest } from "../services/auth.api";
import { getApiErrorMessage } from "../services/get-api-error-message";
import { useAuthStore } from "../store/auth.store";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (searchParams.get("passwordReset") === "success") {
      setSuccess("Your password was reset successfully. You can now log in.");
      navigate("/login", { replace: true });
    }
  }, [navigate, searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setShowResendVerification(false);
    setIsSubmitting(true);

    try {
      const session = await loginRequest({ email, password });
      setSession(session);
      navigate("/dashboard");
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Could not log you in.");
      setError(message);

      if (
        axios.isAxiosError(requestError) &&
        requestError.response?.data?.error.code === "EMAIL_NOT_VERIFIED"
      ) {
        setShowResendVerification(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    if (!email) {
      setError("Enter your email address first.");
      return;
    }

    setError("");
    setSuccess("");
    setIsResending(true);

    try {
      await resendVerificationEmailRequest(email);
      setSuccess("If this account is not verified yet, a new verification email has been sent.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not send a new verification email."));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell title="Log in" description="Use your verified account to continue.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <FormMessage type="error" message={error} /> : null}
        {success ? <FormMessage type="success" message={success} /> : null}

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-950"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-950"
            required
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="font-medium text-slate-700">
            Forgot password?
          </Link>
          <Link to="/register" className="font-semibold text-slate-950">
            Create account
          </Link>
        </div>

        {showResendVerification ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p>Your email is not verified yet, or your verification link may have expired.</p>
            <button
              type="button"
              onClick={handleResendVerificationEmail}
              disabled={isResending}
              className="mt-2 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {isResending ? "Sending..." : "Resend verification email"}
            </button>
          </div>
        ) : null}
      </form>
    </AuthShell>
  );
}
