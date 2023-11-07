import cn from 'classnames';
import useEditorStore from '../../store/editor';
import { Password as PasswordType } from '../../utils/types';
import Favicon from '../Favicon';
import styles from './Password.module.scss';

interface Props {
  password: PasswordType;
  onClick?(): void;
}

const Password = ({ password, onClick }: Props) => {
  const selectedPassword = useEditorStore((state) => state.selectedPassword);

  return (
    <button onClick={onClick} className={cn(styles.button, selectedPassword?._id === password._id && styles.selected)}>
      <Favicon website={password.website} />
      <div className={styles.details}>
        <h2>{password.name}</h2>
        <span className={styles['details__website']}>{password.website}</span>
      </div>
    </button>
  );
};

export default Password;
