// RequireAuth.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider'; // Asegúrate de importar useAuth correctamente
import { PERMISSIONS_STORAGE_KEY } from '../../utils/constantes';

const RequireAuth = ({ children, requiredBaldosaId  }) => {
  const { user } = useAuth(); // Accede al estado de usuario desde el contexto
  const location = useLocation(); // Hook para obtener la ubicación actual
  const { isLoading } = useAuth();
  
// Obtener permisos del localStorage
const storedBaldosasPermiso = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
const baldosasPermiso = storedBaldosasPermiso ? JSON.parse(storedBaldosasPermiso) : { Baldosas: [] };

  // Verificar permisos
  const hasPermission = requiredBaldosaId ? baldosasPermiso.Baldosas.includes(requiredBaldosaId.toString()) : true;

  const changePassword = sessionStorage.getItem('new_password');

  if (requiredBaldosaId && !hasPermission ) {
    return <Navigate to="/not-authorized" replace />; // Redirigir si no tiene permiso
  }

  if (changePassword ==='S' ) {
    return <Navigate to="/not-authorized" replace />; // Redirigir si no tiene permiso
  }

  
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children; // Si el usuario está autenticado, renderiza los componentes hijos
};

export default RequireAuth;
