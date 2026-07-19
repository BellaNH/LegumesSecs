import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import authService from '../services/api/authService';
import { getApiErrorMessage } from '../services/api/getApiErrorMessage';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await authService.forgotPassword(email);
      setSuccess('A reset link was sent to your email (check server console in local development).');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not request a password reset.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell title="Reset your password" description="Enter your email to receive a reset link.">
      <form className="login-form" onSubmit={handleSubmit}>
        {error ? <div className="auth-message error">{error}</div> : null}
        {success ? <div className="auth-message success">{success}</div> : null}

        <div className="login-field">
          <label className="login-label" htmlFor="forgot-email">
            Email
          </label>
          <input
            id="forgot-email"
            className="login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      <div className="auth-link-row">
        <Link to="/login">Back to login</Link>
      </div>
    </AuthShell>
  );
}
