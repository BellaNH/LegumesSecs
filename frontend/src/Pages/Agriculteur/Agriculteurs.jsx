import { useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useGlobalContext } from '../../context';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormAgriculteur from './FormAgriculteur';
import Agriculteur from '../pics/Agriculteur.png';
import { Snackbar, Alert } from '@mui/material';
import PageLoader from '../../components/common/PageLoader';
import '../../styles/ListPage.css';

const Agriculteurs = () => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedAgriId, setSelectedAgriId] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const {
    url,
    user,
    isDataLoading,
    fetchAgriculteurs,
    setSelectedExploi,
    agriculteurs,
    setAgriculteurs,
    selectedAgriculteur,
    wilayas,
    subdivisions,
    communes,
  } = useGlobalContext();

  const [openedAgriculteurId, setOpenedAgriculteurId] = useState(null);
  const [targetWilaya, setTargetWilaya] = useState('');
  const [targetCommune, setTargetCommune] = useState('');
  const [targetSubdiv, setTargetSubdiv] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedSubdiv, setSelectedSubdiv] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [filteredSubdiv, setFilteredSubdiv] = useState([]);
  const [filteredCommune, setFilteredCommune] = useState([]);

  const navigate = useNavigate();

  const currentWilaya = openedAgriculteurId ? targetWilaya : selectedWilaya;
  const currentSubdiv = openedAgriculteurId ? targetSubdiv : selectedSubdiv;
  const currentCommune = openedAgriculteurId ? targetCommune : selectedCommune;

  const handleSelectExploi = (id, e) => {
    e.stopPropagation();
    if (id) {
      setSelectedExploi(id);
      navigate('/exploitations');
    }
  };

  const handleModifyAgri = (id, e) => {
    e.stopPropagation();
    if (id) {
      setShowEditForm(true);
      setSelectedAgriId(id);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${url}/api/agriculteur/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccessMessage('Agriculteur supprimé avec succès');
      setOpenSuccess(true);
      fetchAgriculteurs();
    } catch {
      setErrorMessage("Erreur lors de la suppression d'agriculteur");
      setOpenError(true);
    }
  };

  const fetchFilteredAgri = async (wilaya = null, subdivision = null, commune = null) => {
    try {
      const response = await axios.get(`${url}/api/agriculteur-filter/`, {
        params: { wilaya, subdivision, commune },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAgriculteurs(response.data);
    } catch {
      // Error handled by interceptor
    }
  };

  const filterSubdivByWilaya = async (wilayaId) => {
    if (!wilayaId) return;
    try {
      const response = await axios.get(`${url}/api/filterSubdivBywilaya/?wilaya=${wilayaId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFilteredSubdiv(response.data);
    } catch {
      // Error handled by interceptor
    }
  };

  const filterCommuneByWilaya = async (wilayaId) => {
    if (!wilayaId) return;
    try {
      const response = await axios.get(`${url}/api/filterCommuneBywilaya/?wilaya=${wilayaId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFilteredCommune(response.data);
    } catch {
      // Error handled by interceptor
    }
  };

  const filterCommuneBySubdiv = async (subdivId) => {
    if (!subdivId) return;
    try {
      const response = await axios.get(`${url}/api/filterCommuneBySubdiv/?subdivision=${subdivId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFilteredCommune(response.data);
    } catch {
      // Error handled by interceptor
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'wilaya') {
      setSelectedWilaya(value || '');
      filterSubdivByWilaya(value);
      filterCommuneByWilaya(value);
      fetchFilteredAgri(value);
    }
    if (name === 'subdiv') {
      setSelectedSubdiv(value || '');
      filterCommuneBySubdiv(value);
      fetchFilteredAgri(selectedWilaya, value, selectedCommune);
    }
    if (name === 'commune') {
      setSelectedCommune(value || '');
      fetchFilteredAgri(selectedWilaya, selectedSubdiv, value);
    }
  };

  const showAgriLocation = (agri) => {
    if (openedAgriculteurId === agri.id) {
      setOpenedAgriculteurId(null);
    } else {
      setOpenedAgriculteurId(agri.id);
      setTargetWilaya(agri?.wilaya?.id ?? '');
      setTargetCommune(agri?.commune?.id ?? '');
      setTargetSubdiv(agri?.subdivision?.id ?? '');
    }
  };

  const wilayaValue =
    user?.role?.nom === 'agent_dsa' || user?.role?.nom === 'agent_subdivision'
      ? user.wilaya?.id ?? ''
      : currentWilaya;

  const subdivValue =
    user?.role?.nom === 'agent_subdivision' ? user.subdivision?.id ?? '' : currentSubdiv;

  const subdivOptions =
    !openedAgriculteurId && filteredSubdiv.length > 0 ? filteredSubdiv : subdivisions;

  const communeOptions =
    !openedAgriculteurId && filteredCommune.length > 0 ? filteredCommune : communes;

  if (isDataLoading) {
    return <PageLoader />;
  }

  return (
    <div className="list-page">
      <div className="list-page-layout">
        <div className="list-page-card">
          <div className="list-page-header">
            <div className="list-page-header-left">
              <img src={Agriculteur} alt="" className="list-page-header-icon" width={40} height={40} />
              <h1 className="list-page-title">Agriculteurs</h1>
            </div>
          </div>

          <p className="list-page-summary-label" style={{ marginBottom: '12px' }}>
            {openedAgriculteurId ? 'Localisation' : 'Filtrage par localisation'}
          </p>

          <div className="list-page-filters">
            <div className="list-page-filter-field">
              <label className="list-page-filter-label" htmlFor="filter-wilaya">
                Wilaya
              </label>
              <select
                id="filter-wilaya"
                name="wilaya"
                className="list-page-filter-select"
                disabled={!!openedAgriculteurId}
                onChange={onChange}
                value={wilayaValue}
              >
                <option value="">—</option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya.id} value={wilaya.id}>
                    {wilaya.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="list-page-filter-field">
              <label className="list-page-filter-label" htmlFor="filter-subdiv">
                Subdivision
              </label>
              <select
                id="filter-subdiv"
                name="subdiv"
                className="list-page-filter-select"
                disabled={!!openedAgriculteurId}
                onChange={onChange}
                value={subdivValue}
              >
                <option value="">—</option>
                {subdivOptions.map((subdiv) => (
                  <option key={subdiv.id} value={subdiv.id}>
                    {subdiv.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className="list-page-filter-field">
              <label className="list-page-filter-label" htmlFor="filter-commune">
                Commune
              </label>
              <select
                id="filter-commune"
                name="commune"
                className="list-page-filter-select"
                disabled={!!openedAgriculteurId}
                onChange={onChange}
                value={currentCommune}
              >
                <option value="">—</option>
                {communeOptions.map((commune) => (
                  <option key={commune.id} value={commune.id}>
                    {commune.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="list-page-summary">
            <p className="list-page-summary-label">Agriculteurs enregistrés</p>
            <p className="list-page-summary-count">{agriculteurs?.length ?? 0} agriculteur(s)</p>
          </div>

          {!agriculteurs || agriculteurs.length === 0 ? (
            <p className="list-page-empty">Aucun agriculteur trouvé.</p>
          ) : (
            <div className="list-page-table-wrap">
              <table className="list-page-table">
                <thead>
                  <tr>
                    <th className="list-page-th-id">ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Téléphone</th>
                    <th>Carte Fellah</th>
                    <th>Exploitation</th>
                    <th className="list-page-th-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agriculteurs.map((agri) => {
                    const isSelected =
                      agri.exploitation &&
                      agri.exploitation.length > 0 &&
                      agri.exploitation.id === selectedAgriculteur;

                    return (
                      <tr
                        key={agri.id}
                        className={`list-page-table-row--clickable${isSelected ? ' list-page-table-row--selected' : ''}`}
                        onClick={() => showAgriLocation(agri)}
                      >
                        <td>{agri.id}</td>
                        <td className="list-page-td-name">{agri.nom}</td>
                        <td>{agri.prenom}</td>
                        <td>{agri.phoneNum}</td>
                        <td>{agri.numero_carte_fellah}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          {agri.exploitation ? (
                            <Link
                              to="/exploitations"
                              onClick={(e) => handleSelectExploi(agri.id, e)}
                              className="list-page-link"
                            >
                              {agri.exploitation?.nom}
                            </Link>
                          ) : (
                            <span style={{ color: '#dc2626', fontWeight: 600 }}>—</span>
                          )}
                        </td>
                        <td className="list-page-td-actions" onClick={(e) => e.stopPropagation()}>
                          <div className="list-page-actions">
                            <button
                              type="button"
                              onClick={(e) => handleModifyAgri(agri.id, e)}
                              className="list-page-action-btn list-page-action-btn--edit"
                              aria-label="Modifier"
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDelete(agri.id, e)}
                              className="list-page-action-btn list-page-action-btn--delete"
                              aria-label="Supprimer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="list-page-footer">
            <span className="list-page-footer-total">Total : {agriculteurs?.length ?? 0}</span>
          </div>
        </div>
      </div>

      {showEditForm && (
        <FormAgriculteur
          setSelectedAgriId={setSelectedAgriId}
          selectedAgriId={selectedAgriId}
          setShowEditForm={setShowEditForm}
        />
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

export default Agriculteurs;
