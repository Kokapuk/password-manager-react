import cn from 'classnames';
import {
  HiMiniArrowPath,
  HiMiniArrowTopRightOnSquare,
  HiMiniEye,
  HiMiniEyeSlash,
  HiMiniSquare2Stack,
  HiMiniTrash,
} from 'react-icons/hi2';
import generatePassword from '../../utils/generatePassword';
import { FieldDTO } from '../../utils/types';
import Button from '../Button';
import Tooltip from '../Tooltip';
import styles from './Field.module.scss';

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
    <div className={cn(styles.container)}>
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
            <Tooltip content="Delete field">
              <Button onClick={onDelete} className={styles.button}>
                <HiMiniTrash />
              </Button>
            </Tooltip>
            <Tooltip content="Generate random string">
              <Button onClick={() => onInput(generatePassword())} className={styles.button}>
                <HiMiniArrowPath />
              </Button>
            </Tooltip>
          </>
        )}
        {!website && (
          <Tooltip content={field.isPassword ? 'Show' : 'Hide'}>
            <Button onClick={onToggleShow} className={styles.button}>
              {field.isPassword ? <HiMiniEye /> : <HiMiniEyeSlash />}
            </Button>
          </Tooltip>
        )}
        {website && (
          <Tooltip content="Visit website">
            <a href={`https://${field.value}`} target="_blank">
              <Button className={styles.button}>
                <HiMiniArrowTopRightOnSquare />
              </Button>
            </a>
          </Tooltip>
        )}
        <Tooltip content="Copy">
          <Button onClick={() => navigator.clipboard.writeText(field.value)} className={styles.button}>
            <HiMiniSquare2Stack />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Field;
