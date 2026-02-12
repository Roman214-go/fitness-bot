import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

export const ProtectedRoute = () => {
  const { userData } = useAppSelector(state => state.auth);

  if (userData?.medical_history && userData.body_photos) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};
