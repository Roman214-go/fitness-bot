import { ReactNode, useState } from 'react';
import styles from './Achievement.module.scss';
import { AchievementModal } from './AchievementModal';

interface Props {
  title: string;
  description: string;
  icon: ReactNode;
  isUnlocked: boolean;
}

export const Achievement: React.FC<Props> = ({ title, description, icon, isUnlocked }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (isUnlocked) {
      setIsOpen(true);
    }
  };

  return (
    <>
      <div className={`${styles.achievement} ${isUnlocked ? styles.unlocked : styles.locked}`} onClick={handleClick}>
        {icon}
        <span>{title}</span>
      </div>

      {isOpen && (
        <AchievementModal title={title} description={description} icon={icon} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};
