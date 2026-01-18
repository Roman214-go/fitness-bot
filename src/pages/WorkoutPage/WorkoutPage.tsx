import React, { useState, useEffect } from 'react';

import ReactPlayer from 'react-player';
import Button from '../../common/components/Button';

import styles from './WorkoutPage.module.scss';
import { useNavigate } from 'react-router-dom';

interface Exercise {
  id: number;
  name: string;
  videoUrl: string;
  sets: number;
  reps: number;
  needsWeight: boolean;
}

export const WorkoutPage: React.FC = () => {
  const [timer, setTimer] = useState<number>(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [weight, setWeight] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const navigate = useNavigate();

  const exercises: Exercise[] = [
    {
      id: 1,
      name: 'Сгибания рук с гантелями',
      videoUrl: 'https://www.youtube.com/watch?v=XfqOB4hvxlY&list=RDXfqOB4hvxlY&start_radio=1',
      sets: 4,
      reps: 12,
      needsWeight: true,
    },
    {
      id: 2,
      name: 'Жим штанги лёжа',
      videoUrl: 'https://www.youtube.com/watch?v=XfqOB4hvxlY&list=RDXfqOB4hvxlY&start_radio=1',
      sets: 4,
      reps: 10,
      needsWeight: true,
    },
    {
      id: 3,
      name: 'Планка',
      videoUrl: 'https://www.youtube.com/watch?v=XfqOB4hvxlY&list=RDXfqOB4hvxlY&start_radio=1',
      sets: 3,
      reps: 60,
      needsWeight: false,
    },
  ];
  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;
  const progress = ((currentSet - 1) / currentExercise.sets) * 100;
  const isLastSet = currentSet > currentExercise.sets;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    if (isLastSet) {
      // Завершить упражнение
      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
        setWeight('');
      } else {
        setIsCompleted(true);
        setTimeout(() => navigate('/calendar'), 2500);
      }
    } else {
      setCurrentSet(currentSet + 1);
      setWeight('');
    }
  };

  const handleSkip = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      setWeight('');
    }
  };

  const strokeDasharray = 2 * Math.PI * 63.75;
  const strokeDashoffset = strokeDasharray - (progress / 100) * strokeDasharray;

  if (isCompleted) {
    return (
      <div className={styles.container}>
        <div className={styles.completedCard}>
          <h1 className={styles.completedTitle}>🎉 Тренировка завершена!</h1>
          <p className={styles.completedTime}>Время: {formatTime(timer)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div />
          <span className={styles.headerTitle}>
            Упражнение {currentExerciseIndex + 1}/{totalExercises}
          </span>
          <span className={styles.timer}>{formatTime(timer)}</span>
        </div>

        <ReactPlayer controls style={{ width: '100%', height: '35vh' }} src={currentExercise.videoUrl} />

        <div className={styles.exerciseName}>{currentExercise.name}</div>

        {currentExercise.needsWeight && !isLastSet && (
          <div className={styles.weightInput}>
            <input
              type='text'
              placeholder='Введите вес, кг'
              value={weight}
              onChange={e => setWeight(e.target.value)}
              className={styles.input}
            />
            <button className={styles.weightButton} onClick={() => console.log(weight)}>
              +
            </button>
          </div>
        )}

        <div className={styles.progressContainer}>
          <svg className={styles.progressRing} width='150' height='150'>
            <circle className={styles.progressRingBackground} cx='75' cy='75' r='63.75' />
            <circle
              className={styles.progressRingCircle}
              cx='75'
              cy='75'
              r='63.75'
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className={styles.progressContent}>
            <div className={styles.setCounter}>
              {currentSet - 1}/{currentExercise.sets}
            </div>
          </div>
        </div>

        {/* Инфо под прогрессом */}
        <div className={styles.progressInfo}>
          <div className={styles.infoLabel}>количество подходов</div>
        </div>

        {/* Кнопки действий */}
        <div className={styles.actions}>
          <Button onClick={handleComplete}>{isLastSet ? 'Сет выполнен' : 'Упражнение выполнено'}</Button>
          <Button buttonType='secondary' onClick={handleSkip}>
            Упражнение не смог выполнить
          </Button>
        </div>
      </div>
    </div>
  );
};
