import { ReactNode } from 'react';
import styles from '../styles/Button.module.scss';
import classNames from 'classnames';

export interface ButtonProps {
  loading?: boolean;
  children?: ReactNode;
}

const Button = ({ loading, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) => {
  return (
    <button
      {...props}
      className={classNames(styles.button, loading && styles.button_loading, props.className)}
      disabled={loading || props.disabled}>
      {children}
      <div className={classNames(styles.button__spinner, loading && styles.button__spinner_show)} />
    </button>
  );
};

export default Button;
