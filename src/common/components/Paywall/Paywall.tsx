import { useNavigate } from 'react-router-dom';

import styles from './Paywall.module.scss';
import Button from '../Button';

export const Paywall = () => {
  const navigate = useNavigate();
  console.log(1);

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.lock}>🔒</div>
        <h3>Пожалуйста приобретите подписку</h3>
        <p>чтобы воспользоваться этой функцией</p>

        <Button onClick={() => navigate('/onboarding')}>Перейти</Button>
      </div>
    </div>
  );
};
