import { useMemo, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { Snackbar, Alert } from '@mui/material';
import { useGlobalContext } from '../../../context';
import { useLanguage } from '../../../i18n/LanguageContext';
import './PermissionSlider.css';

const CRUD_KEYS = ['retrieve', 'create', 'update', 'destroy'];

function Slider({ setFormData, setShowPermissionForm }) {
  const {
    currentUserPermissions,
    setCurrentUserPermissions,
    defaultPermissions,
  } = useGlobalContext();
  const { t } = useLanguage();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const crudOptions = useMemo(
    () => [
      { key: 'retrieve', label: t('permissions.read') },
      { key: 'create', label: t('permissions.create') },
      { key: 'update', label: t('permissions.update') },
      { key: 'destroy', label: t('permissions.destroy') },
    ],
    [t]
  );

  const selectedCount = useMemo(() => {
    if (!Array.isArray(currentUserPermissions)) return 0;
    return currentUserPermissions.reduce((total, perm) => {
      return total + CRUD_KEYS.filter((key) => perm[key]).length;
    }, 0);
  }, [currentUserPermissions]);

  const handleChange = (e, modelName) => {
    const { name, checked } = e.target;
    setCurrentUserPermissions((prev) =>
      prev.map((perm) =>
        perm.model === modelName ? { ...perm, [name]: checked } : perm
      )
    );
  };

  const handleClose = () => {
    setShowPermissionForm(false);
  };

  const handleSubmitPermissions = () => {
    if (
      JSON.stringify(currentUserPermissions) ===
      JSON.stringify(defaultPermissions)
    ) {
      setErrorMessage(t('permissions.mustSelect'));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      permissions: currentUserPermissions,
    }));
    setSuccessMessage(t('permissions.saved'));
    setTimeout(() => {
      setShowPermissionForm(false);
    }, 900);
  };

  const modelActiveCount = (perm) =>
    CRUD_KEYS.filter((key) => perm[key]).length;

  const activeCountLabel =
    selectedCount === 1
      ? t('permissions.activeCount', { count: selectedCount })
      : t('permissions.activeCount_plural', { count: selectedCount });

  return (
    <div
      className="perm-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="perm-modal-title"
    >
      <header className="perm-modal-header">
        <div className="perm-modal-header-text">
          <span className="perm-modal-eyebrow">{t('permissions.eyebrow')}</span>
          <h2 id="perm-modal-title" className="perm-modal-title">
            {t('permissions.title')}
          </h2>
          <p className="perm-modal-subtitle">
            {t('permissions.subtitle')}
          </p>
        </div>
        <button
          type="button"
          className="perm-modal-close"
          onClick={handleClose}
          aria-label={t('common.close')}
        >
          <IoClose size={20} />
        </button>
      </header>

      <div className="perm-modal-body">
        <div className="perm-modal-summary">
          <p className="perm-modal-summary-label">
            {t('permissions.summary')}
          </p>
          <span className="perm-modal-summary-count">
            {activeCountLabel}
          </span>
        </div>

        <div className="perm-grid">
          {Array.isArray(currentUserPermissions) &&
            currentUserPermissions.map((perm) => {
              const active = modelActiveCount(perm);
              return (
                <article
                  key={perm.model}
                  className={`perm-card${active > 0 ? ' perm-card--active' : ''}`}
                >
                  <div className="perm-card-top">
                    <h3 className="perm-card-model">{perm.model}</h3>
                    <span className="perm-card-badge">
                      {active}/4
                    </span>
                  </div>
                  <div className="perm-card-actions">
                    {crudOptions.map((opt) => (
                      <label key={opt.key} className="perm-check">
                        <input
                          type="checkbox"
                          name={opt.key}
                          checked={Boolean(perm[opt.key])}
                          onChange={(e) => handleChange(e, perm.model)}
                        />
                        <span className="perm-check-label">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </article>
              );
            })}
        </div>
      </div>

      <footer className="perm-modal-footer">
        <button
          type="button"
          className="perm-btn perm-btn--ghost"
          onClick={handleClose}
        >
          {t('common.cancel')}
        </button>
        <button
          type="button"
          className="perm-btn perm-btn--primary"
          onClick={handleSubmitPermissions}
        >
          {t('permissions.save')}
        </button>
      </footer>

      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={4000}
        onClose={() => setErrorMessage('')}
      >
        <Alert
          onClose={() => setErrorMessage('')}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Slider;
