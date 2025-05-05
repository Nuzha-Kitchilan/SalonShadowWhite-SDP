// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { AuthContext } from './AuthContext';

// const ProtectedRoute = () => {
//   const { isAuthenticated, isLoading } = React.useContext(AuthContext);

//   if (isLoading) {
//     return <div className="loading-spinner">Loading...</div>; // Replace with your loader
//   }

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;








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

  // Admin has access to everything
  if (user?.role === 'admin') {
    return <Outlet />;
  }

  // Check if route requires admin but user isn't admin
  if (adminOnly) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user's role is in allowedRoles (if specified)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

