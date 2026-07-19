import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import authService from '../services/api/authService';
import { getApiErrorMessage } from '../services/api/getApiErrorMessage';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState(token ? 'Verifying your email...' : '');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setIsVerified(true);
        setMessage('Your email is verified. You can now log in.');
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, 'Could not verify your email.'));
        setMessage('');
      }
    };

    verify();
  }, [token]);

  const visibleError = token ? error : 'The verification link is missing a token.';

  const handleResendVerificationEmail = async () => {
    setError('');
    setMessage('');
    setIsResending(true);

    try {
      await authService.resendVerificationEmail(email);
      setMessage('If this account is not verified yet, a new verification email has been sent.');
      setEmail('');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not send a new verification email.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell title="Verify email" description="We are checking your verification link.">
      {message ? <div className="auth-message success">{message}</div> : null}
      {visibleError ? <div className="auth-message error">{visibleError}</div> : null}

      {visibleError ? (
        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleResendVerificationEmail();
          }}
        >
          <div className="login-field">
            <label className="login-label" htmlFor="verify-email">
              Email
            </label>
            <input
              id="verify-email"
              className="login-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={isResending || !email}>
            {isResending ? 'Sending...' : 'Resend verification email'}
          </button>
        </form>
      ) : null}

      <div className="auth-link-row">
        {isVerified ? (
          <button type="button" className="auth-text-btn" onClick={() => navigate('/login')}>
            Go to login
          </button>
        ) : (
          <Link to="/login">Go to login</Link>
        )}
      </div>
    </AuthShell>
  );
}
