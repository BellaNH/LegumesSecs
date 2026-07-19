import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { AuthShell } from "../components/AuthShell";
import { FormMessage } from "../components/FormMessage";
import { resetPasswordRequest } from "../services/auth.api";
import { getApiErrorMessage } from "../services/get-api-error-message";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const token = searchParams.get("token");

    if (!token) {
      setError("The reset link is missing a token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPasswordRequest(token, password);
      navigate("/login?passwordReset=success", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not reset your password."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell title="Choose a new password" description="Your new password must be at least 8 characters.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <FormMessage type="error" message={error} /> : null}

        <label className="block">
          <span className="text-sm font-medium text-slate-700">New password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-950"
            required
            minLength={8}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Confirm new password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
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
          {isSubmitting ? "Resetting..." : "Reset password"}
        </button>

        <Link to="/login" className="block text-center text-sm font-semibold text-slate-950">
          Back to login
        </Link>
      </form>
    </AuthShell>
  );
}
