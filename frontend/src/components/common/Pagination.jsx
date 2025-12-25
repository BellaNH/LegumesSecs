import React from 'react';
import {
  Box,
  Pagination as MuiPagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';

const Pagination = ({
  count,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSize = true,
  showInfo = true,
}) => {
  const totalPages = Math.ceil(count / pageSize);
  const startItem = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, count);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        padding: 2,
        borderTop: '1px solid #e0e0e0',
      }}
    >
      {showInfo && (
        <Typography variant="body2" color="text.secondary">
          Affichage de {startItem} à {endItem} sur {count} résultats
        </Typography>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {showPageSize && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Par page</InputLabel>
            <Select
              value={pageSize}
              label="Par page"
              onChange={(e) => onPageSizeChange(e.target.value)}
            >
              {pageSizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <MuiPagination
          count={totalPages}
          page={page}
          onChange={(event, value) => onPageChange(value)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default Pagination;

















