import cn from 'classnames';
import { ReactNode } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import styles from './Button.module.scss';

export interface ButtonProps {
  loading?: boolean;
  children?: ReactNode;
}

const Button = ({
  loading = false,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) => {
  return (
    <button
      {...props}
      className={cn(styles.button, loading && styles.loading, props.className)}
      disabled={loading || props.disabled}
      data-loading={loading}
    >
      {children}
      <div className={styles.spinnerContainer}>
        <LoadingSpinner loading={loading} />
      </div>
    </button>
  );
};

export default Button;
