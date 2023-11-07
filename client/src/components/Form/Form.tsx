import cn from 'classnames';
import { ReactNode } from 'react';
import styles from './Form.module.scss';

interface Props {
  title: string;
  error: string;
  children: ReactNode;
  fullWidth?: boolean;
}

const Form = ({ title, error, children, fullWidth, ...props }: Props & React.FormHTMLAttributes<HTMLFormElement>) => {
  return (
    <form {...props} className={cn(styles.form, fullWidth && styles.fullWidth)}>
      <h3>{title}</h3>
      {children}
      <p className={styles.error}>{error}&nbsp;</p>
    </form>
  );
};

export default Form;
