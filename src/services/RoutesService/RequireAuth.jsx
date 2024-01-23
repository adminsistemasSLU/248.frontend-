// RequireAuth.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider'; // Asegúrate de importar useAuth correctamente

const RequireAuth = ({ children }) => {
  const { user } = useAuth(); // Accede al estado de usuario desde el contexto
  const location = useLocation(); // Hook para obtener la ubicación actual
  const { isLoading } = useAuth();

  if (isLoading) {
    console.log('cargando');
    return <div>Loading...</div>;
  }

  if (!user) {
   console.log('no hay usuario');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children; // Si el usuario está autenticado, renderiza los componentes hijos
};

export default RequireAuth;
