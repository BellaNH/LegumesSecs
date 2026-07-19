import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { AuthShell } from "../components/AuthShell";
import { FormMessage } from "../components/FormMessage";
import { forgotPasswordRequest } from "../services/auth.api";
import { getApiErrorMessage } from "../services/get-api-error-message";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await forgotPasswordRequest(email);
      setSuccess("A reset link was sent to your email.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not request a password reset."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell title="Reset your password" description="Enter your email to receive a reset link.">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>

        <Link to="/login" className="block text-center text-sm font-semibold text-slate-950">
          Back to login
        </Link>
      </form>
    </AuthShell>
  );
}
