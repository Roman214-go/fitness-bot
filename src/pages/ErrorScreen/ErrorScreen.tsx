import Button from '../../common/components/Button';
import styles from './ErrorScreen.module.scss';

interface Props {
  message: string;
}

export const ErrorScreen: React.FC<Props> = ({ message }) => (
  <div className={styles.wrapper}>
    <div className={styles.card}>
      <div className={styles.icon}>🚧</div>

      <h2 className={styles.title}>Упс, что-то пошло не так...</h2>

      <p className={styles.subtext}>{message}</p>

      <Button onClick={() => window.location.reload()}>Повторить попытку</Button>
    </div>
  </div>
);
