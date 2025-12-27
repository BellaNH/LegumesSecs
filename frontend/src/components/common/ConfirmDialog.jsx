import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import { Warning, Close } from '@mui/icons-material';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmer l'action",
  message = "Êtes-vous sûr de vouloir continuer ?",
  confirmText = "Confirmer",
  cancelText = "Annuler",
  severity = "warning",
  icon: Icon = Warning,
  confirmColor = "error",
  showIcon = true,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const iconColor = {
    warning: '#ff9800',
    error: '#d32f2f',
    info: '#1976d2',
  }[severity] || '#ff9800';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {showIcon && Icon && (
            <Icon sx={{ color: iconColor, fontSize: 28 }} />
          )}
          <span>{title}</span>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'text.secondary' }}
          aria-label="Fermer"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ fontSize: '1rem', color: 'text.primary' }}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: '#d32f2f',
            color: '#d32f2f',
            '&:hover': {
              borderColor: '#b71c1c',
              backgroundColor: 'rgba(211, 47, 47, 0.04)',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={confirmColor}
          sx={{
            bgcolor: confirmColor === 'error' ? '#d32f2f' : '#16a34a',
            '&:hover': {
              bgcolor: confirmColor === 'error' ? '#b71c1c' : '#139442ff',
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;



















