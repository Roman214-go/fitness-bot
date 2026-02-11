import { IoCloseOutline } from 'react-icons/io5';
import { useEffect, useMemo } from 'react';

import styles from './PrivacyModal.module.scss';
import { privacy } from '../../common/constants/privacy';

interface PrivacyModalProps {
  id: number;
  onClose: () => void;
}

export const PrivacyModal = ({ id, onClose }: PrivacyModalProps) => {
  const privacyItem = useMemo(() => privacy.find(item => item.id === id), [id]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!privacyItem) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <header className={styles.header}>
          <h1>{privacyItem.title}</h1>
          <button onClick={onClose} className={styles.closeButton}>
            <IoCloseOutline size={36} />
          </button>
        </header>

        <div className={styles.content}>
          {privacyItem.text.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
