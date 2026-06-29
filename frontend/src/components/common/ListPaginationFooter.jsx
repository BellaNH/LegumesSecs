const ListPaginationFooter = ({
  displayed,
  totalCount,
  hasMore,
  loadedAll,
  loading,
  onLoadMore,
  onLoadAll,
}) => (
  <div className="list-page-pagination">
    <span className="list-page-pagination-info">
      Affichage {displayed} sur {totalCount}
    </span>
    <div className="list-page-pagination-actions">
      {hasMore && !loadedAll && (
        <>
          <button
            type="button"
            className="list-page-btn-load-more"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Afficher plus'}
          </button>
          <button
            type="button"
            className="list-page-btn-load-all"
            onClick={onLoadAll}
            disabled={loading}
          >
            Afficher tout
          </button>
        </>
      )}
    </div>
  </div>
);

export default ListPaginationFooter;
