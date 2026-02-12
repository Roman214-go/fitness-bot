import { useNavigate } from 'react-router-dom';
import Button from '../../common/components/Button';
import styles from './ErrorScreen.module.scss';
import { MdArrowBackIos } from 'react-icons/md';

interface Props {
  message: string;
  isBackButton?: boolean;
}

export const ErrorScreen: React.FC<Props> = ({ message, isBackButton = false }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      {isBackButton ? (
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <MdArrowBackIos />
        </button>
      ) : null}
      <div className={styles.card}>
        <div className={styles.icon}>🚧</div>

        <h2 className={styles.title}>Упс, что-то пошло не так...</h2>

        <p className={styles.subtext}>{message}</p>

        <Button onClick={() => window.location.reload()}>Повторить попытку</Button>
      </div>
    </div>
  );
};
