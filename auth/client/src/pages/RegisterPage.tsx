import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { AuthShell } from "../components/AuthShell";
import { FormMessage } from "../components/FormMessage";
import { registerRequest, resendVerificationEmailRequest } from "../services/auth.api";
import { getApiErrorMessage } from "../services/get-api-error-message";

export function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await registerRequest({ fullName, email, password });
      setSuccess("Account created. Check your email for the verification link.");
      setPassword("");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not create your account."));
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
    <AuthShell title="Create your account" description="Start with an email and password.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <FormMessage type="error" message={error} /> : null}
        {success ? <FormMessage type="success" message={success} /> : null}

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Full name</span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-950"
            required
          />
        </label>

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
            minLength={8}
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-slate-950">
            Log in
          </Link>
        </p>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p>Did not receive the verification email, or did the link expire?</p>
          <button
            type="button"
            onClick={handleResendVerificationEmail}
            disabled={isResending}
            className="mt-2 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {isResending ? "Sending..." : "Resend verification email"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
