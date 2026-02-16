import React, { useMemo } from 'react';
import styles from './LeadersPage.module.scss';
import { useGetLeaderboardQuery, useGetUserStatsQuery } from './api/leaderboardSlice';
import { useAppSelector } from '../../common/store/hooks';
import { process } from '../../common/constants/process';

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
        photo_url: userData?.photo_url,
      },
    ];
  }, [isUserInTop20, userStats, leaderboard, userData?.id, userData?.photo_url]);

  const topThree = users
    .filter(user => user.position <= 3)
    .sort((a, b) => {
      const order = [2, 1, 3];
      return order.indexOf(a.position) - order.indexOf(b.position);
    });

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

  const getRankColorClass = (position: number) => {
    if (position === 1) return styles.goldRank;
    if (position === 2) return styles.silverRank;
    if (position === 3) return styles.bronzeRank;
    if (position >= 4 && position <= 5) return styles.turquoiseRank;
    if (position >= 6 && position <= 10) return styles.greenRank;
    if (position >= 11 && position <= 20) return styles.purpleRank;
    return '';
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
              {user.photo_url ? (
                <img
                  src={`${process.env.REACT_APP_BASE_EMPTY_URL}/static/${user?.photo_url}`}
                  alt={user.username ?? 'user'}
                  className={`${styles.avatar} ${getPlaceClass(user.position)}`}
                />
              ) : (
                <div className={`${styles.avatar} ${getPlaceClass(user.position)}`} />
              )}
              <div className={getBadgeClass(user.position)}>{user.position}</div>
            </div>
            <p style={{ fontSize: '12px', marginTop: '10px' }}>{user.total_points} очков</p>
          </div>
        ))}
      </div>

      <div className={styles.leaderboardList}>
        <div className={styles.table_header}>
          <span>Место</span>
          <span>Очки</span>
        </div>

        {users.map((user, index) => {
          const isCurrentUser = user.user_id === userData?.id;
          const nextUser = index < users.length - 1 ? users[index + 1] : null;

          // Show separator after specific positions (after 5th, 10th, and 20th place)
          const showTop5 = user.position === 5 && (!nextUser || nextUser.position > 5);
          const showTop10 = user.position === 10 && (!nextUser || nextUser.position > 10);
          const showTop20 = user.position === 20 && (!nextUser || nextUser.position > 20);

          return (
            <React.Fragment key={user.user_id}>
              <div className={`${styles.listItem} ${isCurrentUser ? styles.currentUser : ''}`}>
                <span className={`${styles.rank} ${getRankColorClass(user.position)}`}>{user.position}</span>

                {user.photo_url ? (
                  <img
                    src={`${process.env.REACT_APP_BASE_EMPTY_URL}/static/${user?.photo_url}`}
                    alt={user.username ?? 'user'}
                    className={styles.listAvatar}
                  />
                ) : (
                  <div className={styles.listAvatar} />
                )}

                <span className={styles.nickname}>{isCurrentUser ? 'Вы' : user.username || 'Без имени'}</span>

                <span className={`${styles.score} ${getRankColorClass(user.position)}`}>{user.total_points}</span>
              </div>

              {showTop5 && (
                <div className={`${styles.separator} ${styles.turquoiseSeparator}`}>
                  <span>ТОП 5</span>
                </div>
              )}
              {showTop10 && (
                <div className={`${styles.separator} ${styles.greenSeparator}`}>
                  <span>ТОП 10</span>
                </div>
              )}
              {showTop20 && (
                <div className={`${styles.separator} ${styles.purpleSeparator}`}>
                  <span>ТОП 20</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
