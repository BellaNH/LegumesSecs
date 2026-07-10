import React, { useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useGlobalContext } from '../../context';
import { useLanguage } from '../../i18n/LanguageContext';
import { Snackbar, Alert } from '@mui/material';
import userIcon from '../pics/User.png';
import PageLoader from '../../components/common/PageLoader';
import '../../styles/ListPage.css';

const Role = () => {
  const [newRole, setNewRole] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const { roles, url, fetchRoles, isDataLoading } = useGlobalContext();
  const { t } = useLanguage();

  const handleAdd = async () => {
    if (!newRole.trim()) return;
    try {
      await axios.post(
        `${url}/api/role/`,
        { nom: newRole.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSuccessMessage(t('role.added'));
      setOpenSuccess(true);
      setNewRole('');
      fetchRoles();
    } catch {
      setErrorMessage(t('role.saveError'));
      setOpenError(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/role/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccessMessage(t('role.deleted'));
      setOpenSuccess(true);
      fetchRoles();
    } catch {
      setErrorMessage(t('role.deleteError'));
      setOpenError(true);
    }
  };

  const handleEdit = (role) => {
    setEditingId(role.id);
    setEditingName(role.nom);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${url}/api/role/${editingId}/`,
        { nom: editingName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSuccessMessage(t('role.updated'));
      setOpenSuccess(true);
      setEditingId(null);
      setEditingName('');
      fetchRoles();
    } catch {
      setErrorMessage(t('role.updateError'));
      setOpenError(true);
    }
  };

  const roleList = Array.isArray(roles) ? roles : [];

  if (isDataLoading) {
    return <PageLoader />;
  }

  return (
    <div className="list-page">
      <div className="list-page-layout">
        <div className="list-page-card">
          <div className="list-page-header">
            <div className="list-page-header-left">
              <img src={userIcon} alt="" className="list-page-header-icon" width={40} height={40} />
              <h1 className="list-page-title">{t('role.title')}</h1>
            </div>
          </div>

          <div className="list-page-toolbar">
            <input
              type="text"
              placeholder={t('role.new')}
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="list-page-field-input"
            />
            <button type="button" onClick={handleAdd} className="list-page-btn-add">
              + {t('common.add')}
            </button>
          </div>

          <div className="list-page-summary">
            <p className="list-page-summary-label">{t('role.recorded')}</p>
            <p className="list-page-summary-count">{t('role.count', { n: roleList.length })}</p>
          </div>

          {roleList.length === 0 ? (
            <p className="list-page-empty">{t('role.empty')}</p>
          ) : (
            <div className="list-page-table-wrap">
              <table className="list-page-table">
                <thead>
                  <tr>
                    <th>{t('common.name')}</th>
                    <th className="list-page-th-actions">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {roleList.map((role) => (
                    <tr key={role.id}>
                      <td className="list-page-td-name">
                        {editingId === role.id ? (
                          <input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="list-page-inline-input"
                          />
                        ) : (
                          role.nom
                        )}
                      </td>
                      <td className="list-page-td-actions">
                        <div className="list-page-actions">
                          {editingId === role.id ? (
                            <button type="button" onClick={handleUpdate} className="list-page-btn-validate">
                              {t('common.confirm')}
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEdit(role)}
                                className="list-page-action-btn list-page-action-btn--edit"
                                aria-label={t('common.edit')}
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(role.id)}
                                className="list-page-action-btn list-page-action-btn--delete"
                                aria-label={t('common.delete')}
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="list-page-footer">
            <span className="list-page-footer-total">{t('common.total')} : {roleList.length}</span>
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

export default Role;
