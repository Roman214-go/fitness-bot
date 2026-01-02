import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface ProtectedRouteProps {
  requirePremium?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({ requirePremium = false }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isPremium } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  // Проверка подписки
  if (requirePremium && !isPremium && user?.role !== 'admin') {
    return <Navigate to='/subscription' replace />;
  }

  return <Outlet />;
};
