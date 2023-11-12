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
  website?: boolean;
  onInput(value: string): void;
  onToggleShow?(): void;
  onDelete?(): void;
  onBlur?(): void;
}

const Field = ({ field, readOnly, website, onInput, onToggleShow, onDelete, onBlur }: Props) => {
  return (
    <div className={styles.container}>
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
            <Tooltip content="Delete field" placement="top">
              <Button onClick={onDelete} className={styles.button}>
                <HiMiniTrash />
              </Button>
            </Tooltip>
            <Tooltip content="Generate random string" placement="top">
              <Button onClick={() => onInput(generatePassword())} className={styles.button}>
                <HiMiniArrowPath />
              </Button>
            </Tooltip>
          </>
        )}
        {!website && (
          <Tooltip content={field.isPassword ? 'Show' : 'Hide'} placement="top">
            <Button onClick={onToggleShow} className={styles.button}>
              {field.isPassword ? <HiMiniEye /> : <HiMiniEyeSlash />}
            </Button>
          </Tooltip>
        )}
        {website && (
          <Tooltip content="Visit website" placement="top">
            <a href={`https://${field.value}`} target="_blank">
              <Button className={styles.button}>
                <HiMiniArrowTopRightOnSquare />
              </Button>
            </a>
          </Tooltip>
        )}
        <Tooltip content="Copy" placement="top">
          <Button onClick={() => navigator.clipboard.writeText(field.value)} className={styles.button}>
            <HiMiniSquare2Stack />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Field;
