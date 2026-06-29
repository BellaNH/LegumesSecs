import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useGlobalContext } from '../../context';
import Slider from './PermissionSlider/Slider';
import userIcon from '../pics/User.png';
import PageLoader from '../../components/common/PageLoader';
import './AjouterUtilisateur.css';

const AjouterUtilisateur = () => {
  const {
    subdivisions,
    wilayas,
    roles,
    url,
    isDataLoading,
    setSliderStatus,
    setCurrentUserPermissions,
    defaultPermissions,
  } = useGlobalContext();

  useEffect(() => {
    setSliderStatus('create');
  }, [setSliderStatus]);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    phoneNum: '',
    password: '',
    role_id: '',
    permissions: '',
    wilaya: null,
    subdivision: null,
  });

  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedSubdivision, setSelectedSubdivision] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [showPermissionForm, setShowPermissionForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'wilaya') {
      setSelectedWilaya(value);
      setFormData((prev) => ({
        ...prev,
        subdivision: null,
        wilaya: value ? parseInt(value, 10) : null,
      }));
      return;
    }

    if (name === 'subdivision') {
      setSelectedSubdivision(value);
      setFormData((prev) => ({
        ...prev,
        wilaya: null,
        subdivision: value ? parseInt(value, 10) : null,
      }));
      return;
    }

    let processedValue = value;
    if (name === 'role_id' && value) {
      processedValue = parseInt(value, 10);
    } else if (name === 'phoneNum' && value) {
      processedValue = parseInt(value, 10);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const submitData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        role_id: formData.role_id ? parseInt(formData.role_id, 10) : formData.role_id,
        phoneNum: formData.phoneNum
          ? typeof formData.phoneNum === 'string'
            ? parseInt(formData.phoneNum, 10)
            : formData.phoneNum
          : null,
        wilaya: formData.wilaya
          ? typeof formData.wilaya === 'string'
            ? parseInt(formData.wilaya, 10)
            : formData.wilaya
          : null,
        subdivision: formData.subdivision
          ? typeof formData.subdivision === 'string'
            ? parseInt(formData.subdivision, 10)
            : formData.subdivision
          : null,
        permissions: Array.isArray(formData.permissions)
          ? formData.permissions
          : formData.permissions || [],
      };

      if (submitData.permissions === '' || submitData.permissions === null) {
        submitData.permissions = [];
      }

      await axios.post(`${url}/api/user/`, submitData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSuccessMessage(`${formData.nom} est ajouté avec succès`);
      setOpenSuccess(true);

      setFormData({
        nom: '',
        prenom: '',
        email: '',
        phoneNum: '',
        password: '',
        role_id: '',
        permissions: '',
        wilaya: null,
        subdivision: null,
      });
      setSelectedWilaya('');
      setSelectedSubdivision('');
      setCurrentUserPermissions(defaultPermissions);
    } catch (error) {
      const errorMsg =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.response?.data?.error?.details ||
        error.message ||
        "Erreur d'enregistrement.";

      setErrorMessage(errorMsg);
      setOpenError(true);
    }
  };

  if (isDataLoading) {
    return <PageLoader />;
  }

  return (
    <div className="add-user-page">
      <div className="add-user-layout">
        <div className="add-user-card">
          <form onSubmit={handleSubmit} className="add-user-form-inner">
            <div className="add-user-header">
              <img src={userIcon} alt="" className="add-user-header-icon" width={40} height={40} />
              <h1 className="add-user-title">Ajouter utilisateur</h1>
            </div>

            <div className="add-user-form-grid">
              {/* Left column — identity */}
              <div className="add-user-col">
                <div className="add-user-field-group">
                  <label className="add-user-label" htmlFor="nom">
                    Nom
                  </label>
                  <input
                    id="nom"
                    className="add-user-input"
                    value={formData.nom}
                    name="nom"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className="add-user-field-group">
                  <label className="add-user-label" htmlFor="prenom">
                    Prénom
                  </label>
                  <input
                    id="prenom"
                    className="add-user-input"
                    value={formData.prenom}
                    name="prenom"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className="add-user-field-group">
                  <label className="add-user-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    className="add-user-input"
                    value={formData.email}
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className="add-user-field-group">
                  <label className="add-user-label" htmlFor="password">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    className="add-user-input"
                    value={formData.password}
                    name="password"
                    type="password"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Right column — role & access */}
              <div className="add-user-col">
                <div className="add-user-field-group">
                  <label className="add-user-label" htmlFor="phoneNum">
                    Numéro de téléphone
                  </label>
                  <input
                    id="phoneNum"
                    className="add-user-input"
                    value={formData.phoneNum}
                    name="phoneNum"
                    type="tel"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className="add-user-field-group">
                  <label className="add-user-label" htmlFor="role_id">
                    Rôle
                  </label>
                  <select
                    id="role_id"
                    className="add-user-select"
                    name="role_id"
                    value={formData.role_id || ''}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Sélectionner un rôle
                    </option>
                    {Array.isArray(roles) &&
                      roles
                        .filter((role) => role.nom !== 'admin')
                        .map((role) => (
                          <option value={role.id} key={role.id}>
                            {role.nom}
                          </option>
                        ))}
                  </select>
                </div>

                <div className="add-user-field-group">
                  <label className="add-user-label">Permissions</label>
                  <button
                    type="button"
                    onClick={() => setShowPermissionForm(true)}
                    className="add-user-btn-permissions"
                  >
                    Gérer les permissions
                  </button>
                </div>

                {Number(formData.role_id) === 3 && (
                  <div className="add-user-field-group">
                    <label className="add-user-label" htmlFor="wilaya">
                      Wilaya
                    </label>
                    <select
                      id="wilaya"
                      name="wilaya"
                      className="add-user-select"
                      required
                      value={selectedWilaya}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Sélectionner une wilaya
                      </option>
                      {Array.isArray(wilayas) &&
                        wilayas.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.nom}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {Number(formData.role_id) === 4 && (
                  <div className="add-user-field-group">
                    <label className="add-user-label" htmlFor="subdivision">
                      Subdivision
                    </label>
                    <select
                      id="subdivision"
                      name="subdivision"
                      className="add-user-select"
                      required
                      value={selectedSubdivision}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Sélectionner une subdivision
                      </option>
                      {Array.isArray(subdivisions) &&
                        subdivisions.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.nom}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="add-user-actions">
              <button type="submit" className="add-user-btn-submit">
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>

      {showPermissionForm && (
        <div className="add-user-overlay">
          <Slider
            formData={formData}
            setFormData={setFormData}
            setShowPermissionForm={setShowPermissionForm}
          />
        </div>
      )}

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

export default AjouterUtilisateur;
