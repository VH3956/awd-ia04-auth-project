import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the location
    // they were trying to go to
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child route (e.g., the dashboard)
  return <Outlet />;
};

export default ProtectedRoute;