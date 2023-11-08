import { HiMiniLink, HiMiniPlus } from 'react-icons/hi2';
import useEditorStore from '../../../store/editor';
import Button from '../../Button';
import Favicon from '../../Favicon';
import styles from './Title.module.scss';
import { useEffect } from 'react';

const Title = () => {
  const { isEditing, draftPassword, setDraftPassword, setCreateFieldModalOpen, setIntegrationModalOpen } =
    useEditorStore();

  useEffect(() => {
    console.log(draftPassword?.website)
  }, [draftPassword?.website]);

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
          <Button onClick={() => setIntegrationModalOpen(true)} className={styles.button}>
            <HiMiniLink />
          </Button>
          <Button onClick={() => setCreateFieldModalOpen(true)} className={styles.button}>
            <HiMiniPlus />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Title;
