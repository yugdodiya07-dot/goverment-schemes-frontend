import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen text="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/401" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
