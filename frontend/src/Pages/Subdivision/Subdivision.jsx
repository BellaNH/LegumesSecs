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

const SubdivisionManager = () => {
  const { url } = useGlobalContext();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editedSubdivName, setEditedSubdivName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const {
    items: subdivisions,
    setItems: setSubdivisions,
    totalCount,
    hasMore,
    loadedAll,
    loading,
    loadMore,
    loadAll,
    refresh,
  } = usePaginatedList(url, '/api/subdivision/');

  const filteredSubdivisions = subdivisions.filter((sub) =>
    sub.nom?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (subdivision) => {
    setEditingId(subdivision.id);
    setEditedSubdivName(subdivision.nom);
  };

  const handleUpdate = async (wilayaId) => {
    if (!editingId || !wilayaId) return;
    try {
      await axios.put(
        `${url}/api/subdivision/${editingId}/`,
        { nom: editedSubdivName, wilaya_id: wilayaId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSuccessMessage(t('subdivision.updated'));
      setOpenSuccess(true);
      setEditingId(null);
      setEditedSubdivName('');
      refresh();
    } catch {
      setErrorMessage(t('subdivision.updateError'));
      setOpenError(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/subdivision/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccessMessage(t('subdivision.deleted'));
      setOpenSuccess(true);
      setSubdivisions(subdivisions.filter((s) => s.id !== id));
    } catch {
      setErrorMessage(t('subdivision.deleteError'));
      setOpenError(true);
    }
  };

  if (loading && subdivisions.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="list-page">
      <div className="list-page-layout">
        <div className="list-page-card">
          <div className="list-page-header">
            <div className="list-page-header-left">
              <img src={localisationIcon} alt="" className="list-page-header-icon" width={40} height={40} />
              <h1 className="list-page-title">{t('subdivision.title')}</h1>
            </div>
            <button
              type="button"
              className="list-page-btn-add"
              onClick={() => navigate('/ajouter-subdivision')}
            >
              {t('subdivision.addBtn')}
            </button>
          </div>

          <div className="list-page-toolbar">
            <div className="list-page-search-wrap">
              <FiSearch className="list-page-search-icon" />
              <input
                type="text"
                placeholder={t('subdivision.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="list-page-search-input"
              />
            </div>
          </div>

          <div className="list-page-summary">
            <p className="list-page-summary-label">{t('subdivision.recorded')}</p>
            <p className="list-page-summary-count">{t('subdivision.count', { n: totalCount })}</p>
          </div>

          {filteredSubdivisions.length === 0 && !loading ? (
            <p className="list-page-empty">{t('subdivision.empty')}</p>
          ) : (
            <div className="list-page-table-wrap">
              <table className="list-page-table">
                <thead>
                  <tr>
                    <th className="list-page-th-id">{t('common.id')}</th>
                    <th>{t('common.name')}</th>
                    <th>{t('nav.wilaya')}</th>
                    <th className="list-page-th-actions">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubdivisions.map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.id}</td>
                      <td className="list-page-td-name">
                        {editingId === sub.id ? (
                          <input
                            value={editedSubdivName}
                            onChange={(e) => setEditedSubdivName(e.target.value)}
                            className="list-page-inline-input"
                          />
                        ) : (
                          sub.nom
                        )}
                      </td>
                      <td>{sub.wilaya?.nom ?? '—'}</td>
                      <td className="list-page-td-actions">
                        <div className="list-page-actions">
                          {editingId === sub.id ? (
                            <button
                              type="button"
                              onClick={() => handleUpdate(sub.wilaya?.id)}
                              className="list-page-btn-validate"
                            >
                              {t('common.confirm')}
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEdit(sub)}
                                className="list-page-action-btn list-page-action-btn--edit"
                                aria-label={t('common.edit')}
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(sub.id)}
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
            displayed={subdivisions.length}
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

export default SubdivisionManager;
