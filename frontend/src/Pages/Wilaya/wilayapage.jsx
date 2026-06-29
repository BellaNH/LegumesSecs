import React, { useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useGlobalContext } from '../../context';
import { Snackbar, Alert } from '@mui/material';
import localisationIcon from '../pics/Localisation.png';
import ListPaginationFooter from '../../components/common/ListPaginationFooter';
import PageLoader from '../../components/common/PageLoader';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import '../../styles/ListPage.css';

const WilayasPage = () => {
  const [newWilaya, setNewWilaya] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const { user, fetchWilaya, setWilayas, url } = useGlobalContext();

  const {
    items: wilayaList,
    setItems: setWilayaList,
    totalCount,
    hasMore,
    loadedAll,
    loading,
    loadMore,
    loadAll,
    refresh,
  } = usePaginatedList(url, '/api/wilaya/');

  const getAuthHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const canManageActions =
    user?.role?.nom === 'admin' ||
    user?.permissions?.find((p) => p.model === 'Wilaya' && (p.update || p.delete));

  const canUpdate =
    user?.role?.nom === 'admin' ||
    user?.permissions?.find((p) => p.model === 'Wilaya' && p.update);

  const canDelete =
    user?.role?.nom === 'admin' ||
    user?.permissions?.find((p) => p.model === 'Wilaya' && p.delete);

  const syncContext = async () => {
    await refresh();
    fetchWilaya();
  };

  const addWilaya = async () => {
    if (!newWilaya.trim()) return;
    try {
      await axios.post(`${url}/api/wilaya/`, { nom: newWilaya.trim() }, getAuthHeader());
      setSuccessMessage('Wilaya ajoutée avec succès');
      setOpenSuccess(true);
      setNewWilaya('');
      syncContext();
    } catch {
      setErrorMessage("Erreur lors de l'ajout d'une wilaya");
      setOpenError(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/wilaya/${id}/`, getAuthHeader());
      setWilayaList(wilayaList.filter((w) => w.id !== id));
      setWilayas(wilayaList.filter((w) => w.id !== id));
      setSuccessMessage('Wilaya supprimée avec succès');
      setOpenSuccess(true);
      fetchWilaya();
    } catch {
      setErrorMessage('Erreur lors de la suppression.');
      setOpenError(true);
    }
  };

  const handleEdit = (wilaya) => {
    setEditingId(wilaya.id);
    setEditingName(wilaya.nom);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${url}/api/wilaya/${editingId}/`, { nom: editingName }, getAuthHeader());
      setSuccessMessage('Wilaya modifiée avec succès');
      setOpenSuccess(true);
      setEditingId(null);
      setEditingName('');
      syncContext();
    } catch {
      setErrorMessage('Erreur lors de la mise à jour');
      setOpenError(true);
    }
  };

  if (loading && wilayaList.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="list-page">
      <div className="list-page-layout">
        <div className="list-page-card">
          <div className="list-page-header">
            <div className="list-page-header-left">
              <img src={localisationIcon} alt="" className="list-page-header-icon" width={40} height={40} />
              <h1 className="list-page-title">Wilayas</h1>
            </div>
          </div>

          <div className="list-page-toolbar">
            <input
              type="text"
              placeholder="Nouvelle wilaya"
              value={newWilaya}
              onChange={(e) => setNewWilaya(e.target.value)}
              className="list-page-field-input"
            />
            <button type="button" onClick={addWilaya} className="list-page-btn-add">
              + Ajouter
            </button>
          </div>

          <div className="list-page-summary">
            <p className="list-page-summary-label">Wilayas enregistrées</p>
            <p className="list-page-summary-count">{totalCount} wilaya(s)</p>
          </div>

          {wilayaList.length === 0 && !loading ? (
            <p className="list-page-empty">Aucune wilaya disponible.</p>
          ) : (
            <div className="list-page-table-wrap">
              <table className="list-page-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    {canManageActions && <th className="list-page-th-actions">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {wilayaList.map((wilaya) => (
                    <tr key={wilaya.id}>
                      <td className="list-page-td-name">
                        {editingId === wilaya.id ? (
                          <input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="list-page-inline-input"
                          />
                        ) : (
                          wilaya.nom
                        )}
                      </td>
                      {canManageActions && (
                        <td className="list-page-td-actions">
                          <div className="list-page-actions">
                            {editingId === wilaya.id ? (
                              <button type="button" onClick={handleUpdate} className="list-page-btn-validate">
                                Valider
                              </button>
                            ) : (
                              <>
                                {canUpdate && (
                                  <button
                                    type="button"
                                    onClick={() => handleEdit(wilaya)}
                                    className="list-page-action-btn list-page-action-btn--edit"
                                    aria-label="Modifier"
                                  >
                                    <FaEdit />
                                  </button>
                                )}
                                {canDelete && (
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(wilaya.id)}
                                    className="list-page-action-btn list-page-action-btn--delete"
                                    aria-label="Supprimer"
                                  >
                                    <FaTrash />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <ListPaginationFooter
            displayed={wilayaList.length}
            totalCount={totalCount}
            hasMore={hasMore}
            loadedAll={loadedAll}
            loading={loading}
            onLoadMore={loadMore}
            onLoadAll={loadAll}
          />

          <div className="list-page-footer">
            <span className="list-page-footer-total">Total : {totalCount}</span>
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

export default WilayasPage;
