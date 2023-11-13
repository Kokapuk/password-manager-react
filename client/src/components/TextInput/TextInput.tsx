import cn from 'classnames';
import { ReactNode, Ref, forwardRef } from 'react';
import { IconContext } from 'react-icons';
import styles from './TextInput.module.scss';

interface Props {
  icon?: ReactNode;
  children?: ReactNode;
  fullHeight?: boolean;
}

const TextInput = forwardRef(
  (
    { icon, children, fullHeight, ...props }: React.InputHTMLAttributes<HTMLInputElement> & Props,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <div className={cn(styles.container, fullHeight && styles.fullHeight)}>
        {icon && <IconContext.Provider value={{ className: styles.icon }}>{icon}</IconContext.Provider>}
        <input ref={ref} {...props} className={styles.input} />
        {children}
      </div>
    );
  }
);

export default TextInput;
