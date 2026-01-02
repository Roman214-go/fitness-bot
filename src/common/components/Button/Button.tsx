import { ReactNode, ButtonHTMLAttributes, ReactElement } from 'react';

import { AiOutlineLoading3Quarters as LoadingIcon } from 'react-icons/ai';

import styles from './Button.module.scss';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: 'primary' | 'secondary';
  children: ReactNode;
  customClassName?: string;
  isLoading?: boolean;
}

export const Button = (props: IButtonProps): ReactElement => {
  const { buttonType = 'primary', customClassName, children, isLoading, ...restProps } = props;
  return (
    <button
      className={`${styles.custom__button} ${styles[`custom__button_${buttonType}`]} ${customClassName || ''}`}
      disabled={isLoading}
      {...restProps}
    >
      {isLoading ? <LoadingIcon className={styles.custom__button_loader} /> : children}
    </button>
  );
};
