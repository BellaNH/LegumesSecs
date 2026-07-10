import { useLanguage } from '../../i18n/LanguageContext';

const ListPaginationFooter = ({
  displayed,
  totalCount,
  hasMore,
  loadedAll,
  loading,
  onLoadMore,
  onLoadAll,
}) => {
  const { t } = useLanguage();

  return (
    <div className="list-page-pagination">
      <span className="list-page-pagination-info">
        {t('pagination.showing', { displayed, totalCount })}
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
              {loading ? t('common.loading') : t('pagination.showMore')}
            </button>
            <button
              type="button"
              className="list-page-btn-load-all"
              onClick={onLoadAll}
              disabled={loading}
            >
              {t('pagination.showAll')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ListPaginationFooter;
