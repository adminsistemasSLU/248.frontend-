import Header from '../components/header';
import Footer from '../components/footer';
import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import QuoterRoutes from '../routes/QuoterRoute';
import Loading from '../utils/loading';
import { useAuth } from '../services/AuthProvider';

// const styles = {
//     container: {
//         display: 'flex',
//         flexDirection: 'column',
//         minHeight: '100vh', // Al menos el 100% del alto de la ventana
//     },
//     content: {
//         flex: 1, // Este elemento se expandirá para ocupar el espacio restante
//     },
// };

const Login = lazy(() => import('../modules/Register/Login'));
const Register = lazy(() => import('../modules/Register/Register'));

const MainRoute = () => {

const { isLoading } = useAuth();

const loadingStyle = {
    display: isLoading ? 'block' : 'none'
  };
    return (
          <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
             <div style={loadingStyle}>
                <Loading />
            </div>
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="/" element={<Navigate to="login" />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/quoter/*" element={<QuoterRoutes />} />
              </Routes>
            </Suspense>
            <Footer />
          </div>
        
      );
    };

export default MainRoute;
