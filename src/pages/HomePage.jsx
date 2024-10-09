// src/pages/HomePage.jsx
import React from 'react';
import Typography from '@mui/material/Typography';
import HomeCarrousel from '../utils/HomeCarrousel';
import Footer from '../components/footer';

const HomePage = () => {
  return (
    <div style={{ paddingTop: '20px'}}>
      <div style={{ display: 'flex', justifyContent: 'center', color:'#02545C'}}> 
        <img src={process.env.PUBLIC_URL + "/assets/images/iconTitle.png"} style={{ paddingTop: '30px', paddingRight: '10px', height: '24px' }} />
        <h1>NUESTROS SEGUROS</h1>
      </div>
      <Typography variant="body2" color="text.secondary" style={{ textAlign: 'center', paddingBottom: '20px', fontWeight: 'bold' }}>
        ¿Qué tipo de seguro esta interesado(a)?
      </Typography>
      <HomeCarrousel /> { }
      <Footer />
    </div>
  );
};

export default HomePage;
