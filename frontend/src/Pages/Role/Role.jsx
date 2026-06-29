import React, { useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useGlobalContext } from '../../context';
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
      setSuccessMessage('Rôle ajouté avec succès');
      setOpenSuccess(true);
      setNewRole('');
      fetchRoles();
    } catch {
      setErrorMessage("Erreur d'enregistrement.");
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
      setSuccessMessage('Rôle supprimé avec succès');
      setOpenSuccess(true);
      fetchRoles();
    } catch {
      setErrorMessage('Erreur lors de la suppression');
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
      setSuccessMessage('Rôle modifié avec succès');
      setOpenSuccess(true);
      setEditingId(null);
      setEditingName('');
      fetchRoles();
    } catch {
      setErrorMessage('Erreur lors de la modification');
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
              <h1 className="list-page-title">Rôles</h1>
            </div>
          </div>

          <div className="list-page-toolbar">
            <input
              type="text"
              placeholder="Nouveau rôle"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="list-page-field-input"
            />
            <button type="button" onClick={handleAdd} className="list-page-btn-add">
              + Ajouter
            </button>
          </div>

          <div className="list-page-summary">
            <p className="list-page-summary-label">Rôles enregistrés</p>
            <p className="list-page-summary-count">{roleList.length} rôle(s)</p>
          </div>

          {roleList.length === 0 ? (
            <p className="list-page-empty">Aucun rôle disponible.</p>
          ) : (
            <div className="list-page-table-wrap">
              <table className="list-page-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th className="list-page-th-actions">Actions</th>
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
                              Valider
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEdit(role)}
                                className="list-page-action-btn list-page-action-btn--edit"
                                aria-label="Modifier"
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(role.id)}
                                className="list-page-action-btn list-page-action-btn--delete"
                                aria-label="Supprimer"
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
            <span className="list-page-footer-total">Total : {roleList.length}</span>
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
