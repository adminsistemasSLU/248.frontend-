import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    position="fixed" // Usar posición fija para cubrir toda la pantalla
    top={0}
    left={0}
    width="100vw" // Ancho igual al ancho de la ventana
    height="100vh" // Altura igual a la altura de la ventana
    bgcolor="rgba(0, 0, 0, 0.7)" // Color de fondo negro con transparencia
    zIndex="modal" // Asegurarse de que esté encima de otros elementos
  >
    <CircularProgress />
  </Box>
);

export default Loading;