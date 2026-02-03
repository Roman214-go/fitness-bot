import React, { useState } from 'react';

import dayjs from 'dayjs';
import { CalorieChart } from '../../common/components/CalorieChart/CalorieChart';
import { FaAward } from 'react-icons/fa6';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import styles from './ProfilePage.module.scss';
import Button from '../../common/components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { WeightPrediction } from '../../common/components/WeightScale/WeightScale';
import { Achievement } from '../../common/components/Achievement/Achievement';
import { LiaAwardSolid } from 'react-icons/lia';
import { useAppSelector } from '../../common/store/hooks';
import { coachSpeech } from '../../common/constants/coachSpeech';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState(0);

  const { userData } = useAppSelector(state => state.auth);

  const handleOpenSpeech = () => {
    setIsOpen(true);
  };

  const segments = [
    { id: 1, value: userData?.nutrition.proteins, color: '#2563EB', label: 'Белки' },
    { id: 2, value: userData?.nutrition.fats, color: '#F59E0B', label: 'Жиры' },
    { id: 3, value: userData?.nutrition.carbohydrates, color: '#10B981', label: 'Углеводы' },
  ];

  const goalLabels: Record<string, string> = {
    muscle_gain: 'Набор мышечной массы',
    maintain_form: 'Поддержание формы',
    weight_loss: 'Похудение',
    back_pain_relief: 'Снятие боли в спине',
    posture_correction: 'Коррекция осанки',
  };

  const achievements = [
    {
      id: 1,
      title: 'Сила',
      description: 'Дается за 30 успешно выполненных тренировок',
      icon: <LiaAwardSolid fontSize={40} />,
      isUnlocked: true,
    },
    {
      id: 2,
      title: 'Сила',
      description: 'Дается за 30 успешно выполненных тренировок',
      icon: <LiaAwardSolid fontSize={40} />,
      isUnlocked: true,
    },
    {
      id: 3,
      title: 'Сила',
      description: 'Дается за 30 успешно выполненных тренировок',
      icon: <LiaAwardSolid fontSize={40} />,
      isUnlocked: false,
    },
    {
      id: 4,
      title: 'Сила',
      description: 'Дается за 30 успешно выполненных тренировок',
      icon: <LiaAwardSolid fontSize={40} />,
      isUnlocked: true,
    },
    {
      id: 5,
      title: 'Сила',
      description: 'Дается за 30 успешно выполненных тренировок',
      icon: <LiaAwardSolid fontSize={40} />,
      isUnlocked: false,
    },
    {
      id: 6,
      title: 'Сила',
      description: 'Дается за 30 успешно выполненных тренировок',
      icon: <LiaAwardSolid fontSize={40} />,
      isUnlocked: true,
    },
  ];

  const userGoals = React.useMemo(() => {
    if (!userData?.fitness_goals) return [];

    return [userData.fitness_goals.goal, ...(userData.fitness_goals.optional_goal || [])];
  }, [userData]);

  const speechesForUser = coachSpeech.filter(speech => userGoals.includes(speech.goal));

  const daysWithUs = userData?.created_at ? dayjs().diff(dayjs(userData.created_at), 'day') : null;

  const handlePrev = () => {
    setCurrentSpeech(prev => (prev === 0 ? speechesForUser.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSpeech(prev => (prev === speechesForUser.length - 1 ? 0 : prev + 1));
  };

  const currentSpeechs = speechesForUser[currentSpeech] || null;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContent}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {userData?.photo_url ? (
              <img src={userData?.photo_url} alt='Avatar' className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarCircle} />
            )}

            <div className={styles.editAvatar}>
              <FaAward />
            </div>
          </div>

          <h2>{userData?.first_name}</h2>
          <p className={styles.subtitle}>Уровень подписки</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{userData?.anthropometric_data.age} лет</div>
            <div className={styles.statLabel}>Возраст</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{userData?.anthropometric_data.height} см</div>
            <div className={styles.statLabel}>Рост</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{userData?.anthropometric_data.weight} кг</div>
            <div className={styles.statLabel}>Вес</div>
          </div>
        </div>

        <div className={styles.trainees}>
          <div className={styles.trainee}>
            <div className={styles.trainee_labelContainer}>
              <p>Цель</p>
            </div>
            <p style={{ color: '#E2F163' }}>{goalLabels[userData?.fitness_goals?.goal] || '—'}</p>
          </div>

          <div className={styles.trainee}>
            <div className={styles.trainee_labelContainer}>
              <p>Срок подписки</p>
            </div>
            <p style={{ color: '#E2F163' }}>дд.мм.гггг</p>
          </div>
          <div className={styles.trainee}>
            <div className={styles.trainee_labelContainer}>
              <p>Дней с нами</p>
            </div>
            <p style={{ color: '#E2F163' }}>{daysWithUs !== null ? `${daysWithUs} дней` : '—'}</p>{' '}
          </div>
        </div>

        {isOpen && (
          <div className={styles.overlay} onClick={() => setIsOpen(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {speechesForUser.length > 1 && <FaChevronLeft onClick={handlePrev} style={{ cursor: 'pointer' }} />}

                <h2>Прогноз по {currentSpeechs?.title}</h2>
                {speechesForUser.length > 1 && <FaChevronRight onClick={handleNext} style={{ cursor: 'pointer' }} />}
              </div>

              <p>{currentSpeechs?.text}</p>
            </div>
          </div>
        )}
        <Button onClick={() => navigate('/profile-edit')}>Редактировать профиль</Button>

        <CalorieChart totalCalories={userData?.nutrition.calories} segments={segments} />
        <div className={styles.coach_speech} onClick={handleOpenSpeech}>
          Наставление тренера
        </div>
        <WeightPrediction value={70} />
        <h2 className={styles.achievements_title}>Личные достижения</h2>
        <div className={styles.achievements}>
          {achievements.map(item => (
            <Achievement
              key={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
              isUnlocked={item.isUnlocked}
            />
          ))}
        </div>
        <Link
          to='/privacy'
          style={{ color: '#4e4e4e', marginTop: '20px', textAlign: 'right', textDecoration: 'underline' }}
        >
          Политика конфиденциальности
        </Link>
      </div>
    </div>
  );
};
