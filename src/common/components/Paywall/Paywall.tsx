import { useNavigate } from 'react-router-dom';

import styles from './Paywall.module.scss';
import Button from '../Button';
import { useAppSelector } from '../../store/hooks';
import { checkSubscriptionStatus } from '../../utils/checkSubscription';

export const Paywall = () => {
  const navigate = useNavigate();
  const { userData } = useAppSelector(state => state.auth);

  const isPaused = () => {
    if (!userData?.subscription) {
      return false;
    }
    if (userData.subscription.status === 'pause') {
      return true;
    }
    return false;
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.lock}>🔒</div>
        <h3>
          {checkSubscriptionStatus(userData?.subscription) || isPaused()
            ? 'Тренер подготовит Вашу программу в течение 24ч, пожалуйста, подождите'
            : 'Пожалуйста приобретите подписку'}
        </h3>
        <p>чтобы воспользоваться этой функцией</p>
        {checkSubscriptionStatus(userData?.subscription) || isPaused() ? null : (
          <Button onClick={() => navigate('/onboarding')}>Перейти</Button>
        )}
      </div>
    </div>
  );
};
