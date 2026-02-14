import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import Button from '../../common/components/Button';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import styles from './HomeworkPage.module.scss';
import { useCompleteSetMutation, useCompleteWorkoutMutation } from '../TrainingPage/api/getTrainee';
import { FaChevronDown } from 'react-icons/fa';
import { useGetAllHomeworkQuery } from './api/getHomework';
import { ErrorScreen } from '../ErrorScreen/ErrorScreen';
import Loader from '../../common/components/Loader';

export const HomeworkPage: React.FC = () => {
  const { data: homeworkData, isLoading, error } = useGetAllHomeworkQuery();
  const navigate = useNavigate();

  const [completeSet] = useCompleteSetMutation();
  const [completeWorkout] = useCompleteWorkoutMutation();

  const [timer, setTimer] = useState(0);
  const [currentHomeworkIndex, setCurrentHomeworkIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
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
  if (isLoading) return <Loader />;
  if (error) return <ErrorScreen isBackButton message={'Ошибка получения домашнего задания'} />;
  if (!homeworkData || homeworkData.length === 0)
    return <ErrorScreen isBackButton message={'Домашнее задание отсутствует'} />;

  const currentHomework = homeworkData[currentHomeworkIndex];
  const currentExercise = currentHomework.personal_exercises[currentExerciseIndex];

  const totalExercises = currentHomework.personal_exercises.length;
  const isLastExercise = currentExerciseIndex === totalExercises - 1;
  const isLastHomework = currentHomeworkIndex === homeworkData.length - 1 && isLastExercise;
  const allExercises = homeworkData.flatMap(homework => homework.personal_exercises);

  const totalExercisesGlobal = allExercises.length;
  const currentExerciseGlobalIndex =
    homeworkData.slice(0, currentHomeworkIndex).reduce((acc, hw) => acc + hw.personal_exercises.length, 0) +
    currentExerciseIndex +
    1;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = async () => {
    try {
      toast('Обновляем прогресс...');
      if (isLastExercise) {
        await completeSet(currentHomework.id).unwrap();
        toast.success('Сет завершён!');
      }

      if (!isLastExercise) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else if (!isLastHomework) {
        setCurrentHomeworkIndex(currentHomeworkIndex + 1);
        setCurrentExerciseIndex(0);
      } else {
        await completeWorkout(currentHomework.id).unwrap();
        toast.success('Домашнее задание завершено!');
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        setIsCompleted(true);
        setTimeout(() => navigate('/calendar'), 3000);
      }
    } catch (err) {
      console.error(err);
      toast.error('Ошибка при завершении упражнения');
    }
  };

  const handleSkip = () => {
    if (!isLastExercise) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else if (!isLastHomework) {
      setCurrentHomeworkIndex(currentHomeworkIndex + 1);
      setCurrentExerciseIndex(0);
    } else {
      setIsCompleted(true);
      setTimeout(() => navigate('/calendar'), 2500);
    }
  };

  const progress = (currentExerciseGlobalIndex / totalExercisesGlobal) * 100;
  const strokeDasharray = 2 * Math.PI * 63.75;
  const strokeDashoffset = strokeDasharray - (progress / 100) * strokeDasharray;

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
              maxHeight: open ? '1200px' : '100px',
              overflowY: 'auto',
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
              {currentExerciseGlobalIndex}/{totalExercisesGlobal}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button onClick={handleNext}>Следующее упражнение</Button>
          <Button buttonType='secondary' onClick={handleSkip}>
            Пропустить
          </Button>
        </div>
      </div>

      <ToastContainer theme='light' hideProgressBar autoClose={3000} style={{ position: 'absolute' }} />
    </div>
  );
};
