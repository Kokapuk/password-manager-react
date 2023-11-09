import cn from 'classnames';
import { HTMLAttributes } from 'react';
import useEditorStore from '../../store/editor';
import { Password as PasswordType } from '../../utils/types';
import Favicon from '../Favicon';
import styles from './Password.module.scss';

interface Props {
  password: PasswordType;
}

const Password = ({ password, className, children, ...props }: Props & HTMLAttributes<HTMLButtonElement>) => {
  const selectedPassword = useEditorStore((state) => state.selectedPassword);

  return (
    <button
      {...props}
      className={cn(styles.button, selectedPassword?._id === password._id && styles.selected, className)}
    >
      <Favicon website={password.website} />
      <div className={styles.details}>
        <h2>{password.name}</h2>
        <span className={styles.website}>{password.website}</span>
      </div>
      {children}
    </button>
  );
};

export default Password;
