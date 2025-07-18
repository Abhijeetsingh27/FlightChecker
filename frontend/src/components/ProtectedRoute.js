import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const user = useAuth();
  if (user === undefined) return null; // or a loading spinner
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute; 