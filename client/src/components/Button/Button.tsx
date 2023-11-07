import cn from 'classnames';
import { ReactNode } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps {
  loading?: boolean;
  children?: ReactNode;
}

const Button = ({ loading, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) => {
  return (
    <button
      {...props}
      className={cn(styles.button, loading && styles.loading, props.className)}
      disabled={loading || props.disabled}
    >
      {children}
      <div className={cn(styles.spinner, loading && styles.visible)} />
    </button>
  );
};

export default Button;
