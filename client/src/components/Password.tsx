import { Password as PasswordType } from '../utils/types';
import styles from '../styles/Password.module.scss';
import classNames from 'classnames';
import Image from './Image';

interface Props {
  password: PasswordType;
  onClick?(): void;
  selected?: boolean;
}

const Password = ({ password, onClick, selected }: Props) => {
  return (
    <button onClick={onClick} className={classNames(styles.button, selected && styles.button_selected)}>
      <Image website={password.website} />
      <div className={styles.details}>
        <h2>{password.name}</h2>
        <span className={styles['details__website']}>{password.website}</span>
      </div>
    </button>
  );
};

export default Password;
