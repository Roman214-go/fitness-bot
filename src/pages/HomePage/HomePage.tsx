import { useNavigate } from 'react-router-dom';
import { CalorieChart } from '../../common/components/CalorieChart/CalorieChart';
import { useAuth } from '../../context/AuthContext';

import styles from './HomePage.module.scss';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log(user?.role);
  const segments = [
    { id: 1, value: 100, color: '#2563EB', label: 'Белки' },
    { id: 2, value: 50, color: '#F59E0B', label: 'Жиры' },
    { id: 3, value: 200, color: '#10B981', label: 'Углеводы' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.container_trainee}>
        <h2>Начни свою тренировку</h2>
        <div className={styles.trainee} onClick={() => navigate('/trainee')}>
          <h2>Упражнений: {3}</h2>
          <p>Ближайшая тренировка дд.мм.гггг</p>
        </div>
      </div>
      <CalorieChart totalCalories={2500} segments={segments} />
    </div>
  );
};

export default HomePage;
