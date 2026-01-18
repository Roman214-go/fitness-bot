import React from 'react';

import { CalorieChart } from '../../common/components/CalorieChart/CalorieChart';
import { FaAward } from 'react-icons/fa6';

import styles from './ProfilePage.module.scss';
import Button from '../../common/components/Button';
import { useNavigate } from 'react-router-dom';
import { WeightPrediction } from '../../common/components/WeightScale/WeightScale';
import { Achievement } from '../../common/components/Achievement/Achievement';
import { LiaAwardSolid } from 'react-icons/lia';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const segments = [
    { id: 1, value: 100, color: '#2563EB', label: 'Белки' },
    { id: 2, value: 50, color: '#F59E0B', label: 'Жиры' },
    { id: 3, value: 200, color: '#10B981', label: 'Углеводы' },
  ];
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
  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContent}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            <div className={styles.avatarCircle} />
            <div className={styles.editAvatar}>
              <FaAward />
            </div>
          </div>
          <h2>Роман</h2>
          <p className={styles.subtitle}>Уровень подписки</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>23 лет</div>
            <div className={styles.statLabel}>Возраст</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>175 см</div>
            <div className={styles.statLabel}>Рост</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>69 кг</div>
            <div className={styles.statLabel}>Вес</div>
          </div>
        </div>

        <div className={styles.trainees}>
          <div className={styles.trainee}>
            <div className={styles.trainee_labelContainer}>
              <p>Массонабор</p>
            </div>
            <p style={{ color: '#E2F163' }}>цель</p>
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
            <p style={{ color: '#E2F163' }}>н дней</p>
          </div>
        </div>

        <Button onClick={() => navigate('/profile-edit')}>Редактировать профиль</Button>

        <CalorieChart totalCalories={2500} segments={segments} />
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
      </div>
    </div>
  );
};
