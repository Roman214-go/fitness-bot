import React, { useMemo } from 'react';
import styles from './LeadersPage.module.scss';
import { useGetLeaderboardQuery, useGetUserStatsQuery } from './api/leaderboardSlice';
import { useAppSelector } from '../../common/store/hooks';

export const LeadersPage: React.FC = () => {
  const { userData } = useAppSelector(state => state.auth);

  const { data: leaderboard = [], isLoading } = useGetLeaderboardQuery(20);

  const { data: userStats } = useGetUserStatsQuery({
    userId: userData?.id,
    telegramId: userData?.telegram_id,
  });

  const isUserInTop20 = leaderboard.some(user => user.user_id === userData?.id);

  const users = useMemo(() => {
    if (isUserInTop20 || !userStats) {
      return leaderboard;
    }

    return [
      ...leaderboard,
      {
        user_id: userData?.id,
        position: userStats.global_position,
        total_points: userStats.total_points_earned,
        username: 'Вы',
        first_name: null,
        last_name: null,
        photoUrl: undefined,
      },
    ];
  }, [isUserInTop20, userStats, leaderboard, userData?.id]);

  const topThree = users
    .filter(user => user.position <= 3)
    .sort((a, b) => {
      const order = [2, 1, 3];
      return order.indexOf(a.position) - order.indexOf(b.position);
    });

  const otherUsers = users.filter(user => user.position > 3);

  const getPlaceClass = (place: number) => {
    switch (place) {
      case 1:
        return styles.firstPlace;
      case 2:
        return styles.secondPlace;
      case 3:
        return styles.thirdPlace;
      default:
        return '';
    }
  };

  const getBadgeClass = (place: number) => {
    switch (place) {
      case 2:
        return `${styles.badge} ${styles.secondBadge}`;
      case 3:
        return `${styles.badge} ${styles.thirdBadge}`;
      default:
        return styles.badge;
    }
  };

  if (isLoading) {
    return <div className={styles.container}>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>Гонка за лидерством</header>

      <div className={styles.podiumSection}>
        {topThree.map(user => (
          <div key={user.user_id} className={styles.podiumItem}>
            <div className={styles.avatarContainer}>
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.username ?? 'user'}
                  className={`${styles.avatar} ${getPlaceClass(user.position)}`}
                />
              ) : (
                <div className={`${styles.avatar} ${getPlaceClass(user.position)}`} />
              )}
              <div className={getBadgeClass(user.position)}>{user.position}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.leaderboardList}>
        <div className={styles.table_header}>
          <span>Место</span>
          <span>Очки</span>
        </div>

        {otherUsers.map(user => {
          const isCurrentUser = user.user_id === userData?.id;

          return (
            <div key={user.user_id} className={`${styles.listItem} ${isCurrentUser ? styles.currentUser : ''}`}>
              <span className={styles.rank}>{user.position}</span>

              {user.photoUrl ? (
                <img src={user.photoUrl} alt={user.username ?? 'user'} className={styles.listAvatar} />
              ) : (
                <div className={styles.listAvatar} />
              )}

              <span className={styles.nickname}>{isCurrentUser ? 'Вы' : user.username || 'Без имени'}</span>

              <span className={styles.score}>{user.total_points}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
