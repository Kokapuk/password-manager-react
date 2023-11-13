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
  const firstFieldValue = password.credentials.fields?.[0]?.value;
  const caption = firstFieldValue
    ? firstFieldValue.substring(0, Math.floor(firstFieldValue.length / 2)) +
      '*'.repeat(firstFieldValue.length - Math.floor(firstFieldValue.length / 2))
    : password.website;

  return (
    <button onClick={onClick} className={cn(styles.button, isSelected && styles.selected, className)}>
      <Favicon website={password.website} />
      <div className={styles.details}>
        <h2 className={styles.title}>{password.name}</h2>
        <span className={styles.caption}>{caption}</span>
      </div>
    </button>
  );
};

export default Password;
