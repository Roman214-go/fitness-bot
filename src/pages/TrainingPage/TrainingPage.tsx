/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from 'react';
import { MdArrowBackIos } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './TrainingPage.module.scss';
import Button from '../../common/components/Button';
import { useGetWorkoutByDateQuery } from './api/getTrainee';
import { toast, ToastContainer, Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ErrorScreen } from '../ErrorScreen/ErrorScreen';
import Loader from '../../common/components/Loader';

interface ExerciseView {
  id: number;
  name: string;
  reps: number;
  color: string | null;
}

export const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();
  const toastIdRef = useRef<Id | null>(null);
  const [showNotificationButton, setShowNotificationButton] = useState(false);

  const { data, isLoading, isError } = useGetWorkoutByDateQuery(date!);

  const notificationText =
    'На этой тренировке следует поднять нагрузку с помощью дополнительного отягощения. Для этого сделайте подъем на один шаг в весе в каждом упражнении. Если в каком-то упражнении Вы не сможете реализовать заданое количество повторений с новой нагрузкой, то оставьте для этого упражнения старое значение веса. Если у Вас появяться какие-либо вопросы, то следует написать тренеру.';

  const showNotification = () => {
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }

    toastIdRef.current = toast(notificationText, {
      autoClose: 5000,
      closeButton: true,
      draggable: false,
      position: 'bottom-right',
      onClose: () => {
        setShowNotificationButton(true);
      },
    });

    setShowNotificationButton(false);
  };

  useEffect(() => {
    if (data?.workout && data.workout.is_cycle_completed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      showNotification();
    }
  }, [data]);

  if (isLoading) return <Loader />;
  if (isError || !data?.workout) return <ErrorScreen isBackButton message={'Тренировка не найдена'} />;

  const workout = data.workout;

  const exercises: ExerciseView[] =
    workout.personal_sets?.flatMap((set: any) =>
      set.personal_exercises.map((ex: any) => ({
        id: ex.id,
        name: ex.name,
        reps: ex.reps,
        color: set.color_code,
      })),
    ) ?? [];

  const handleStartTraining = () => {
    navigate(`/workout/${date}`, { state: { workout, workout_date: data.workout_date } });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <MdArrowBackIos />
        </button>
        <h1 className={styles.title}>Упражнения</h1>
        <span className={styles.time}>00:00</span>
      </header>

      <div className={styles.content}>
        <p className={styles.repeatCount}>
          Количество повторений: <span style={{ color: '#c4ff4d' }}>{workout.repetitions}</span>
        </p>

        <div className={styles.exerciseList}>
          {exercises.map(ex => (
            <div
              key={ex.id}
              className={styles.exerciseCard}
              style={{ borderColor: ex.color || '#fff', color: ex.color || '#fff' }}
            >
              {ex.name}
            </div>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          <Button onClick={handleStartTraining}>Начать тренировку</Button>
        </div>
      </div>

      <ToastContainer
        theme='light'
        hideProgressBar
        toastStyle={{
          fontSize: '14px',
          lineHeight: '1.5',
          background: '#672dca',
          color: 'white',
        }}
      />

      {showNotificationButton && (
        <button className={styles.notificationButton} onClick={showNotification}>
          <MdArrowBackIos />
        </button>
      )}
    </div>
  );
};
