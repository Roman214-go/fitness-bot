import styles from './Loader.module.scss';

export const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <p className={styles.text}>Пожалуйста, подождите минутку</p>
    </div>
  );
};
