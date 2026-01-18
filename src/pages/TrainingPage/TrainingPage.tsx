import React, { useState } from 'react';

import { MdArrowBackIos } from 'react-icons/md';

import styles from './TrainingPage.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/components/Button';

interface Exercise {
  id: number;
  name: string;
  color?: string;
  reps?: number;
}

export const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const [exercises] = useState<Exercise[]>([
    { id: 1, name: 'Сгибание рук с гантелями', color: '#B3A0FF' },
    { id: 2, name: 'Жим штанги лёжа', color: '#B3A0FF' },
    { id: 3, name: 'Разведение гантелей на наклонной скамье 45', color: '#B3A0FF' },
    { id: 4, name: 'Молоты' },
    { id: 5, name: 'Горизонтальный жим сидя в рычажном тренажёре' },
    { id: 6, name: 'Жим в наклоне' },
    { id: 7, name: 'Гиперэкстензия повышена' },
  ]);

  const handleStartTraining = () => {
    navigate('/workout');
  };

  const handleSkipTraining = () => {
    console.log('Пропустить тренировку');
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
          Количество повторений: <span style={{ color: '#c4ff4d' }}>20</span>
        </p>

        <div className={styles.exerciseList}>
          {exercises.map(exercise => (
            <div
              key={exercise.id}
              className={styles.exerciseCard}
              style={{ borderColor: exercise.color, color: exercise.color }}
            >
              {exercise.name}
            </div>
          ))}
        </div>

        <div className={styles.buttonGroup}>
          <Button onClick={handleStartTraining}>Начать тренировку</Button>
          <Button buttonType='secondary' onClick={handleSkipTraining}>
            Пропустить тренировку
          </Button>
        </div>
      </div>
    </div>
  );
};
