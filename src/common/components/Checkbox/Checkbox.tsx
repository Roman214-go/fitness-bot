import { InputHTMLAttributes } from 'react';

import styles from './Checkbox.module.scss';

interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isBoldLabel?: boolean;
  isPurpleCheckmark?: boolean;
  isWhiteLabel?: boolean;
}

export const Checkbox = (props: ICheckboxProps) => {
  const { isBoldLabel, isPurpleCheckmark, isWhiteLabel, label, ...restProps } = props;

  return (
    <label className={styles.checkbox}>
      <input type='checkbox' {...restProps} />
      <span className={`${styles.checkbox_checkMark} ${isPurpleCheckmark ? styles.checkbox_checkMark_purple : ''}`} />
      {label ? (
        <span
          className={`${styles.checkbox_label} ${isWhiteLabel ? styles.checkbox_label_white : ''} ${isBoldLabel ? styles.checkbox_label_bold : ''}`}
        >
          {label}
        </span>
      ) : null}
    </label>
  );
};
