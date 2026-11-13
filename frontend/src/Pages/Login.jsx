import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import authService from '../services/api/authService';
import { getApiErrorMessage } from '../services/api/getApiErrorMessage';
import { useGlobalContext } from '../context';
import { useLanguage } from '../i18n/LanguageContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useGlobalContext();
  const { t } = useLanguage();

  useEffect(() => {
    if (searchParams.get('passwordReset') === 'success') {
      setSuccess('Your password was reset successfully. You can now log in.');
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowResendVerification(false);
    setIsSubmitting(true);

    const emailValue = email.trim();
    const passwordValue = password;

    try {
      const session = await authService.login(emailValue, passwordValue);

      // Clear fields and demote password input so Chrome does not open
      // "Verifier vos mots de passe enregistres" / save-password UI.
      setPassword('');
      setEmail('');
      setShowPassword(true);

      await login(session.accessToken);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, t('login.invalidCredentials')));
      if (requestError?.response?.data?.error?.code === 'EMAIL_NOT_VERIFIED') {
        setShowResendVerification(true);
      }
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
    <AuthShell title={t('login.title')} description={t('login.subtitle')}>
      <form
        className="login-form"
        onSubmit={handleLogin}
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        data-bwignore="true"
        data-form-type="other"
      >
        {error ? <div className="auth-message error">{error}</div> : null}
        {success ? <div className="auth-message success">{success}</div> : null}

        <div className="login-field">
          <label className="login-label" htmlFor="ls-account">
            {t('login.email')}
          </label>
          <input
            id="ls-account"
            className="login-input"
            type="text"
            name="ls_account_id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('login.emailPlaceholder')}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="email"
            readOnly
            onFocus={(e) => e.target.removeAttribute('readOnly')}
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            required
          />
        </div>

        <div className="login-field">
          <label className="login-label" htmlFor="ls-secret">
            {t('login.password')}
          </label>
          <input
            id="ls-secret"
            className={`login-input${showPassword ? '' : ' login-input-secret'}`}
            type="text"
            name="ls_secret_value"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="off"
            readOnly
            onFocus={(e) => e.target.removeAttribute('readOnly')}
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            required
          />
        </div>

        <div className="login-checkbox-row">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword">{t('common.showPassword')}</label>
        </div>

        <button type="submit" className="login-btn" disabled={isSubmitting}>
          {isSubmitting ? '...' : t('login.submit')}
        </button>
      </form>

      {showResendVerification ? (
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
        <Link to="/forgot-password">{t('login.forgot')}</Link>
        <span>·</span>
        <Link to="/register">Create account</Link>
      </div>
    </AuthShell>
  );
}
