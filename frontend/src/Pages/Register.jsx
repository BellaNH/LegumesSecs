import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import authService from '../services/api/authService';
import { getApiErrorMessage } from '../services/api/getApiErrorMessage';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await authService.register({ fullName, email, password });
      setSuccess('Account created. Check your email (or server console in dev) for the verification link.');
      setPassword('');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not create your account.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    if (!email) {
      setError('Enter your email address first.');
      return;
    }

    setError('');
    setSuccess('');
    setIsResending(true);

    try {
      await authService.resendVerificationEmail(email);
      setSuccess('If this account is not verified yet, a new verification email has been sent.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not send a new verification email.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell title="Create your account" description="Start with your name, email, and password.">
      <form className="login-form" onSubmit={handleSubmit}>
        {error ? <div className="auth-message error">{error}</div> : null}
        {success ? <div className="auth-message success">{success}</div> : null}

        <div className="login-field">
          <label className="login-label" htmlFor="register-name">
            Full name
          </label>
          <input
            id="register-name"
            className="login-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            minLength={2}
          />
        </div>

        <div className="login-field">
          <label className="login-label" htmlFor="register-email">
            Email
          </label>
          <input
            id="register-email"
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-field">
          <label className="login-label" htmlFor="register-password">
            Password
          </label>
          <input
            id="register-password"
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <button type="submit" className="login-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create account'}
        </button>
      </form>

      {success ? (
        <div className="login-forgot-wrap">
          <button
            type="button"
            className="auth-text-btn"
            onClick={handleResendVerificationEmail}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend verification email'}
          </button>
        </div>
      ) : null}

      <div className="auth-link-row">
        <Link to="/login">Back to login</Link>
      </div>
    </AuthShell>
  );
}
