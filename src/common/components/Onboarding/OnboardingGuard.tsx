import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../Loader';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard = ({ children }: OnboardingGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Пока грузится auth — вообще ничего не делаем
  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    return <>{children}</>;
  }

  const { role, mainFormCompleted, anamnesisCompleted } = user;
  console.log(user);

  // Гость
  if (role === 'guest') {
    if (!mainFormCompleted && !anamnesisCompleted && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true });
      return null;
    }

    if (!mainFormCompleted && location.pathname !== '/main-form') {
      navigate('/main-form', { replace: true });
      return null;
    }

    if (mainFormCompleted && !anamnesisCompleted && location.pathname !== '/anamnesis-form') {
      navigate('/anamnesis-form', { replace: true });
      return null;
    }
  }

  // Авторизованный
  if (role !== 'guest' && location.pathname !== '/onboarding') {
    navigate('/onboarding', { replace: true });
    return null;
  }

  return <>{children}</>;
};
