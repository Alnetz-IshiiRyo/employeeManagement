// src/components/Footer.tsx
import React from 'react';
import { AppBar, Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <AppBar
      position="static"
      color="primary"
      sx={{ height: '30px', marginTop: '20px' }}
    >
      <Box sx={{ maxWidth: '100%', margin: '0 auto', mt: 0 }}>
        <Typography variant="body2" color="text.secondary" align="right">
          {'© '}
          {new Date().getFullYear()}
          {' 従業員管理システム'}
        </Typography>
      </Box>
    </AppBar>
  );
};

export default Footer;
