import './App.css';
import React, { useState, useEffect } from 'react';

import MainRoute from './routes/MainRoute';
import { AuthProvider } from './services/AuthProvider';

const App = () => {
  const [isLandscape, setIsLandscape] = useState(window.screen.orientation.type.includes('landscape'));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.screen.orientation.type.includes('landscape'));
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // if (isLandscape && isMobile) {
  //   return (
  //     <div style={{
  //       position: 'fixed',
  //       top: 0,
  //       left: 0,
  //       width: '100vw',
  //       height: '100vh',
  //       backgroundColor: 'white',
  //       color: '#02545C',
  //       display: 'flex',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       flexDirection: 'column',
  //       fontSize: '24px',
  //       zIndex: 1000,
  //     }}>
  //       <img src={process.env.PUBLIC_URL + '/assets/images/LogoSLU.jpg'} style={{ height: '100px', objectFit: 'cover' }} />
  //       <p>Por favor, rota tu dispositivo en modo vertical.</p>
  //     </div>
  //   );
  // }

  return (
    <AuthProvider>
      <MainRoute />
    </AuthProvider>
  );
}

export default App;
