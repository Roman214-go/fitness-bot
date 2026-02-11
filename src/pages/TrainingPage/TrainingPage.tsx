/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { MdArrowBackIos } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './TrainingPage.module.scss';
import Button from '../../common/components/Button';
import { useGetWorkoutByDateQuery } from './api/getTrainee';

interface ExerciseView {
  id: number;
  name: string;
  reps: number;
  color: string | null;
}

export const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();

  const { data, isLoading, isError } = useGetWorkoutByDateQuery(date!);

  if (isLoading) return <div className={styles.container}>Загрузка...</div>;
  if (isError || !data?.workout) return <div className={styles.container}>Тренировка не найдена</div>;

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
    </div>
  );
};
