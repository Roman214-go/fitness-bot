import { useAuth } from '../../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  console.log(user?.role);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Добро пожаловать, {user?.role === 'premium' ? 'Красавчик' : 'Нищий'}</h1>
    </div>
  );
};

export default HomePage;
