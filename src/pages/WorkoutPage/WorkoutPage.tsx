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
import { Tooltip } from 'react-tooltip';

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
  const [currentRoundInSet, setCurrentRoundInSet] = useState<number>(0);
  const [weight, setWeight] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentSet = workout.personal_sets[currentSetIndex];

  // Количество упражнений в сете
  const exercisesCount = currentSet.personal_exercises.length;

  // Общее количество подходов в сете = сумма всех reps
  const totalRepsInSet = currentSet.personal_exercises.reduce((sum, ex) => sum + ex.reps, 0);

  // Находим текущее упражнение, пропуская завершенные
  let currentExerciseIndex = currentRoundInSet % exercisesCount;
  let currentRound = Math.floor(currentRoundInSet / exercisesCount);

  // Пропускаем завершенные упражнения
  let attempts = 0;
  while (attempts < exercisesCount && currentRound >= currentSet.personal_exercises[currentExerciseIndex].reps) {
    currentRoundInSet++;
    currentExerciseIndex = currentRoundInSet % exercisesCount;
    currentRound = Math.floor(currentRoundInSet / exercisesCount);
    attempts++;
  }

  const currentExercise = currentSet.personal_exercises[currentExerciseIndex];

  // Проверяем, не превышает ли текущий раунд количество reps для данного упражнения
  const isExerciseCompleted = currentRound >= currentExercise.reps;

  // Подсчет номера текущего подхода (учитывая только выполненные)
  let currentRepNumber = 0;
  for (let i = 0; i <= currentRoundInSet; i++) {
    const exIndex = i % exercisesCount;
    const round = Math.floor(i / exercisesCount);
    const exercise = currentSet.personal_exercises[exIndex];
    if (round < exercise.reps) {
      currentRepNumber++;
    }
  }

  // Сет завершен когда currentRepNumber достиг totalRepsInSet
  const isSetCompleted = currentRepNumber >= totalRepsInSet;
  const isLastSet = currentSetIndex === workout.personal_sets.length - 1;

  const timerRef = useRef(null);

  const radius = 63.75;
  const circumference = 2 * Math.PI * radius;

  // Прогресс подходов в сете
  const repProgress = (currentRepNumber / totalRepsInSet) * 100;
  const repStrokeDashoffset = circumference - (repProgress / 100) * circumference;

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
      // Выполняем API запрос только если упражнение еще не завершено
      if (!isExerciseCompleted) {
        await completeExercise({
          exerciseId: currentExercise.id,
          weight: weight ? Number(weight) : undefined,
        }).unwrap();
      }

      // Переходим к следующему раунду
      let nextRound = currentRoundInSet + 1;

      // Пропускаем уже завершенные упражнения
      let nextExIndex = nextRound % exercisesCount;
      let nextRoundNum = Math.floor(nextRound / exercisesCount);
      let skipped = 0;

      while (skipped < exercisesCount && nextRoundNum >= currentSet.personal_exercises[nextExIndex].reps) {
        nextRound++;
        nextExIndex = nextRound % exercisesCount;
        nextRoundNum = Math.floor(nextRound / exercisesCount);
        skipped++;
      }

      // Проверяем, завершен ли сет
      let completedCount = 0;
      for (let i = 0; i <= nextRound; i++) {
        const exIndex = i % exercisesCount;
        const round = Math.floor(i / exercisesCount);
        const exercise = currentSet.personal_exercises[exIndex];
        if (round < exercise.reps) {
          completedCount++;
        }
      }

      if (completedCount >= totalRepsInSet) {
        await completeSet(currentSet.id).unwrap();

        // Если это последний сет
        if (isLastSet) {
          await completeWorkout(workout_date.id).unwrap();
          toast.success('Тренировка завершена!');
          if (timerRef.current) clearInterval(timerRef.current);
          setIsCompleted(true);
          setTimeout(() => navigate('/calendar'), 3000);
          return;
        } else {
          // Переход к следующему сету
          setCurrentSetIndex(prev => prev + 1);
          setCurrentRoundInSet(0);
        }
      } else {
        setCurrentRoundInSet(nextRound);
      }

      setWeight('');
    } catch {
      toast.error('Не удалось завершить упражнение');
    }
  };

  const handleSkip = async () => {
    try {
      if (!isExerciseCompleted) {
        await incompleteExercise({ exerciseId: currentExercise.id });
      }

      // Переходим к следующему раунду
      let nextRound = currentRoundInSet + 1;

      // Пропускаем уже завершенные упражнения
      let nextExIndex = nextRound % exercisesCount;
      let nextRoundNum = Math.floor(nextRound / exercisesCount);
      let skipped = 0;

      while (skipped < exercisesCount && nextRoundNum >= currentSet.personal_exercises[nextExIndex].reps) {
        nextRound++;
        nextExIndex = nextRound % exercisesCount;
        nextRoundNum = Math.floor(nextRound / exercisesCount);
        skipped++;
      }

      // Проверяем, завершен ли сет
      let completedCount = 0;
      for (let i = 0; i <= nextRound; i++) {
        const exIndex = i % exercisesCount;
        const round = Math.floor(i / exercisesCount);
        const exercise = currentSet.personal_exercises[exIndex];
        if (round < exercise.reps) {
          completedCount++;
        }
      }

      if (completedCount >= totalRepsInSet) {
        if (isLastSet) {
          await completeWorkout(workout_date.id).unwrap();
          toast.success('Тренировка завершена!');
          if (timerRef.current) clearInterval(timerRef.current);
          setIsCompleted(true);
          setTimeout(() => navigate('/calendar'), 3000);
          return;
        } else {
          setCurrentSetIndex(prev => prev + 1);
          setCurrentRoundInSet(0);
        }
      } else {
        setCurrentRoundInSet(nextRound);
      }
    } catch {
      toast.error('Не удалось завершить упражнение');
    }
  };

  useEffect(() => {
    if (currentExercise?.weight_kg) {
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
            style={{
              color: '#8F9AA2',
              marginBottom: '10px',
              marginLeft: '10px',
              fontSize: '14px',
              textAlign: 'start',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            При использовании веса в упражнении введите его ниже в кг/lb/сек
            <span
              className={styles.tooltipIcon}
              data-tooltip-content='На первой тренировке следует правильно выбрать вес для всех упражнений. При тренировках на 8-12 повторений, подберите такой вес, чтобы вы чувствовали запас сил максимум на 1-2 повторения, после выполнения последнего повторения в подходе. Если вы опытный спортсмен, допускается доводить подход до "отказа" При тренировках на 15-19 повторений, подберите такой вес, чтобы последние 5-7 повторений подхода создавали нарастающий эффект "жжения" в тренируемых мышцах. Далее, когда стоит увеличить нагрузку, вам подскажет приложение, но при необходимости её можно изменить самостоятельно в любой момент. Если возникнут вопросы в любой момент можно написать тренеру.'
              data-tooltip-id='activity-tooltip'
              style={{ flexShrink: 0 }}
            >
              ?
            </span>
          </p>
          <Tooltip
            id='activity-tooltip'
            className={styles.tooltip}
            place='top'
            float={true}
            offset={8}
            positionStrategy='fixed'
          />
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
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {/* 🔵 Прогресс подходов в сете */}
          <div className={styles.progressContainer}>
            <svg className={styles.progressRing} width='150' height='150'>
              <circle className={styles.progressRingBackground} cx='75' cy='75' r='63.75' />
              <circle
                className={styles.progressRingCircle}
                cx='75'
                cy='75'
                r='63.75'
                strokeDasharray={circumference}
                strokeDashoffset={repStrokeDashoffset}
              />
            </svg>
            <div className={styles.progressContent}>
              <p style={{ fontSize: '14px', position: 'absolute', top: '-15px', color: '#666', lineHeight: 0.7 }}>
                подходы
              </p>
              <div className={styles.setCounter}>
                {currentRepNumber}/{totalRepsInSet}
              </div>
            </div>
          </div>

          {/* 🟢 Повторения текущего упражнения */}
          <div className={styles.progressContainer}>
            <svg className={styles.progressRing} width='150' height='150'>
              <circle cx='75' cy='75' r={radius} className={styles.progressRingBackground} />
              <circle
                cx='75'
                cy='75'
                r={radius}
                className={styles.progressRingCircleEx}
                strokeDasharray={circumference}
              />
            </svg>

            <div className={styles.progressContent}>
              <p style={{ fontSize: '14px', position: 'absolute', top: '-15px', color: '#666', lineHeight: 0.7 }}>
                повторения
              </p>
              <div className={styles.setCounter}>{workout.repetitions}</div>
            </div>
          </div>
        </div>

        <div className={styles.progressInfo}>
          <div className={styles.infoLabel}>Рекомендуем отдыхать 2-3 минуты между подходами</div>
        </div>

        <div className={styles.actions}>
          <Button onClick={handleComplete} disabled={isCompleting || isCompletingWorkout}>
            {isSetCompleted ? 'Сет выполнен' : 'Подход выполнен'}
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
