import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import { FaTrash, FaEdit } from 'react-icons/fa';
import userIcon from '../pics/User.png';
import PageLoader from '../../components/common/PageLoader';
import '../../styles/ListPage.css';

const Utilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url, user } = useGlobalContext();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const list = Array.isArray(response.data) ? response.data : response.data?.results ?? [];
      setUsers(list.filter((u) => u.role?.nom !== 'admin'));
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs :', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');
    if (!userId) return;
    try {
      await axios.delete(`${url}/api/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('Utilisateur supprimé avec succès');
      setOpenSuccess(true);
      fetchUsers();
    } catch {
      setErrorMessage('Erreur lors de la suppression.');
      setOpenError(true);
    }
  };

  const handleEditClick = (targetUser) => {
    navigate(`/modifier-utilisateur/${targetUser.id}`);
  };

  const filteredUsers = user ? users.filter((u) => u.email !== user.email) : users;

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="list-page">
      <div className="list-page-layout">
        <div className="list-page-card">
          <div className="list-page-header">
            <div className="list-page-header-left">
              <img src={userIcon} alt="" className="list-page-header-icon" width={40} height={40} />
              <h1 className="list-page-title">Liste des utilisateurs</h1>
            </div>
            <button
              type="button"
              className="list-page-btn-add"
              onClick={() => navigate('/ajouter-utilisateur')}
            >
              + Ajouter utilisateur
            </button>
          </div>

          <div className="list-page-summary">
            <p className="list-page-summary-label">Utilisateurs enregistrés</p>
            <p className="list-page-summary-count">{filteredUsers.length} utilisateur(s)</p>
          </div>

          {filteredUsers.length === 0 ? (
            <p className="list-page-empty">Aucun utilisateur trouvé.</p>
          ) : (
            <div className="list-page-table-wrap">
              <table className="list-page-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th className="list-page-th-id">Téléphone</th>
                    <th className="list-page-th-id">Rôle</th>
                    <th className="list-page-th-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((row) => (
                    <tr key={row.id}>
                      <td className="list-page-td-name">{row.nom}</td>
                      <td>{row.prenom}</td>
                      <td>{row.email}</td>
                      <td>{row.phoneNum ?? '—'}</td>
                      <td style={{ textTransform: 'capitalize' }}>{row.role?.nom ?? '—'}</td>
                      <td className="list-page-td-actions">
                        <div className="list-page-actions">
                          <button
                            type="button"
                            className="list-page-action-btn list-page-action-btn--edit"
                            onClick={() => handleEditClick(row)}
                            aria-label="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            className="list-page-action-btn list-page-action-btn--delete"
                            onClick={() => handleDelete(row.id)}
                            aria-label="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="list-page-footer">
            <span className="list-page-footer-total">Total : {filteredUsers.length}</span>
          </div>
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

export default Utilisateurs;
