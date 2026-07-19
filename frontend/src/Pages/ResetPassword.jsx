import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import authService from '../services/api/authService';
import { getApiErrorMessage } from '../services/api/getApiErrorMessage';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const token = searchParams.get('token');
    if (!token) {
      setError('The reset link is missing a token.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.resetPassword(token, password);
      navigate('/login?passwordReset=success', { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not reset your password.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell title="Choose a new password" description="Your new password must be at least 8 characters.">
      <form className="login-form" onSubmit={handleSubmit}>
        {error ? <div className="auth-message error">{error}</div> : null}

        <div className="login-field">
          <label className="login-label" htmlFor="reset-password">
            New password
          </label>
          <input
            id="reset-password"
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div className="login-field">
          <label className="login-label" htmlFor="reset-confirm">
            Confirm new password
          </label>
          <input
            id="reset-confirm"
            className="login-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <button type="submit" className="login-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Resetting...' : 'Reset password'}
        </button>
      </form>

      <div className="auth-link-row">
        <Link to="/login">Back to login</Link>
      </div>
    </AuthShell>
  );
}
