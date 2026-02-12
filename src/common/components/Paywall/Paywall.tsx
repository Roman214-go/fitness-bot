import { useNavigate } from 'react-router-dom';

import styles from './Paywall.module.scss';
import Button from '../Button';
import { useAppSelector } from '../../store/hooks';

export const Paywall = () => {
  const navigate = useNavigate();
  const { userData } = useAppSelector(state => state.auth);

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.lock}>🔒</div>
        <h3>
          {userData?.subscription.status !== 'active'
            ? 'Пожалуйста приобретите подписку'
            : 'Ваша программа тренировок уже создается, подождите'}
        </h3>
        <p>чтобы воспользоваться этой функцией</p>
        {userData?.subscription.status !== 'active' ? (
          <Button onClick={() => navigate('/onboarding')}>Перейти</Button>
        ) : null}
      </div>
    </div>
  );
};
