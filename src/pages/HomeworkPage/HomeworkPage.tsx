import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

import Button from '../../common/components/Button';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaChevronDown } from 'react-icons/fa';
import { useCompleteHomeworkMutation, useGetAllHomeworkQuery, useGetHomeworkByIdQuery } from './api/getHomework';
import { ErrorScreen } from '../ErrorScreen/ErrorScreen';
import Loader from '../../common/components/Loader';

import styles from './HomeworkPage.module.scss';

export const HomeworkPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: homeworkList, isLoading: isHomeworkListLoading, error: homeworkListError } = useGetAllHomeworkQuery();

  const personalHomeworkId = homeworkList?.[0]?.personal_homework_id;

  const {
    data: homeworkData,
    isLoading: isHomeworkLoading,
    error: homeworkError,
  } = useGetHomeworkByIdQuery(personalHomeworkId!, {
    skip: !personalHomeworkId,
  });

  const [completeHomework] = useCompleteHomeworkMutation();

  const [timer, setTimer] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [open, setOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (isHomeworkListLoading || isHomeworkLoading) return <Loader />;

  if (homeworkListError || homeworkError) {
    return <ErrorScreen isBackButton message='Ошибка получения домашнего задания' />;
  }

  if (!homeworkData || homeworkData.personal_exercises.length === 0) {
    return <ErrorScreen isBackButton message='Домашнее задание отсутствует' />;
  }

  // Количество упражнений
  const exercisesCount = homeworkData.personal_exercises.length;

  // Текущее упражнение определяется циклически
  let currentExerciseIndex = currentRound % exercisesCount;
  let currentRoundNum = Math.floor(currentRound / exercisesCount);

  // Пропускаем завершенные упражнения
  let attempts = 0;
  let tempRound = currentRound;
  while (attempts < exercisesCount && currentRoundNum >= homeworkData.personal_exercises[currentExerciseIndex].sets) {
    tempRound++;
    currentExerciseIndex = tempRound % exercisesCount;
    currentRoundNum = Math.floor(tempRound / exercisesCount);
    attempts++;
  }

  const currentExercise = homeworkData.personal_exercises[currentExerciseIndex];

  // Общее количество подходов = сумма всех sets
  const totalSets = homeworkData.personal_exercises.reduce((sum, ex) => sum + ex.sets, 0);

  // Подсчет номера текущего подхода (учитывая только выполненные)
  let currentSetNumber = 0;
  for (let i = 0; i <= tempRound; i++) {
    const exIndex = i % exercisesCount;
    const round = Math.floor(i / exercisesCount);
    const exercise = homeworkData.personal_exercises[exIndex];
    if (round < exercise.sets) {
      currentSetNumber++;
    }
  }

  const isHomeworkCompleted = currentSetNumber >= totalSets;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = async () => {
    try {
      if (isHomeworkCompleted) {
        await completeHomework(homeworkList?.[0].id);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setIsCompleted(true);
        setTimeout(() => navigate('/calendar'), 3000);
      } else {
        // Переходим к следующему раунду
        let nextRound = tempRound + 1;

        // Пропускаем уже завершенные упражнения
        let nextExIndex = nextRound % exercisesCount;
        let nextRoundNum = Math.floor(nextRound / exercisesCount);
        let skipped = 0;

        while (skipped < exercisesCount && nextRoundNum >= homeworkData.personal_exercises[nextExIndex].sets) {
          nextRound++;
          nextExIndex = nextRound % exercisesCount;
          nextRoundNum = Math.floor(nextRound / exercisesCount);
          skipped++;
        }

        setCurrentRound(nextRound);
      }
    } catch {
      toast.error('Ошибка при завершении упражнения');
    }
  };

  const strokeDasharray = 2 * Math.PI * 63.75;
  const radius = 63.75;
  const circumference = 2 * Math.PI * radius;

  // Прогресс подходов
  const setProgress = (currentSetNumber / totalSets) * 100;
  const setStrokeDashoffset = circumference - (setProgress / 100) * circumference;

  if (isCompleted) {
    return (
      <div className={styles.container}>
        <div className={styles.completedCard}>
          <h1 className={styles.completedTitle}>🎉 Домашнее задание завершено!</h1>
          <p className={styles.completedTime}>Время: {formatTime(timer)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Домашнее задание</span>
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
            <div onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
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
            <p
              style={{ color: '#8F9AA2', textAlign: 'start', lineHeight: 1.2, visibility: open ? 'visible' : 'hidden' }}
            >
              {currentExercise.description}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div className={styles.progressContainer}>
            <svg className={styles.progressRing} width='150' height='150'>
              <circle className={styles.progressRingBackground} cx='75' cy='75' r='63.75' />
              <circle
                className={styles.progressRingCircle}
                cx='75'
                cy='75'
                r='63.75'
                strokeDasharray={circumference}
                strokeDashoffset={setStrokeDashoffset}
              />
            </svg>

            <div className={styles.progressContent}>
              <p
                style={{
                  fontSize: '14px',
                  position: 'absolute',
                  marginLeft: '10px',
                  top: '-15px',
                  color: '#666',
                  lineHeight: 0.7,
                }}
              >
                подходы
              </p>
              <div className={styles.setCounter}>
                {currentSetNumber}/{totalSets}
              </div>
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
              />
            </svg>

            <div className={styles.progressContent}>
              <p
                style={{
                  fontSize: '14px',
                  position: 'absolute',
                  marginLeft: '10px',
                  top: '-15px',
                  color: '#666',
                  lineHeight: 0.7,
                }}
              >
                выполнять
              </p>
              <div className={styles.setCounter}>{currentExercise.duration_seconds} c</div>
            </div>
          </div>
        </div>
        <div className={styles.progressInfo}>
          <div className={styles.infoLabel}>Рекомендуем отдыхать 2-3 минуты между подходами</div>
        </div>

        <div className={styles.actions}>
          <Button onClick={handleNext}>{isHomeworkCompleted ? 'Завершить' : 'Подход выполнен'}</Button>
        </div>
      </div>

      <ToastContainer theme='light' hideProgressBar autoClose={3000} style={{ position: 'absolute' }} />
    </div>
  );
};
