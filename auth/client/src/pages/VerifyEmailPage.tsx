import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { AuthShell } from "../components/AuthShell";
import { FormMessage } from "../components/FormMessage";
import { getApiErrorMessage } from "../services/get-api-error-message";
import { resendVerificationEmailRequest, verifyEmailRequest } from "../services/auth.api";

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState(token ? "Verifying your email..." : "");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const verify = async () => {
      try {
        await verifyEmailRequest(token);
        setIsVerified(true);
        setMessage("Your email is verified. You can now log in.");
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Could not verify your email."));
        setMessage("");
      }
    };

    void verify();
  }, [token]);

  const visibleError = token ? error : "The verification link is missing a token.";

  const handleResendVerificationEmail = async () => {
    setError("");
    setMessage("");
    setIsResending(true);

    try {
      await resendVerificationEmailRequest(email);
      setMessage("If this account is not verified yet, a new verification email has been sent.");
      setEmail("");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not send a new verification email."));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell title="Verify email" description="We are checking your verification link.">
      <div className="space-y-4">
        {message ? <FormMessage type="success" message={message} /> : null}
        {visibleError ? <FormMessage type="error" message={visibleError} /> : null}
        {visibleError ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              If your verification link expired, enter your email to request a new one.
            </p>
            <div className="mt-3 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-950"
                required
              />
              <button
                type="button"
                onClick={handleResendVerificationEmail}
                disabled={isResending || !email}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
              >
                {isResending ? "Sending..." : "Resend verification email"}
              </button>
            </div>
          </div>
        ) : null}

        {isVerified ? (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Go to login
          </button>
        ) : (
          <Link
            to="/login"
            className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Go to login
          </Link>
        )}
      </div>
    </AuthShell>
  );
}
