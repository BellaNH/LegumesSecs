import { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context';
import { useLanguage } from '../../i18n/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import FormPageLayout from '../../components/common/FormPageLayout';
import PageLoader from '../../components/common/PageLoader';

const FormAgriculteur = ({ setSelectedAgriId, selectedAgriId, setShowEditForm }) => {
  const { url, fetchAgriculteurs, isDataLoading } = useGlobalContext();
  const { t } = useLanguage();
  const [openForm, setOpenForm] = useState(true);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [editLoading, setEditLoading] = useState(Boolean(selectedAgriId));
  const [data, setData] = useState({
    nom: '',
    prenom: '',
    phoneNum: '',
    numero_carte_fellah: '',
  });

  const isEditMode = Boolean(selectedAgriId);

  useEffect(() => {
    const fetchAgri = async () => {
      if (!selectedAgriId) {
        setEditLoading(false);
        return;
      }
      setEditLoading(true);
      try {
        const response = await axios.get(`${url}/api/agriculteur/${selectedAgriId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setData({
          nom: response.data.nom,
          prenom: response.data.prenom,
          phoneNum: response.data.phoneNum,
          numero_carte_fellah: response.data.numero_carte_fellah,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération', error);
      } finally {
        setEditLoading(false);
      }
    };
    fetchAgri();
  }, [selectedAgriId, url]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const closeEditModal = () => {
    setOpenForm(false);
    setSelectedAgriId?.(null);
    setShowEditForm?.(false);
  };

  const handleModifyAgri = async (e) => {
    e.preventDefault();
    if (!selectedAgriId) return;
    try {
      await axios.patch(`${url}/api/agriculteur/${selectedAgriId}/`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchAgriculteurs();
      closeEditModal();
      setSuccessMessage(t('farmer.updated'));
      setOpenSuccess(true);
    } catch {
      setErrorMessage(t('farmer.updateError'));
      setOpenError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/api/agriculteur/`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchAgriculteurs();
      setSuccessMessage(t('farmer.added'));
      setOpenSuccess(true);
      navigate('/agriculteurs');
    } catch {
      setErrorMessage(t('farmer.createError'));
      setOpenError(true);
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      closeEditModal();
    } else {
      navigate('/agriculteurs');
    }
  };

  if (!openForm && isEditMode) return null;

  if (isDataLoading || editLoading) {
    return <PageLoader />;
  }

  const title = isEditMode ? t('farmer.editTitle') : t('farmer.addTitle');
  const subtitle = isEditMode ? t('farmer.editSubtitle') : t('farmer.addSubtitle');

  return (
    <>
      <FormPageLayout
        title={title}
        subtitle={subtitle}
        listLink="/agriculteurs"
        listLabel={t('farmer.viewList')}
        isModal={isEditMode}
      >
        <form
          className="form-page-form"
          onSubmit={isEditMode ? handleModifyAgri : handleSubmit}
        >
          <div className="form-page-fields-grid">
            <div className="form-page-field">
              <label className="form-page-label" htmlFor="nom">
                {t('common.name')}
              </label>
              <input
                id="nom"
                className="form-page-input"
                type="text"
                name="nom"
                value={data.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-page-field">
              <label className="form-page-label" htmlFor="prenom">
                {t('common.firstName')}
              </label>
              <input
                id="prenom"
                className="form-page-input"
                type="text"
                name="prenom"
                value={data.prenom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-page-field">
              <label className="form-page-label" htmlFor="phoneNum">
                {t('farmer.phone')}
              </label>
              <input
                id="phoneNum"
                className="form-page-input"
                type="text"
                name="phoneNum"
                value={data.phoneNum}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-page-field">
              <label className="form-page-label" htmlFor="numero_carte_fellah">
                {t('farmer.fellahNumber')}
              </label>
              <input
                id="numero_carte_fellah"
                className="form-page-input"
                type="text"
                name="numero_carte_fellah"
                value={data.numero_carte_fellah}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-page-actions">
            <button type="submit" className="form-page-btn-submit">
              {isEditMode ? t('common.edit') : t('common.add')}
            </button>
            <button type="button" className="form-page-btn-cancel" onClick={handleCancel}>
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </FormPageLayout>

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
    </>
  );
};

export default FormAgriculteur;
