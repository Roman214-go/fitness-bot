import React, { useState } from 'react';
import styles from './Achievement.module.scss';
import { AchievementModal } from './AchievementModal';

interface AchievementProps {
  title: string;
  description: string;
  photoUrl?: string;
  achievementId: number;
  icon?: React.ReactNode;
  isUnlocked: boolean;
}

export const Achievement: React.FC<AchievementProps> = ({
  title,
  achievementId,
  description,
  photoUrl,
  icon,
  isUnlocked,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);

  return (
    <>
      <div
        className={`${styles.achievement} ${!isUnlocked ? styles.locked : ''}`}
        onClick={handleOpen}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.achievementIcon}>
          {photoUrl ? <img src={photoUrl} className={styles.achievementImage} /> : icon}
        </div>
        <h3 className={styles.achievementTitle}>{title}</h3>
      </div>

      {isOpen && (
        <AchievementModal
          title={title}
          achievementId={achievementId}
          description={description}
          photoUrl={photoUrl!}
          onClose={() => setIsOpen(false)}
          isUnlocked={isUnlocked}
        />
      )}
    </>
  );
};
