import { useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useGlobalContext } from '../../context';
import FormObjectif from './FormObjectif';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import Cible from '../pics/CiblePic.png';
import ListPaginationFooter from '../../components/common/ListPaginationFooter';
import PageLoader from '../../components/common/PageLoader';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import '../../styles/ListPage.css';

const Objectifs = () => {
  const { url, fetchObjectifs } = useGlobalContext();
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedObjId, setSelectedObjId] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const {
    items: objectifs,
    setItems: setObjectifs,
    totalCount,
    hasMore,
    loadedAll,
    loading,
    loadMore,
    loadAll,
    refresh,
  } = usePaginatedList(url, '/api/objectif/');

  const handleModifyObjectif = (id) => {
    if (id) {
      setShowEditForm(true);
      setSelectedObjId(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/objectif/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccessMessage('Objectif supprimé avec succès');
      setOpenSuccess(true);
      setObjectifs(objectifs.filter((o) => o.id !== id));
      fetchObjectifs();
      refresh();
    } catch {
      setErrorMessage("Erreur lors de la suppression d'objectif");
      setOpenError(true);
    }
  };

  if (loading && objectifs.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="list-page">
      <div className="list-page-layout">
        <div className="list-page-card">
          <div className="list-page-header">
            <div className="list-page-header-left">
              <img src={Cible} alt="" className="list-page-header-icon" width={40} height={40} />
              <h1 className="list-page-title">Objectifs</h1>
            </div>
          </div>

          <div className="list-page-summary">
            <p className="list-page-summary-label">Objectifs enregistrés</p>
            <p className="list-page-summary-count">{totalCount} objectif(s)</p>
          </div>

          {objectifs.length === 0 && !loading ? (
            <p className="list-page-empty">Aucun objectif trouvé.</p>
          ) : (
            <div className="list-page-table-wrap">
              <table className="list-page-table">
                <thead>
                  <tr>
                    <th className="list-page-th-id">ID</th>
                    <th>Année</th>
                    <th>Wilaya</th>
                    <th>Espèce</th>
                    <th>Production</th>
                    <th className="list-page-th-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {objectifs.map((objectif) => (
                    <tr key={objectif.id}>
                      <td>{objectif.id}</td>
                      <td>{objectif.annee}</td>
                      <td>{objectif.wilaya?.nom ?? '—'}</td>
                      <td>{objectif.espece?.nom ?? '—'}</td>
                      <td>{objectif.objectif_production}</td>
                      <td className="list-page-td-actions">
                        <div className="list-page-actions">
                          <button
                            type="button"
                            onClick={() => handleModifyObjectif(objectif.id)}
                            className="list-page-action-btn list-page-action-btn--edit"
                            aria-label="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(objectif.id)}
                            className="list-page-action-btn list-page-action-btn--delete"
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

          <ListPaginationFooter
            displayed={objectifs.length}
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

      {showEditForm && (
        <FormObjectif
          setSelectedObjId={setSelectedObjId}
          selectedObjId={selectedObjId}
          setShowEditForm={setShowEditForm}
          onSuccess={() => {
            setSuccessMessage('Objectif modifié avec succès');
            setOpenSuccess(true);
            refresh();
            fetchObjectifs();
          }}
          onError={(msg) => {
            setErrorMessage(msg || 'Erreur lors de la mise à jour');
            setOpenError(true);
          }}
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

export default Objectifs;
