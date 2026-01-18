import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface ProtectedRouteProps {
  requirePremium?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({ requirePremium = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isPremium } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  if (requirePremium && !isPremium) {
    return <Navigate to='/subscription' replace />;
  }

  return <Outlet />;
};
