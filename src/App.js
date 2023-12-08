import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import NotFound from './pages/NotFound';
import QuoterRoutes from './routes/QuoterRoute';
import Steppers from './components/steppers';


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Al menos el 100% del alto de la ventana
  },
  content: {
    flex: 1, // Este elemento se expandirá para ocupar el espacio restante
  },
};

const Login = lazy(() => import('./modules/Register/Login'));
const Register = lazy(() => import('./modules/Register/Register'));

const App = () => {
  return (
    <div className="App" style={styles.container}>
      <Header /> { }
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="login" />} />
          <Route path="/quoter/*" element={<QuoterRoutes />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/quoter/stepper" element={<Steppers />} />
        </Routes>
      </Suspense>
      <Footer /> { }
    </div>
  );
}

export default App;
