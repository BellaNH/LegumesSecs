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
        'Identifiants invalides';
      alert(`Erreur: ${errorMessage}`);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail || !newPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (newPassword.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      await authService.resetPassword(resetEmail, newPassword);
      alert('Mot de passe réinitialisé avec succès');
      setForgotOpen(false);
      setNewPassword('');
      setResetEmail('');
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        'Erreur lors de la réinitialisation';
      alert(errorMessage);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-visual">
          <img src={loginImage} alt="Agriculture" />
          <div className="login-visual-overlay" aria-hidden="true" />
        </div>

        <div className="login-panel">
          <div className="login-panel-inner">
          <div className="login-brand">
            <span className="login-brand-dot" />
            <span className="login-brand-name">LegumeSec</span>
          </div>

          <h1 className="login-title">Connexion</h1>
          <p className="login-subtitle">Accédez à votre espace de gestion agricole</p>

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
                Adresse email
              </label>
              <input
                id="login-email"
                className="login-input"
                type="text"
                name="legumesec_email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
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
                Mot de passe
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
              <label htmlFor="showPassword">Afficher le mot de passe</label>
            </div>

            <button type="submit" className="login-btn">
              Se connecter
            </button>
          </form>

          <div className="login-forgot-wrap">
            <button type="button" className="login-forgot-btn" onClick={() => setForgotOpen(true)}>
              Mot de passe oublié ?
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
          Mot de passe oublié ?
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Veuillez saisir votre adresse email et le nouveau mot de passe :
          </Typography>

          <TextField
            fullWidth
            label="Adresse email"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            margin="dense"
            autoComplete="off"
          />

          <TextField
            fullWidth
            label="Nouveau mot de passe"
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
              Afficher le mot de passe
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
            Annuler
          </Button>
          <Button
            onClick={handlePasswordReset}
            variant="contained"
            sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
          >
            Réinitialiser
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
