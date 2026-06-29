import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import FormPageLayout from '../../components/common/FormPageLayout';
import PageLoader from '../../components/common/PageLoader';

const FormObjectif = ({ setSelectedObjId, selectedObjId, setShowEditForm, onSuccess, onError }) => {
  const { wilayas, especes, url, fetchObjectifs, isDataLoading } = useGlobalContext();
  const [openForm, setOpenForm] = useState(true);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [editLoading, setEditLoading] = useState(Boolean(selectedObjId));
  const [data, setData] = useState({
    annee: '',
    wilaya_id: '',
    espece_id: '',
    objectif_production: '',
  });

  const isEditMode = Boolean(selectedObjId);

  useEffect(() => {
    const fetchObjectif = async () => {
      if (!selectedObjId) {
        setEditLoading(false);
        return;
      }
      setEditLoading(true);
      try {
        const response = await axios.get(`${url}/api/objectif/${selectedObjId}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setData({
          annee: response.data.annee,
          wilaya_id: response.data.wilaya.id,
          espece_id: response.data.espece.id,
          objectif_production: response.data.objectif_production,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération de l'objectif :", error);
      } finally {
        setEditLoading(false);
      }
    };
    fetchObjectif();
  }, [selectedObjId, url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const closeEditModal = () => {
    setOpenForm(false);
    setSelectedObjId?.(null);
    setShowEditForm?.(false);
  };

  const handleModifyObj = async (e) => {
    e.preventDefault();
    if (!selectedObjId) return;
    try {
      await axios.patch(`${url}/api/objectif/${selectedObjId}/`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchObjectifs();
      closeEditModal();
      onSuccess?.();
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        (typeof error?.response?.data === 'string' ? error.response.data : 'Erreur lors de la mise à jour');
      if (onError) onError(msg);
      else {
        setErrorMessage(msg);
        setOpenError(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/api/objectif/`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccessMessage('Objectif ajouté avec succès');
      setOpenSuccess(true);
      await fetchObjectifs();
      navigate('/objectifs');
    } catch {
      setErrorMessage('Erreur lors de la création');
      setOpenError(true);
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      closeEditModal();
    } else {
      navigate('/objectifs');
    }
  };

  if (!openForm && isEditMode) return null;

  if (isDataLoading || editLoading) {
    return <PageLoader />;
  }

  const title = isEditMode ? "Modifier l'objectif" : 'Ajouter un objectif';
  const subtitle = isEditMode
    ? 'Mettez à jour les informations de cet objectif de production.'
    : 'Renseignez les détails pour définir un nouvel objectif de production.';

  return (
    <>
      <FormPageLayout
        title={title}
        subtitle={subtitle}
        listLink="/objectifs"
        listLabel="Voir les objectifs"
        isModal={isEditMode}
      >
        <form
          className="form-page-form"
          onSubmit={isEditMode ? handleModifyObj : handleSubmit}
        >
          <div className="form-page-fields-grid">
            <div className="form-page-field">
              <label className="form-page-label" htmlFor="annee">
                Année
              </label>
              <input
                id="annee"
                className="form-page-input"
                type="text"
                name="annee"
                value={data.annee}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-page-field">
              <label className="form-page-label" htmlFor="wilaya_id">
                Wilaya
              </label>
              <select
                id="wilaya_id"
                className="form-page-select"
                name="wilaya_id"
                value={data.wilaya_id}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner</option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya.id} value={wilaya.id}>
                    {wilaya.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-page-field">
              <label className="form-page-label" htmlFor="espece_id">
                Espèce
              </label>
              <select
                id="espece_id"
                className="form-page-select"
                name="espece_id"
                value={data.espece_id}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner</option>
                {especes.map((espece) => (
                  <option key={espece.id} value={espece.id}>
                    {espece.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-page-field">
              <label className="form-page-label" htmlFor="objectif_production">
                Objectif de production
              </label>
              <input
                id="objectif_production"
                className="form-page-input"
                type="text"
                name="objectif_production"
                value={data.objectif_production}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-page-actions">
            <button type="submit" className="form-page-btn-submit">
              {isEditMode ? 'Modifier' : 'Ajouter'}
            </button>
            <button type="button" className="form-page-btn-cancel" onClick={handleCancel}>
              Annuler
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

export default FormObjectif;
