import { useNavigate } from 'react-router-dom';
import { CalorieChart } from '../../common/components/CalorieChart/CalorieChart';
import { useGetUpcomingWorkoutQuery } from '../TrainingPage/api/getTrainee';
import styles from './HomePage.module.scss';
import { useAppSelector } from '../../common/store/hooks';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import blocksImg from '../../assets/equipment/blocksImg.jpg';
import dumbbellsImg from '../../assets/equipment/dumbbellsImg.jpg';
import matImg from '../../assets/equipment/matImg.jpg';
import bandImg from '../../assets/equipment/bandImg.jpg';
import trxImg from '../../assets/equipment/trxImg.jpg';
import Button from '../../common/components/Button';
import { checkSubscriptionStatus } from '../../common/utils/checkSubscription';

const HomePage = () => {
  const navigate = useNavigate();
  const { userData } = useAppSelector(state => state.auth);
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const equipment = [
    {
      img: blocksImg,
      label: 'Блоки для йоги',
    },
    {
      img: dumbbellsImg,
      label: 'Гантели',
    },
    {
      img: bandImg,
      label: 'Фитнес-резинки',
    },
    {
      img: trxImg,
      label: 'Подвесные тренировочные петли',
    },
    {
      img: matImg,
      label: 'Коврик для тренировок',
    },
  ];

  const { data: upcomingWorkout } = useGetUpcomingWorkoutQuery(undefined, {
    skip: !userData?.has_workout_plan,
  });
  const segments = [
    { id: 1, value: userData?.nutrition.proteins, color: '#2563EB', label: 'Белки' },
    { id: 2, value: userData?.nutrition.fats, color: '#F59E0B', label: 'Жиры' },
    { id: 3, value: userData?.nutrition.carbohydrates, color: '#10B981', label: 'Углеводы' },
  ];

  const handleStartUpcomingWorkout = () => {
    if (!upcomingWorkout) return;

    const workout_date = upcomingWorkout.workout_dates[0];
    const workoutDate = dayjs(workout_date.scheduled_date);

    const startOfNextWeek = dayjs().add(1, 'week').startOf('week');

    if (workoutDate.isSame(startOfNextWeek) || workoutDate.isAfter(startOfNextWeek)) {
      toast.info('Эта тренировка будет доступна на следующей неделе');
      return;
    }

    navigate(`/training/${workout_date.scheduled_date}`, {
      state: { workout: upcomingWorkout, workout_date },
    });
  };

  const formattedDate = upcomingWorkout
    ? dayjs(upcomingWorkout.workout_dates[0].scheduled_date).format('DD.MM.YYYY')
    : 'не назначена';

  const totalExercises = upcomingWorkout
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      upcomingWorkout.personal_sets?.reduce((sum: number, set: any) => sum + set.personal_exercises.length, 0)
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.container_trainee}>
        {userData?.has_workout_plan ? (
          <>
            <h2>Начни свою тренировку</h2>
            <div className={styles.trainee} onClick={handleStartUpcomingWorkout}>
              <h2>Упражнений: {totalExercises}</h2>
              <p>Ближайшая тренировка: {formattedDate}</p>
            </div>
          </>
        ) : null}
        {!userData?.has_workout_plan &&
        checkSubscriptionStatus(userData?.subscription) &&
        userData?.fitness_goals.workout_format === 'home' ? (
          <Button buttonType='secondary' onClick={() => setIsEquipmentOpen(true)}>
            Необходимый инвентарь для тренировок
          </Button>
        ) : null}
      </div>
      {activeImage && (
        <div className={styles.imageOverlay} onClick={() => setActiveImage(null)}>
          <div className={styles.imageModal} onClick={e => e.stopPropagation()}>
            <img src={activeImage} alt='Инвентарь' />
            <button className={styles.imageClose} onClick={() => setActiveImage(null)}>
              ✕
            </button>
          </div>
        </div>
      )}
      {isEquipmentOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsEquipmentOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>Инвентарь для тренировок</h3>
            <div className={styles.equipmentGrid}>
              {equipment.map((item, index) => (
                <div key={index} className={styles.equipmentItem}>
                  <img src={item.img} alt={item.label} onClick={() => setActiveImage(item.img)} />{' '}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <Button onClick={() => setIsEquipmentOpen(false)}>Закрыть</Button>
          </div>
        </div>
      )}

      <CalorieChart totalCalories={userData?.nutrition.calories} segments={segments} />

      <ToastContainer theme='light' hideProgressBar autoClose={3000} style={{ position: 'absolute' }} />
    </div>
  );
};

export default HomePage;
