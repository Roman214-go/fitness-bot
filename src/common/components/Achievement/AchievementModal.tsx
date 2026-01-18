import { ReactNode } from 'react';
import styles from './AchievementModal.module.scss';
import Button from '../Button';

interface Props {
  title: string;
  description: string;
  icon: ReactNode;
  onClose: () => void;
}

export const AchievementModal: React.FC<Props> = ({ title, description, icon, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div>
          {icon}
          <h3>{title}</h3>
        </div>
        <p>{description}</p>

        <Button onClick={onClose}>Закрыть</Button>
      </div>
    </div>
  );
};
