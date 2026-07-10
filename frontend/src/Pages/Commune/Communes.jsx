import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { useGlobalContext } from '../../context';
import { useLanguage } from '../../i18n/LanguageContext';
import { Snackbar, Alert } from '@mui/material';
import localisationIcon from '../pics/Localisation.png';
import ListPaginationFooter from '../../components/common/ListPaginationFooter';
import PageLoader from '../../components/common/PageLoader';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import '../../styles/ListPage.css';

const Commune = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { url, fetchCommunes } = useGlobalContext();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editedCommuneName, setEditedCommuneName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [communeInfos, setCommuneInfos] = useState({
    nom: '',
    subdiv_id: '',
  });

  const {
    items: communes,
    setItems: setCommunes,
    totalCount,
    hasMore,
    loadedAll,
    loading,
    loadMore,
    loadAll,
    refresh,
  } = usePaginatedList(url, '/api/commune/');

  const filterCommunes = communes.filter((com) =>
    com.nom?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/commune/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccessMessage(t('commune.deleted'));
      setOpenSuccess(true);
      setCommunes(communes.filter((c) => c.id !== id));
      fetchCommunes();
    } catch {
      setErrorMessage(t('commune.deleteError'));
      setOpenError(true);
    }
  };

  const handleEdit = (commune) => {
    setEditingId(commune.id);
    setEditedCommuneName(commune.nom);
    setCommuneInfos({
      nom: commune.nom,
      subdiv_id: commune.subdivision?.id || '',
    });
  };

  const handleChange = (newName) => {
    setEditedCommuneName(newName);
    setCommuneInfos((prev) => ({
      ...prev,
      nom: newName,
    }));
  };

  const handleUpdate = async (communeId) => {
    const payload = { nom: communeInfos.nom };
    if (communeInfos.subdiv_id) {
      payload.subdiv_id = communeInfos.subdiv_id;
    }

    try {
      await axios.patch(`${url}/api/commune/${communeId}/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccessMessage(t('commune.updated'));
      setOpenSuccess(true);
      setEditingId(null);
      setEditedCommuneName('');
      refresh();
      fetchCommunes();
    } catch {
      setErrorMessage(t('commune.updateError'));
      setOpenError(true);
    }
  };

  if (loading && communes.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="list-page">
      <div className="list-page-layout">
        <div className="list-page-card">
          <div className="list-page-header">
            <div className="list-page-header-left">
              <img src={localisationIcon} alt="" className="list-page-header-icon" width={40} height={40} />
              <h1 className="list-page-title">{t('commune.title')}</h1>
            </div>
            <button
              type="button"
              className="list-page-btn-add"
              onClick={() => navigate('/ajouter-commune')}
            >
              {t('commune.addBtn')}
            </button>
          </div>

          <div className="list-page-toolbar">
            <div className="list-page-search-wrap">
              <FiSearch className="list-page-search-icon" />
              <input
                type="text"
                placeholder={t('commune.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="list-page-search-input"
              />
            </div>
          </div>

          <div className="list-page-summary">
            <p className="list-page-summary-label">{t('commune.recorded')}</p>
            <p className="list-page-summary-count">{t('commune.count', { n: totalCount })}</p>
          </div>

          {filterCommunes.length === 0 && !loading ? (
            <p className="list-page-empty">{t('commune.empty')}</p>
          ) : (
            <div className="list-page-table-wrap">
              <table className="list-page-table">
                <thead>
                  <tr>
                    <th className="list-page-th-id">{t('common.id')}</th>
                    <th>{t('common.name')}</th>
                    <th>{t('nav.subdivision')}</th>
                    <th className="list-page-th-actions">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filterCommunes.map((com) => (
                    <tr key={com.id}>
                      <td>{com.id}</td>
                      <td className="list-page-td-name">
                        {editingId === com.id ? (
                          <input
                            value={editedCommuneName}
                            onChange={(e) => handleChange(e.target.value)}
                            className="list-page-inline-input"
                          />
                        ) : (
                          com.nom
                        )}
                      </td>
                      <td>{com.subdivision?.nom ?? '—'}</td>
                      <td className="list-page-td-actions">
                        <div className="list-page-actions">
                          {editingId === com.id ? (
                            <button
                              type="button"
                              onClick={() => handleUpdate(com.id)}
                              className="list-page-btn-validate"
                            >
                              {t('common.confirm')}
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEdit(com)}
                                className="list-page-action-btn list-page-action-btn--edit"
                                aria-label={t('common.edit')}
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(com.id)}
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

          <ListPaginationFooter
            displayed={communes.length}
            totalCount={totalCount}
            hasMore={hasMore}
            loadedAll={loadedAll}
            loading={loading}
            onLoadMore={loadMore}
            onLoadAll={loadAll}
          />

          <div className="list-page-footer">
            <span className="list-page-footer-total">{t('common.total')} : {totalCount}</span>
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

export default Commune;
