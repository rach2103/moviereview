import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: JSX.Element;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  // This handles the case where auth state is still loading from localStorage.
  // A more robust solution might have a dedicated `isLoading` state in AuthContext.
  if (isAuthenticated === undefined) {
      return <div className="flex justify-center items-center h-screen"><LoadingSpinner/></div>
  }
  
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;