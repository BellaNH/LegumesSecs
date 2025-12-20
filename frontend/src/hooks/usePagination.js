import { useState, useCallback } from 'react';

export const usePagination = (initialPage = 1, initialPageSize = 20) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when page size changes
  }, []);

  const resetPagination = useCallback(() => {
    setPage(1);
    setPageSize(initialPageSize);
  }, [initialPageSize]);

  return {
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    resetPagination,
  };
};

export default usePagination;









