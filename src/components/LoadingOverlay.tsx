// src/components/LoadingOverlay.tsx
import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingOverlayProps {
  loading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1500,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingOverlay;
