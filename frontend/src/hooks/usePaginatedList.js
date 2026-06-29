import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_PAGE_SIZE, fetchPaginatedPage, fetchAllPaginated } from '../utils/paginatedApi';

export function usePaginatedList(url, endpoint) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadPage = useCallback(
    async (pageNum, append = false) => {
      setLoading(true);
      try {
        const { results, count, hasMore: more } = await fetchPaginatedPage(
          url,
          endpoint,
          pageNum,
          DEFAULT_PAGE_SIZE
        );
        setItems((prev) => (append ? [...prev, ...results] : results));
        setTotalCount(count);
        setHasMore(more);
        setPage(pageNum);
        setLoadedAll(!more);
      } finally {
        setLoading(false);
      }
    },
    [url, endpoint]
  );

  const refresh = useCallback(() => loadPage(1, false), [loadPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    loadPage(page + 1, true);
  }, [hasMore, loading, loadPage, page]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const { results, count } = await fetchAllPaginated(url, endpoint);
      setItems(results);
      setTotalCount(count);
      setHasMore(false);
      setLoadedAll(true);
    } finally {
      setLoading(false);
    }
  }, [url, endpoint]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    items,
    setItems,
    totalCount,
    hasMore,
    loadedAll,
    loading,
    loadMore,
    loadAll,
    refresh,
  };
}
