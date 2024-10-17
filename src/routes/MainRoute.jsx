import Header from '../components/header';
import Footer from '../components/footer';
import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import QuoterRoutes from '../routes/QuoterRoute';
import Loading from '../utils/loading';
import { useAuth } from '../services/AuthProvider';
import ChangePassword from '../utils/changePassword';

const Login = lazy(() => import('../modules/Register/Login'));
const Register = lazy(() => import('../modules/Register/Register'));

const MainRoute = () => {
  const location = useLocation();
  const { isLoading } = useAuth();

  const loadingStyle = {
    display: isLoading ? 'block' : 'none'
  };

  const shouldShowHeader = () => {
    return location.pathname !== "/login";
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
       <div style={loadingStyle}>
          <Loading />
      </div>
      {shouldShowHeader() && <Header />}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="changePassword" element={<ChangePassword />} />
          <Route path="register" element={<Register />} />
          <Route path="/" element={<Navigate to="login" />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/quoter/*" element={<QuoterRoutes />} />
        </Routes>
      </Suspense>
      {shouldShowHeader() && <Footer />}
    </div>
  );
};

export default MainRoute;