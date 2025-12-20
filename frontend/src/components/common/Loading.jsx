import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = ({ 
  message = "Chargement...", 
  size = 40,
  fullScreen = false,
  overlay = false 
}) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    ...(fullScreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: overlay ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
      zIndex: 9999,
    }),
    ...(!fullScreen && {
      padding: 4,
      minHeight: '200px',
    }),
  };

  return (
    <Box sx={containerStyle}>
      <CircularProgress size={size} sx={{ color: '#16a34a' }} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loading;









