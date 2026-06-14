import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUsuario } from '../context/UsuarioContext';

const ProtectedRoute = ({ children }) => {
  const { usuario } = useUsuario();

  if (!usuario) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
