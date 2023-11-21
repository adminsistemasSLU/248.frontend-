import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const styles = {
    appBar: {
      top: 'auto',
      bottom: 0,
    },
  };

const Footer = () => {
  return (
    <AppBar position="static"  style={styles.appBar}>
      <Toolbar>
        <Typography variant="body1" color="inherit">
          © 2023 Mi Aplicación. Todos los derechos reservados.
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;