import classNames from 'classnames';
import { ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './Form.module.scss';

interface Props {
  title: string;
  error: string;
  children: ReactNode;
  fullWidth?: boolean;
}

const Form = ({ title, error, children, fullWidth, ...props }: Props & React.FormHTMLAttributes<HTMLFormElement>) => {
  return (
    <form {...props} className={classNames(styles.form, fullWidth && styles['form_full-width'])}>
      <h3>{title}</h3>
      {children}
      <CSSTransition
        in={!!error}
        timeout={200}
        classNames={{
          enter: styles.form__error_enter,
          enterActive: styles['form__error_enter-active'],
          exit: styles.form__error_exit,
          exitActive: styles['form__error_exit-active'],
        }}
        unmountOnExit
      >
        <p className={styles.form__error}>{error}&nbsp;</p>
      </CSSTransition>
    </form>
  );
};

export default Form;
