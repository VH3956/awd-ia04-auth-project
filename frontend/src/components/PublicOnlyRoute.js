import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // If the user is logged in, redirect them to the dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, show the child route (login/signup)
  return <Outlet />;
};

export default PublicOnlyRoute;