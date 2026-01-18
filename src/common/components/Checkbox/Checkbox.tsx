import { InputHTMLAttributes } from 'react';

import styles from './Checkbox.module.scss';

interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = (props: ICheckboxProps) => {
  const { label, ...restProps } = props;

  return (
    <label className={styles.checkbox}>
      <input type='checkbox' {...restProps} />
      <span className={styles.checkbox_checkMark} />
      {label ? <span className={styles.checkbox_label}>{label}</span> : null}
    </label>
  );
};
