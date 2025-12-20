import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useFocusTrap } from '../../hooks/useKeyboardNavigation';

const FormModal = ({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
  maxWidth = "md",
  fullWidth = true,
  submitButtonProps = {},
  cancelButtonProps = {},
  showActions = true,
}) => {
  const dialogRef = useRef(null);
  useFocusTrap(dialogRef, open);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        ref: dialogRef,
        sx: {
          borderRadius: 3,
          minWidth: { xs: 300, sm: 400 },
        },
      }}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <DialogTitle
        id="modal-title"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '1.3rem',
          color: '#16a34a',
          paddingBottom: 1,
        }}
      >
        {title}
        <IconButton
          onClick={onClose}
          aria-label="Fermer la boîte de dialogue"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent id="modal-description">
          <Box sx={{ paddingTop: 1 }}>
            {children}
          </Box>
        </DialogContent>

        {showActions && (
          <DialogActions
            sx={{
              padding: '16px 24px',
              justifyContent: 'space-between',
            }}
          >
            <Button
              onClick={onClose}
              variant="contained"
              aria-label={cancelLabel}
              sx={{
                bgcolor: '#d32f2f',
                '&:hover': {
                  bgcolor: '#b71c1c',
                },
              }}
              {...cancelButtonProps}
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              variant="contained"
              aria-label={submitLabel}
              sx={{
                bgcolor: '#16a34a',
                '&:hover': {
                  bgcolor: '#139442ff',
                },
              }}
              {...submitButtonProps}
            >
              {submitLabel}
            </Button>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
};

export default FormModal;

