import { HiMiniLink, HiMiniPlus } from 'react-icons/hi2';
import useEditorStore from '../../../store/editor';
import Button from '../../Button';
import Favicon from '../../Favicon';
import Tooltip from '../../Tooltip';
import styles from './Title.module.scss';

const Title = () => {
  const { isEditing, draftPassword, setDraftPassword, setCreateFieldModalOpen, setIntegrationModalOpen } =
    useEditorStore();

  if (!draftPassword) {
    return null;
  }

  return (
    <div className={styles.title}>
      <Favicon website={draftPassword.website} />
      <input
        value={draftPassword.name}
        onChange={(e) => setDraftPassword((prev) => prev && { ...prev, name: e.target.value })}
        placeholder="Title"
        className={styles.input}
        readOnly={!isEditing}
      />
      {isEditing && (
        <div className={styles.buttons}>
          <Tooltip content="Select integration" position="bottom">
            <Button onClick={() => setIntegrationModalOpen(true)} className={styles.button}>
              <HiMiniLink />
            </Button>
          </Tooltip>
          <Tooltip content="Add field" position="bottom">
            <Button onClick={() => setCreateFieldModalOpen(true)} className={styles.button}>
              <HiMiniPlus />
            </Button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default Title;
