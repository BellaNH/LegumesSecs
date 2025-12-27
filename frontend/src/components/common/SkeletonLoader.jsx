import React from 'react';
import { Box, Skeleton } from '@mui/material';

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" width="100%" height={40} />
        ))}
      </Box>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 1 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="rectangular" width="100%" height={60} />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={30} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
      ))}
    </Box>
  );
};

export const ListSkeleton = ({ items = 5 }) => {
  return (
    <Box sx={{ width: '100%' }}>
      {Array.from({ length: items }).map((_, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={25} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const FormSkeleton = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={100} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="30%" height={40} />
    </Box>
  );
};

export default {
  Table: TableSkeleton,
  Card: CardSkeleton,
  List: ListSkeleton,
  Form: FormSkeleton,
};




















