import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

export const ProtectedRoute = () => {
  const { userData } = useAppSelector(state => state.auth);

  if (userData?.anthropometric_data && userData.body_photos) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};
