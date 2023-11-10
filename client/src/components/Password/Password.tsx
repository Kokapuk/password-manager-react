import cn from 'classnames';
import { HTMLAttributes } from 'react';
import { Password as PasswordType } from '../../utils/types';
import Favicon from '../Favicon';
import styles from './Password.module.scss';

interface Props {
  password: PasswordType;
  isSelected?: boolean;
  className?: string;
  onClick: HTMLAttributes<HTMLButtonElement>['onClick'];
}

const Password = ({ password, isSelected, className, onClick }: Props) => {
  return (
    <button onClick={onClick} className={cn(styles.button, isSelected && styles.selected, className)}>
      <Favicon website={password.website} />
      <div className={styles.details}>
        <h2>{password.name}</h2>
        <span className={styles.website}>{password.website}</span>
      </div>
    </button>
  );
};

export default Password;
