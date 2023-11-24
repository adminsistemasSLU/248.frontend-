import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomeRoute from './routes/HomeRoute';
import NotFound from './pages/NotFound';

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


const App = () => {
  return (
    <div className="App" style={styles.container}>
      <Header /> { }
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/home/*" element={<HomeRoute />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      <Footer /> { }
    </div>
  );
}

export default App;
