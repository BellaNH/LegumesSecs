import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

const Button = ({
  children,
  loading = false,
  disabled = false,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  sx = {},
  ...props
}) => {
  const buttonColor = color === 'primary' ? '#16a34a' : color;
  
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      startIcon={loading ? <CircularProgress size={16} color="inherit" aria-label="Chargement" /> : startIcon}
      endIcon={!loading ? endIcon : null}
      aria-busy={loading}
      aria-label={loading ? `${children} - Chargement` : undefined}
      sx={{
        ...(variant === 'contained' && color === 'primary' && {
          bgcolor: buttonColor,
          '&:hover': {
            bgcolor: '#139442ff',
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {loading ? 'Chargement...' : children}
    </MuiButton>
  );
};

export default Button;

