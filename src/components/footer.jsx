import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import '../styles/footer.scss';


const Footer = () => {
  return (
    <AppBar position="static" component="footer" className="appBar">
      <Toolbar sx={{ backgroundColor: '#00a99e', height: '75px', display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1" color="inherit">
          © 2023 Seguros La Unión.
        </Typography>
        <Typography variant="body1" color="inherit" sx={{ textAlign: 'right' }}>
          Powered by AiSoftTech
        </Typography>
      </Toolbar>
    </AppBar>
  );
};


/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{zIndex:1}}>  
<path fill="#00a99e" fill-opacity="1"  d="M0,64L60,58.7C120,53,240,43,360,58.7C480,75,600,117,720,117.3C840,117,960,75,1080,69.3C1200,64,1320,96,1380,112L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z">
<Toolbar sx={{backgroundColor: '#00a99e', Height: '75px', zIndex:3}}>
  <Typography variant="body1" color="inherit">
    © 2023 Mi Aplicación. Todos los derechos reservados.
  </Typography>
</Toolbar>
</path></svg> */

export default Footer;