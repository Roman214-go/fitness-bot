import React from 'react';
import styles from './LeadersPage.module.scss';

interface LeaderboardUser {
  id: number;
  nickname: string;
  score: string;
  avatar?: string;
}

export const LeadersPage: React.FC = () => {
  const topThree: LeaderboardUser[] = [
    { id: 2, nickname: 'Nickname', score: '67', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 1, nickname: 'Nickname', score: '69', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 3, nickname: 'Nickname', score: '42', avatar: 'https://i.pravatar.cc/150?img=3' },
  ];

  const otherUsers: LeaderboardUser[] = [
    { id: 4, nickname: 'Nickname', score: '41', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: 5, nickname: 'Nickname', score: '34' },
    { id: 6, nickname: 'Nickname', score: '32', avatar: 'https://i.pravatar.cc/150?img=6' },
    { id: 7, nickname: 'Nickname', score: '26' },
    { id: 8, nickname: 'Nickname', score: '25', avatar: 'https://i.pravatar.cc/150?img=8' },
    { id: 9, nickname: 'Nickname', score: '23' },
  ];

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

  return (
    <div className={styles.container}>
      <header className={styles.header}>Гонка за лидерством</header>

      <div className={styles.podiumSection}>
        {topThree.map(user => (
          <div key={user.id} className={styles.podiumItem}>
            <div className={styles.avatarContainer}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.nickname} className={`${styles.avatar} ${getPlaceClass(user.id)}`} />
              ) : (
                <div className={`${styles.avatar} ${getPlaceClass(user.id)}`} />
              )}
              <div className={getBadgeClass(user.id)}>{user.id}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.leaderboardList}>
        <div className={styles.table_header}>
          <span>Место</span>
          <span>Очки</span>
        </div>
        {otherUsers.map(user => (
          <div key={user.id} className={styles.listItem}>
            <span className={styles.rank}>{user.id}</span>
            {user.avatar ? (
              <img src={user.avatar} alt={user.nickname} className={styles.listAvatar} />
            ) : (
              <div className={styles.listAvatar} />
            )}
            <span className={styles.nickname}>{user.nickname}</span>
            <span className={styles.score}>{user.score}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'end', padding: '10px', height: '50px' }}>...</div>
        <div className={styles.listItem}>
          <span className={styles.rank}>123</span>

          <div className={styles.listAvatar} />
          <span className={styles.nickname}>Ваш никнейм</span>
          <span className={styles.score}>23</span>
        </div>
      </div>
    </div>
  );
};
