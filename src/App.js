import './App.css';
import React from 'react';
import MainRoute from './routes/MainRoute';
import { AuthProvider } from './services/AuthProvider'; // Asegúrate de importar AuthProvider correctamente


const App = () => {
  return (
    <AuthProvider> { /* Envuelve tu aplicación con AuthProvider */}
      <MainRoute></MainRoute>
    </AuthProvider>
  );
}

export default App;
