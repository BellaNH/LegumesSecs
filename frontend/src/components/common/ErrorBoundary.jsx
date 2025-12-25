import React, { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    
    // Log error to console or error tracking service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              maxWidth: 600,
              textAlign: 'center',
            }}
          >
            <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="error">
              Une erreur est survenue
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {this.props.message || "Désolé, quelque chose s'est mal passé. Veuillez réessayer."}
            </Typography>
            
            {this.props.showDetails && this.state.error && (
              <Box sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="body2" color="error" sx={{ fontFamily: 'monospace' }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={this.handleReset}
                sx={{ bgcolor: '#16a34a' }}
              >
                Réessayer
              </Button>
              {this.props.showHomeButton && (
                <Button
                  variant="outlined"
                  onClick={() => window.location.href = '/'}
                >
                  Retour à l'accueil
                </Button>
              )}
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
















