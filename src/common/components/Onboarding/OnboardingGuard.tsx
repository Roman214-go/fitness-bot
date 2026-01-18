import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../Loader';

interface OnboardingGuardProps {
  children: ReactNode;
}

export const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    return <>{children}</>;
  }

  const { role, mainFormCompleted, anamnesisCompleted } = user;
  const pathname = location.pathname;

  if (role === 'guest') {
    if (pathname !== '/main-form' && pathname !== '/anamnesis-form') {
      if (pathname !== '/onboarding') {
        return <Navigate to='/onboarding' replace />;
      }
      return <>{children}</>;
    }

    if (!mainFormCompleted) {
      if (pathname !== '/main-form') {
        return <Navigate to='/main-form' replace />;
      }
      return <>{children}</>;
    }

    if (mainFormCompleted && !anamnesisCompleted) {
      if (pathname !== '/anamnesis-form') {
        return <Navigate to='/anamnesis-form' replace />;
      }
      return <>{children}</>;
    }
  }

  return <>{children}</>;
};
