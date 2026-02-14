import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import Button from '../../common/components/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { Id, ToastContainer, toast } from 'react-toastify';
import styles from './WorkoutPage.module.scss';
import {
  useCompleteExerciseMutation,
  useCompleteSetMutation,
  useCompleteWorkoutMutation,
  useIncompleteExerciseMutation,
} from '../TrainingPage/api/getTrainee';
import { FaChevronDown } from 'react-icons/fa';
import { MdArrowBackIos } from 'react-icons/md';

interface PersonalExercise {
  id: number;
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
  is_cycle_completed: boolean;
  repetitions: number;
  personal_sets: PersonalSet[];
}

export const WorkoutPage: React.FC = () => {
  const location = useLocation();
  const { workout, workout_date } = location.state as { workout: Workout; workout_date: { id: number } };
  const [showNotificationButton, setShowNotificationButton] = useState(workout.is_cycle_completed);
  const toastIdRef = useRef<Id | null>(null);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [completeSet, { isLoading: isCompleting }] = useCompleteSetMutation();
  const [completeWorkout, { isLoading: isCompletingWorkout }] = useCompleteWorkoutMutation();
  const [completeExercise] = useCompleteExerciseMutation();
  const [incompleteExercise] = useIncompleteExerciseMutation();

  const [timer, setTimer] = useState<number>(0);
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [weight, setWeight] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const allExercises = workout.personal_sets.flatMap(set => set.personal_exercises);

  const totalExercises = allExercises.length;
  const currentSet = workout.personal_sets[currentSetIndex];
  const currentExercise = currentSet.personal_exercises[currentExerciseIndex];
  const currentExerciseGlobalIndex =
    workout.personal_sets.slice(0, currentSetIndex).reduce((acc, set) => acc + set.personal_exercises.length, 0) +
    currentExerciseIndex +
    1;

  const totalExercisesInSet = currentSet.personal_exercises.length;
  const progress = (currentExerciseGlobalIndex / totalExercises) * 100;

  const isLastExerciseInSet = currentExerciseIndex === totalExercisesInSet - 1;
  const isLastSet = currentSetIndex === workout.personal_sets.length - 1 && isLastExerciseInSet;
  const timerRef = useRef(null);

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
      await completeExercise({
        exerciseId: currentExercise.id,
        weight: weight ? Number(weight) : undefined,
      }).unwrap();

      if (isLastExerciseInSet) {
        await completeSet(currentSet.id).unwrap();
      }

      if (!isLastExerciseInSet) {
        setCurrentExerciseIndex(prev => prev + 1);
      } else if (!isLastSet) {
        setCurrentSetIndex(prev => prev + 1);
        setCurrentExerciseIndex(0);
      } else {
        await completeWorkout(workout_date.id).unwrap();
        toast.success('Тренировка завершена!');
        if (timerRef.current) clearInterval(timerRef.current);
        setIsCompleted(true);
        setTimeout(() => navigate('/calendar'), 3000);
        return;
      }

      setWeight('');
    } catch {
      toast.error('Не удалось завершить упражнение');
    }
  };

  const handleSkip = async () => {
    try {
      await incompleteExercise({ exerciseId: currentExercise.id });
      if (!isLastExerciseInSet) {
        setCurrentExerciseIndex(prev => prev + 1);
      } else if (!isLastSet) {
        setCurrentSetIndex(prev => prev + 1);
        setCurrentExerciseIndex(0);
      } else {
        await completeWorkout(workout_date.id).unwrap();
        toast.success('Тренировка завершена!');
        if (timerRef.current) clearInterval(timerRef.current);
        setIsCompleted(true);
        setTimeout(() => navigate('/calendar'), 3000);
        return;
      }
    } catch {
      toast.error('Не удалось завершить упражнение');
    }
  };

  const strokeDasharray = 2 * Math.PI * 63.75;
  const strokeDashoffset = strokeDasharray - (progress / 100) * strokeDasharray;

  useEffect(() => {
    if (currentExercise?.weight_kg) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWeight(String(currentExercise.weight_kg));
    } else {
      setWeight('');
    }
  }, [currentExercise]);

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
              maxHeight: open ? '1200px' : '120px',
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
              overflow: 'auto',
              transition: 'max-height 0.3s ease',
              marginTop: '8px',
            }}
          >
            <p style={{ color: '#8F9AA2', textAlign: 'start', lineHeight: 1.2 }}>{currentExercise.description}</p>
          </div>
        </div>

        <div>
          <p
            style={{ color: '#8F9AA2', marginBottom: '10px', marginLeft: '10px', fontSize: '14px', textAlign: 'start' }}
          >
            При использовании веса в упражнении, введите его ниже в кг
          </p>
          <div className={styles.weightInput}>
            <input
              className={styles.input}
              type='number'
              min={0}
              step={0.5}
              value={weight}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.currentTarget.value)}
            />
          </div>
        </div>

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
              {currentExerciseGlobalIndex}/{totalExercises}
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
      )}{' '}
    </div>
  );
};
