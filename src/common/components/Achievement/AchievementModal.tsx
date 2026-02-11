import { fetchMyMainAchievement, setMainAchievement } from '../../../pages/ProfilePage/api/achievementsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Button from '../Button';

import styles from './AchievementModal.module.scss';

interface Props {
  title: string;
  description: string;
  photoUrl: string;
  achievementId: number;
  onClose: () => void;
  isUnlocked: boolean;
}

export const AchievementModal: React.FC<Props> = ({
  title,
  description,
  photoUrl,
  isUnlocked,
  achievementId,
  onClose,
}) => {
  const { userData } = useAppSelector(state => state.auth);

  const dispatch = useAppDispatch();
  const telegramId = userData?.telegram_id;

  const handleSetMain = (achievementId: number) => {
    if (!telegramId) return;

    dispatch(setMainAchievement({ telegramId, achievementId }));
    dispatch(fetchMyMainAchievement({ telegramId }));
    onClose();
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <img src={photoUrl} />
        <p>{description}</p>
        <div className={styles.buttonContainer}>
          {isUnlocked ? (
            <Button buttonType='secondary' onClick={() => handleSetMain(achievementId)}>
              Отображать в профиле
            </Button>
          ) : null}
          <Button onClick={onClose}>Закрыть</Button>
        </div>
      </div>
    </div>
  );
};
