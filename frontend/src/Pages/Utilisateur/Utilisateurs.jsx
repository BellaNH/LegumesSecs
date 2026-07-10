import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../../context';
import { useLanguage } from '../../i18n/LanguageContext';
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
  const { t } = useLanguage();
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
      setSuccessMessage(t('user.deleted'));
      setOpenSuccess(true);
      fetchUsers();
    } catch {
      setErrorMessage(t('user.deleteError'));
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
              <h1 className="list-page-title">{t('user.listTitle')}</h1>
            </div>
            <button
              type="button"
              className="list-page-btn-add"
              onClick={() => navigate('/ajouter-utilisateur')}
            >
              {t('user.addBtn')}
            </button>
          </div>

          <div className="list-page-summary">
            <p className="list-page-summary-label">{t('user.recorded')}</p>
            <p className="list-page-summary-count">{t('user.count', { n: filteredUsers.length })}</p>
          </div>

          {filteredUsers.length === 0 ? (
            <p className="list-page-empty">{t('user.empty')}</p>
          ) : (
            <div className="list-page-table-wrap">
              <table className="list-page-table">
                <thead>
                  <tr>
                    <th>{t('common.name')}</th>
                    <th>{t('common.firstName')}</th>
                    <th>{t('common.email')}</th>
                    <th className="list-page-th-id">{t('common.phone')}</th>
                    <th className="list-page-th-id">{t('common.role')}</th>
                    <th className="list-page-th-actions">{t('common.actions')}</th>
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
                            aria-label={t('common.edit')}
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            className="list-page-action-btn list-page-action-btn--delete"
                            onClick={() => handleDelete(row.id)}
                            aria-label={t('common.delete')}
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
            <span className="list-page-footer-total">{t('common.total')} : {filteredUsers.length}</span>
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
