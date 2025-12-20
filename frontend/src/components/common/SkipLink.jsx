import React from 'react';
import { Link, Box } from '@mui/material';

const SkipLink = ({ href = '#main-content', label = 'Aller au contenu principal' }) => {
  return (
    <Box
      component={Link}
      href={href}
      sx={{
        position: 'absolute',
        top: -40,
        left: 0,
        backgroundColor: '#16a34a',
        color: 'white',
        padding: '8px 16px',
        textDecoration: 'none',
        zIndex: 10000,
        '&:focus': {
          top: 0,
        },
      }}
    >
      {label}
    </Box>
  );
};

export default SkipLink;









