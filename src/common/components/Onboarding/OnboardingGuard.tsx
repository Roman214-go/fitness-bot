import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// import Loader from '../Loader';
import { useAppSelector } from '../../store/hooks';

interface OnboardingGuardProps {
  children: ReactNode;
}

export const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const location = useLocation();
  const { authData, userData } = useAppSelector(state => state.auth);

  if (!authData || !userData) {
    return <>{children}</>;
  }

  const pathname = location.pathname;

  if (!userData.medical_history || !userData.anthropometric_data.gender) {
    if (pathname !== '/main-form' && pathname !== '/anamnesis-form') {
      if (pathname !== '/onboarding') {
        return <Navigate to='/onboarding' replace />;
      }
      return <>{children}</>;
    }

    if (!userData.anthropometric_data.gender) {
      if (pathname !== '/main-form') {
        return <Navigate to='/main-form' replace />;
      }
      return <>{children}</>;
    }

    if (userData.anthropometric_data.gender && !userData.medical_history) {
      if (pathname !== '/anamnesis-form') {
        return <Navigate to='/anamnesis-form' replace />;
      }
      return <>{children}</>;
    }
  }

  return <>{children}</>;
};
