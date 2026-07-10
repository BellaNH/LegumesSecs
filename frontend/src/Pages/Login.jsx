import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context';
import authService from '../services/api/authService';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import loginImage from '../assets/login.jpg';
import { useLanguage } from '../i18n/LanguageContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [welcomeMsg, setWelcomeMsg] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();
  const { login, url } = useGlobalContext();
  const { t } = useLanguage();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/token/`, {
        email,
        password,
      });

      const { access, refresh } = response.data;
      await login(access, refresh);

      setPassword('');
      setEmail('');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.detail ||
        error.response?.data?.error ||
        error.message ||
        t('login.invalidCredentials');
      alert(`${t('login.errorPrefix')}: ${errorMessage}`);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail || !newPassword) {
      alert(t('login.fillAll'));
      return;
    }

    if (newPassword.length < 8) {
      alert(t('login.passwordMin'));
      return;
    }

    try {
      await authService.resetPassword(resetEmail, newPassword);
      alert(t('login.resetSuccess'));
      setForgotOpen(false);
      setNewPassword('');
      setResetEmail('');
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        t('login.resetError');
      alert(errorMessage);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-visual">
          <img src={loginImage} alt="" />
          <div className="login-visual-overlay" aria-hidden="true" />
        </div>

        <div className="login-panel">
          <div className="login-panel-inner">
            <div className="login-brand">
              <span className="login-brand-dot" />
              <span className="login-brand-name">LegumeSec</span>
            </div>

            <h1 className="login-title">{t('login.title')}</h1>
            <p className="login-subtitle">{t('login.subtitle')}</p>

            <form
              className="login-form"
              onSubmit={handleLogin}
              autoComplete="off"
              data-form-type="other"
            >
              <input
                type="text"
                name="prevent_autofill"
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                className="login-autofill-guard"
              />
              <input
                type="password"
                name="prevent_autofill_pass"
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                className="login-autofill-guard"
              />

              <div className="login-field">
                <label className="login-label" htmlFor="login-email">
                  {t('login.email')}
                </label>
                <input
                  id="login-email"
                  className="login-input"
                  type="text"
                  name="legumesec_email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('login.emailPlaceholder')}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readOnly')}
                  data-lpignore="true"
                  data-1p-ignore
                  required
                />
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="login-password">
                  {t('login.password')}
                </label>
                <input
                  id="login-password"
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  name="legumesec_secret"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="one-time-code"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readOnly')}
                  data-lpignore="true"
                  data-1p-ignore
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

              <button type="submit" className="login-btn">
                {t('login.submit')}
              </button>
            </form>

            <div className="login-forgot-wrap">
              <button type="button" className="login-forgot-btn" onClick={() => setForgotOpen(true)}>
                {t('login.forgot')}
              </button>
            </div>

            {welcomeMsg && <div className="login-welcome-msg">{welcomeMsg}</div>}
          </div>
        </div>
      </div>

      <Dialog
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        PaperProps={{
          sx: {
            p: 3,
            borderRadius: '16px',
            minWidth: { xs: 300, sm: 400 },
            bgcolor: '#ffffff',
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            mb: 1,
            color: '#16a34a',
          }}
        >
          {t('login.forgotTitle')}
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t('login.forgotHint')}
          </Typography>

          <TextField
            fullWidth
            label={t('login.email')}
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            margin="dense"
            autoComplete="off"
          />

          <TextField
            fullWidth
            label={t('login.newPassword')}
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="dense"
            sx={{ mt: 2 }}
            autoComplete="off"
            inputProps={{ autoComplete: 'off', 'data-lpignore': true }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <input
              type="checkbox"
              id="showNewPassword"
              checked={showNewPassword}
              onChange={() => setShowNewPassword(!showNewPassword)}
              style={{ marginRight: 8 }}
            />
            <label htmlFor="showNewPassword" style={{ fontSize: '0.9rem' }}>
              {t('common.showPassword')}
            </label>
          </Box>
        </DialogContent>

        <DialogActions sx={{ mt: 2, justifyContent: 'space-between', px: 2 }}>
          <Button
            onClick={() => setForgotOpen(false)}
            variant="contained"
            sx={{
              bgcolor: '#d32f2f',
              '&:hover': { bgcolor: '#b71c1c' },
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handlePasswordReset}
            variant="contained"
            sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
          >
            {t('login.reset')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
