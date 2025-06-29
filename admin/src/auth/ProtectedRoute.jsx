import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ adminOnly = false, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = React.useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'admin') {
    return <Outlet />;
  }

  if (adminOnly) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user's role is in allowedRoles
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

