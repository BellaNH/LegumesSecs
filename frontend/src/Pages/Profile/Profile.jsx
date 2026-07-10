import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { FiUser, FiLock, FiLogOut, FiCheckCircle } from 'react-icons/fi';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import axios from 'axios';
import { useGlobalContext } from '../../context';
import { useLanguage } from '../../i18n/LanguageContext';
import userAvatar from '../pics/User.png';
import PageLoader from '../../components/common/PageLoader';
import './Profile.css';

const Profile = () => {
  const { url, user, logout } = useGlobalContext();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState({ input1: false, input2: false });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    id: '',
    nom: '',
    prenom: '',
    email: '',
    phoneNum: '',
    password: '',
    role_id: '',
  });

  const resetForm = () => {
    if (!user) return;
    setCurrentUser({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role_id: user.role.id,
      phoneNum: user.phoneNum,
      password: '',
    });
    setConfirmPassword('');
    setError('');
  };

  useEffect(() => {
    resetForm();
  }, [user]);

  const handleClickShowPassword = (e) => {
    const id = e.currentTarget.id;
    setShowPassword((prev) => ({
      ...prev,
      [`input${id}`]: !prev[`input${id}`],
    }));
  };

  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorMessage('');

    const passwordFilled = currentUser.password && currentUser.password.trim();
    const confirmPasswordFilled = confirmPassword && confirmPassword.trim();

    if (passwordFilled || confirmPasswordFilled) {
      if (!passwordFilled || !confirmPasswordFilled) {
        const errorMsg = t('profile.fillBoth');
        setError(errorMsg);
        setErrorMessage(errorMsg);
        setOpenError(true);
        return;
      }
      if (currentUser.password !== confirmPassword) {
        const errorMsg = t('profile.mismatch');
        setError(errorMsg);
        setErrorMessage(errorMsg);
        setOpenError(true);
        return;
      }
      if (currentUser.password.length < 8) {
        const errorMsg = t('profile.minLength');
        setError(errorMsg);
        setErrorMessage(errorMsg);
        setOpenError(true);
        return;
      }
      if (!/[A-Za-z]/.test(currentUser.password)) {
        const errorMsg = t('profile.needLetter');
        setError(errorMsg);
        setErrorMessage(errorMsg);
        setOpenError(true);
        return;
      }
      if (!/[0-9]/.test(currentUser.password)) {
        const errorMsg = t('profile.needDigit');
        setError(errorMsg);
        setErrorMessage(errorMsg);
        setOpenError(true);
        return;
      }
    }

    if (!currentUser?.id) {
      setErrorMessage(t('profile.invalidUser'));
      setOpenError(true);
      return;
    }

    try {
      const userToSend = {
        nom: currentUser.nom,
        prenom: currentUser.prenom,
        email: currentUser.email,
        role_id: currentUser.role_id ? parseInt(currentUser.role_id, 10) : currentUser.role_id,
        phoneNum: currentUser.phoneNum
          ? typeof currentUser.phoneNum === 'string'
            ? parseInt(currentUser.phoneNum, 10)
            : currentUser.phoneNum
          : null,
      };

      if (passwordFilled && confirmPasswordFilled && currentUser.password === confirmPassword) {
        userToSend.password = currentUser.password;
      }

      await axios.patch(`${url}/api/user/${currentUser.id}/`, userToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSuccessMessage(t('profile.updated', { name: currentUser.nom }));
      setOpenSuccess(true);
      setCurrentUser((prev) => ({ ...prev, password: '' }));
      setConfirmPassword('');
    } catch (err) {
      const data = err.response?.data;
      let errorMsg = t('profile.saveError');
      if (data) {
        if (data.error?.message) errorMsg = data.error.message;
        else if (data.message) errorMsg = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
        else if (data.detail) errorMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        else if (data.non_field_errors?.length) errorMsg = data.non_field_errors.join(' ');
        else if (typeof data === 'object') {
          const parts = [];
          for (const [, messages] of Object.entries(data)) {
            if (Array.isArray(messages)) parts.push(messages.join(' '));
            else if (typeof messages === 'string') parts.push(messages);
          }
          if (parts.length) errorMsg = parts.join(' ');
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setErrorMessage(errorMsg);
      setError(errorMsg);
      setOpenError(true);
    }
  };

  const displayName = [currentUser.prenom, currentUser.nom].filter(Boolean).join(' ') || t('profile.userFallback');
  const roleName = user?.role?.nom || '';

  const navItems = [
    { id: 'personal', label: t('profile.personal'), icon: FiUser },
    { id: 'password', label: t('profile.security'), icon: FiLock },
  ];

  if (!user) {
    return <PageLoader />;
  }

  return (
    <div className="profile-page">
      <div className="profile-layout">
        <aside className="profile-aside">
          <div className="profile-aside-card">
            <div className="profile-avatar-wrap">
              <img
                src={userAvatar}
                alt=""
                className="profile-avatar"
                width={96}
                height={96}
              />
              <h2 className="profile-user-name">{displayName}</h2>
              <p className="profile-user-role">{roleName}</p>
            </div>

            <nav className="profile-nav">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`profile-nav-btn ${activeTab === id ? 'profile-nav-btn--active' : ''}`}
                >
                  <Icon className="profile-nav-icon" />
                  {label}
                </button>
              ))}

              <button
                type="button"
                onClick={logout}
                className="profile-nav-btn profile-nav-btn--logout"
              >
                <FiLogOut className="profile-nav-icon" />
                {t('profile.logout')}
              </button>
            </nav>
          </div>
        </aside>

        <div className="profile-main">
          <form onSubmit={handleSubmit} className="profile-form-card">
            <div className="profile-form-inner">
            <h1 className="profile-form-title">
              {activeTab === 'personal' ? t('profile.personal') : t('profile.security')}
            </h1>

            {activeTab === 'personal' && (
              <>
                <div className="profile-field-row">
                  <div className="profile-field-half">
                    <label className="profile-label" htmlFor="nom">
                      {t('common.name')}
                    </label>
                    <input
                      id="nom"
                      onChange={handleChange}
                      type="text"
                      value={currentUser?.nom || ''}
                      name="nom"
                      className="profile-input"
                    />
                  </div>
                  <div className="profile-field-half">
                    <label className="profile-label" htmlFor="prenom">
                      {t('common.firstName')}
                    </label>
                    <input
                      id="prenom"
                      onChange={handleChange}
                      type="text"
                      value={currentUser?.prenom || ''}
                      name="prenom"
                      className="profile-input"
                    />
                  </div>
                </div>

                <div className="profile-field-group">
                  <label className="profile-label" htmlFor="role">
                    {t('common.role')}
                  </label>
                  <input
                    id="role"
                    type="text"
                    disabled
                    value={roleName}
                    className="profile-input profile-input--full profile-input--disabled"
                  />
                </div>

                <div className="profile-field-group">
                  <label className="profile-label" htmlFor="email">
                    {t('common.email')}
                  </label>
                  <div className="profile-email-wrap">
                    <input
                      id="email"
                      onChange={handleChange}
                      type="email"
                      value={currentUser?.email || ''}
                      name="email"
                      className="profile-input"
                    />
                    <span className="profile-verified-badge">
                      <FiCheckCircle style={{ width: 14, height: 14 }} />
                      {t('profile.verified')}
                    </span>
                  </div>
                </div>

                <div className="profile-field-group">
                  <label className="profile-label" htmlFor="phoneNum">
                    {t('common.phone')}
                  </label>
                  <input
                    id="phoneNum"
                    onChange={handleChange}
                    type="text"
                    value={currentUser?.phoneNum || ''}
                    name="phoneNum"
                    className="profile-input profile-input--full"
                  />
                </div>
              </>
            )}

            {activeTab === 'password' && (
              <>
                <p className="profile-hint">
                  {t('profile.passwordHint')}
                </p>

                <div className="profile-field-group">
                  <label className="profile-label" htmlFor="password">
                    {t('profile.newPassword')}
                  </label>
                  <div className="profile-password-wrap">
                    <input
                      id="password"
                      value={currentUser?.password || ''}
                      onChange={handleChange}
                      name="password"
                      type={showPassword.input1 ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="profile-input"
                    />
                    <button
                      type="button"
                      id="1"
                      onClick={handleClickShowPassword}
                      className="profile-toggle-pw"
                      aria-label={t('common.showPassword')}
                    >
                      {showPassword.input1 ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="profile-field-group">
                  <label className="profile-label" htmlFor="confirmPassword">
                    {t('profile.confirmPassword')}
                  </label>
                  <div className="profile-password-wrap">
                    <input
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type={showPassword.input2 ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="profile-input"
                    />
                    <button
                      type="button"
                      id="2"
                      onClick={handleClickShowPassword}
                      className="profile-toggle-pw"
                      aria-label={t('profile.showConfirm')}
                    >
                      {showPassword.input2 ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                    </button>
                  </div>
                  {error && <p className="profile-error">{error}</p>}
                </div>
              </>
            )}

            <div className="profile-actions">
              <button type="button" onClick={resetForm} className="profile-btn-discard">
                {t('profile.discard')}
              </button>
              <button type="submit" className="profile-btn-save">
                {t('profile.save')}
              </button>
            </div>
            </div>
          </form>
        </div>
      </div>

      <Snackbar open={openSuccess} autoHideDuration={4000} onClose={() => setOpenSuccess(false)}>
        <Alert onClose={() => setOpenSuccess(false)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar open={openError} autoHideDuration={4000} onClose={() => setOpenError(false)}>
        <Alert onClose={() => setOpenError(false)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Profile;
