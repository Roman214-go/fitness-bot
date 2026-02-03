import { useNavigate } from 'react-router-dom';
import { CalorieChart } from '../../common/components/CalorieChart/CalorieChart';

import styles from './HomePage.module.scss';
import { useAppSelector } from '../../common/store/hooks';

const HomePage = () => {
  const navigate = useNavigate();
  const { userData } = useAppSelector(state => state.auth);

  const segments = [
    { id: 1, value: userData?.nutrition.proteins, color: '#2563EB', label: 'Белки' },
    { id: 2, value: userData?.nutrition.fats, color: '#F59E0B', label: 'Жиры' },
    { id: 3, value: userData?.nutrition.carbohydrates, color: '#10B981', label: 'Углеводы' },
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
      <CalorieChart totalCalories={userData?.nutrition.calories} segments={segments} />
    </div>
  );
};

export default HomePage;
