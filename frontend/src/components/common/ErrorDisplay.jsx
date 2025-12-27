import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

const ErrorDisplay = ({
  error,
  title = "Erreur",
  message,
  onRetry,
  retryLabel = "Réessayer",
  severity = "error",
  sx = {},
}) => {
  const displayMessage = message || (error?.message || "Une erreur est survenue");

  return (
    <Alert
      severity={severity}
      sx={{
        mb: 2,
        ...sx,
      }}
      action={
        onRetry && (
          <Button
            color="inherit"
            size="small"
            onClick={onRetry}
            startIcon={<Refresh />}
          >
            {retryLabel}
          </Button>
        )
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {displayMessage}
    </Alert>
  );
};

export default ErrorDisplay;



















