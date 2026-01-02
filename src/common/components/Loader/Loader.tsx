import { AiOutlineLoading3Quarters as LoadingIcon } from 'react-icons/ai';

import styles from './Loader.module.scss';

export const Loader = () => (
  <div className={styles.container}>
    {/* TODO: change loader ui */}
    <LoadingIcon className={styles.container_loader} />
    <p className={styles.container_text}>Пожалуйста, подождите минутку</p>
  </div>
);
