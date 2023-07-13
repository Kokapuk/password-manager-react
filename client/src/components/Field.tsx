import classNames from 'classnames';
import {
  HiMiniArrowPath,
  HiMiniArrowTopRightOnSquare,
  HiMiniEye,
  HiMiniEyeSlash,
  HiMiniSquare2Stack,
  HiMiniTrash,
} from 'react-icons/hi2';
import styles from '../styles/Field.module.scss';
import { FieldDTO } from '../utils/types';
import Button from './Button';

interface Props {
  field: FieldDTO;
  readOnly: boolean;
  onInput(value: string): void;
  onToggleShow?(): void;
  onDelete?(): void;
  onBlur?(): void;
  website?: boolean;
}

const Field = ({ field, readOnly, onInput, onToggleShow, onDelete, onBlur, website }: Props) => {
  return (
    <div className={classNames(styles.container)}>
      <p className={styles.title}>{field.title}</p>
      <input
        onBlur={onBlur}
        onChange={(e) => onInput(e.target.value)}
        readOnly={readOnly}
        value={field.value}
        className={styles.input}
        type={field.isPassword ? 'password' : 'text'}
      />
      <div className={styles.buttons}>
        {!website && !readOnly && (
          <>
            <Button onClick={onDelete} className={styles.buttons__button}>
              <HiMiniTrash />
            </Button>
            <Button onClick={() => onInput('{randomGeneratedPassword}')} className={styles.buttons__button}>
              <HiMiniArrowPath />
            </Button>
          </>
        )}
        {!website && (
          <Button onClick={onToggleShow} className={styles.buttons__button}>
            {field.isPassword ? <HiMiniEye /> : <HiMiniEyeSlash />}
          </Button>
        )}
        {website && (
          <a href={`https://${field.value}`} target='_blank'>
            <Button className={styles.buttons__button}>
              <HiMiniArrowTopRightOnSquare />
            </Button>
          </a>
        )}
        <Button onClick={() => navigator.clipboard.writeText(field.value)} className={styles.buttons__button}>
          <HiMiniSquare2Stack />
        </Button>
      </div>
    </div>
  );
};

export default Field;
