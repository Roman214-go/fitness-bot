import React, { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import { CalorieChart } from '../../common/components/CalorieChart/CalorieChart';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import styles from './ProfilePage.module.scss';
import Button from '../../common/components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { WeightPrediction } from '../../common/components/WeightScale/WeightScale';
import { Achievement } from '../../common/components/Achievement/Achievement';
import { LiaAwardSolid } from 'react-icons/lia';
import { useAppSelector, useAppDispatch } from '../../common/store/hooks';
import { coachSpeech } from '../../common/constants/coachSpeech';
import { fetchAchievements, fetchMyAchievements, fetchMyMainAchievement } from './api/achievementsSlice';
import { process } from '../../common/constants/process';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState(0);

  const { userData } = useAppSelector(state => state.auth);
  const {
    achievements,
    myAchievements,
    myMainAchievement,
    loading: achievementsLoading,
  } = useAppSelector(state => state.achievements);

  const telegramId = userData?.telegram_id;

  const myAchievementIds = new Set(myAchievements.map(a => a.achievement_id));

  const mergedAchievements = achievements.map(achievement => ({
    ...achievement,
    isUnlocked: myAchievementIds.has(achievement.id),
  }));

  useEffect(() => {
    if (telegramId && userData.subscription) {
      dispatch(fetchAchievements({ telegramId, includeInactive: false }));
      dispatch(fetchMyAchievements({ telegramId }));
      dispatch(fetchMyMainAchievement({ telegramId }));
    }
  }, [dispatch, telegramId, userData?.subscription]);

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

  const openFitnessAdminPanel = () => {
    try {
      if (!window.Telegram?.WebApp) {
        alert('Эта функция доступна только в Telegram');
        return;
      }

      const tg = window.Telegram.WebApp;
      const user = tg.initDataUnsafe?.user;

      if (!user) {
        alert('Не удалось получить данные пользователя из Telegram');
        return;
      }

      const authData = {
        telegram_id: user.id,
        username: user.username || null,
        first_name: user.first_name || 'Name',
        last_name: user.last_name || null,
        language_code: user.language_code || 'ru',
      };

      const token = encodeURIComponent(JSON.stringify(authData));

      const baseUrl = window.location.origin;
      const adminUrl = `${baseUrl}/api/admin/users/dashboard?token=${token}`;

      window.open(adminUrl, '_blank');
    } catch (error) {
      console.error('Ошибка при открытии админ панели:', error);
      alert('Произошла ошибка при открытии админ панели');
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContent}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {userData?.photo_url ? (
              <img
                src={`${process.env.REACT_APP_BASE_EMPTY_URL}/static/${userData?.photo_url}`}
                alt='Avatar'
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarCircle} />
            )}
            {myMainAchievement?.photo_url ? (
              <div className={styles.editAvatar}>
                <img
                  className={styles.achievementImage}
                  src={`${process.env.REACT_APP_BASE_EMPTY_URL}/static/${myMainAchievement?.photo_url}`}
                />
              </div>
            ) : null}
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
        {userData?.role.name === 'admin' ? (
          <button className={styles.adminLink} onClick={openFitnessAdminPanel}>
            Перейти на админ панель
          </button>
        ) : null}
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
            <p style={{ color: '#E2F163' }}>{daysWithUs !== null ? `${daysWithUs} дней` : '—'}</p>
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
        {userData?.fitness_goals.goal === 'weight_loss' ? (
          <WeightPrediction value={userData.weight_loss_forecast.target_weight_month} />
        ) : null}

        {userData?.subscription ? (
          <>
            <h2 className={styles.achievements_title}>Доступные достижения</h2>

            {achievementsLoading ? (
              <div className={styles.achievementsLoading}>Загрузка достижений...</div>
            ) : (
              <div className={styles.achievements}>
                {mergedAchievements.map(item => (
                  <Achievement
                    key={item.id}
                    achievementId={item.id}
                    title={item.name}
                    description={item.description}
                    photoUrl={`${process.env.REACT_APP_BASE_EMPTY_URL}/static/${item.photo_url}`}
                    icon={<LiaAwardSolid fontSize={40} />}
                    isUnlocked={item.isUnlocked}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}

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
