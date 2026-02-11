import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import Button from '../../common/components/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import styles from './WorkoutPage.module.scss';
import { useCompleteSetMutation, useCompleteWorkoutMutation } from '../TrainingPage/api/getTrainee';
import { FaChevronDown } from 'react-icons/fa';

interface PersonalExercise {
  name: string;
  reps: number;
  description: string;
  weight_kg?: number;
  video_url: string;
}

interface PersonalSet {
  personal_workout_id: number;
  id: number;
  color_code: string;
  personal_exercises: PersonalExercise[];
}

interface Workout {
  repetitions: number;
  personal_sets: PersonalSet[];
}

export const WorkoutPage: React.FC = () => {
  const location = useLocation();
  const { workout, workout_date } = location.state as { workout: Workout; workout_date: { id: number } };

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [completeSet, { isLoading: isCompleting }] = useCompleteSetMutation();
  const [completeWorkout, { isLoading: isCompletingWorkout }] = useCompleteWorkoutMutation();

  const [timer, setTimer] = useState<number>(0);
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [weight, setWeight] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentSet = workout.personal_sets[currentSetIndex];
  const currentExercise = currentSet.personal_exercises[currentExerciseIndex];

  const totalExercisesInSet = currentSet.personal_exercises.length;
  const progress = (currentExerciseIndex / totalExercisesInSet) * 100;

  const isLastExerciseInSet = currentExerciseIndex === totalExercisesInSet - 1;
  const isLastSet = currentSetIndex === workout.personal_sets.length - 1 && isLastExerciseInSet;
  const timerRef = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    try {
      toast('Завершаем упражнение...');

      if (isLastExerciseInSet) {
        await completeSet(currentSet.id).unwrap();
        toast.success('Сет завершён!');
      }

      if (!isLastExerciseInSet) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setWeight('');
      } else if (!isLastSet) {
        setCurrentSetIndex(currentSetIndex + 1);
        setCurrentExerciseIndex(0);
        setWeight('');
      } else {
        // теперь используем workout_date.id
        console.log(workout);

        await completeWorkout(workout_date.id).unwrap();
        toast.success('Тренировка завершена!');
        if (timerRef.current) clearInterval(timerRef.current);

        setIsCompleted(true);
        setTimeout(() => navigate('/calendar'), 3000);
      }
    } catch (err) {
      console.error(err);
      toast.error('Не удалось завершить упражнение или тренировку');
    }
  };

  const handleSkip = () => {
    if (!isLastExerciseInSet) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setWeight('');
    } else if (!isLastSet) {
      setCurrentSetIndex(currentSetIndex + 1);
      setCurrentExerciseIndex(0);
      setWeight('');
    } else {
      setIsCompleted(true);
      setTimeout(() => navigate('/calendar'), 2500);
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
      <div className={styles.card} style={{ borderColor: currentSet.color_code }}>
        <div className={styles.header}>
          <div />
          <span className={styles.headerTitle}>
            Сет {currentSetIndex + 1}/{workout.personal_sets.length}
          </span>
          <span className={styles.timer}>{formatTime(timer)}</span>
        </div>

        <ReactPlayer controls style={{ width: '100%', height: '35vh' }} src={currentExercise.video_url} />

        <div className={styles.exerciseContainer}>
          <div
            className={styles.exerciseName}
            style={{
              maxHeight: open ? '1200px' : '10px',
            }}
          >
            <p>{currentExercise.name}</p>
            <div
              onClick={() => setOpen(!open)}
              style={{
                cursor: 'pointer',
              }}
            >
              <FaChevronDown
                color='#e2f163'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 0.3s',
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </div>
          </div>
          <div
            style={{
              maxHeight: open ? '200px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
              marginTop: '8px',
            }}
          >
            <p style={{ color: '#8F9AA2', textAlign: 'start', lineHeight: 2 }}>{currentExercise.description}</p>
          </div>
        </div>

        {currentExercise.weight_kg && (
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
            <p style={{ fontSize: '14px', position: 'absolute', top: '-15px', color: '#666', lineHeight: 0.7 }}>
              подходы
            </p>
            <div className={styles.setCounter}>
              {currentExerciseIndex}/{totalExercisesInSet}
            </div>
          </div>
        </div>

        <div className={styles.progressInfo}>
          <div className={styles.infoLabel}>Рекомендуем отдыхать 2-3 минуты между подходами</div>
        </div>

        <div className={styles.actions}>
          <Button onClick={handleComplete} disabled={isCompleting || isCompletingWorkout}>
            {isLastExerciseInSet ? 'Сет выполнен' : 'Упражнение выполнено'}
          </Button>

          <Button buttonType='secondary' onClick={handleSkip}>
            Пропустить упражнение
          </Button>
        </div>
      </div>

      <ToastContainer theme='light' hideProgressBar autoClose={3000} style={{ position: 'absolute' }} />
    </div>
  );
};
