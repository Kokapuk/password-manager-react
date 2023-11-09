import { HiMiniXMark } from 'react-icons/hi2';
import useEditorStore from '../../../store/editor';
import { Password as PasswordType } from '../../../utils/types';
import Password from '../../Password';
import styles from './Integration.module.scss';
import { IconContext } from 'react-icons';
import { MouseEvent } from 'react';

const Integration = () => {
  const { isEditing, draftPassword, setSelectedPassword, setDraftPassword, setIntegrationModalOpen } = useEditorStore();

  if (!draftPassword?.credentials.integration) {
    return null;
  }

  const handleRemoveClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    setDraftPassword((prev) => {
      if (!prev) {
        return prev;
      }

      return { ...prev, credentials: { ...prev.credentials, integration: undefined } };
    });
  };

  return (
    <Password
      key={draftPassword.credentials.integration._id}
      className={styles.container}
      onClick={() =>
        isEditing
          ? setIntegrationModalOpen(true)
          : setSelectedPassword(draftPassword.credentials.integration as PasswordType)
      }
      password={draftPassword.credentials.integration as PasswordType}
    >
      {isEditing && (
        <button onClick={handleRemoveClick} className={styles.removeButton}>
          <IconContext.Provider value={{ className: styles.icon }}>
            <HiMiniXMark />
          </IconContext.Provider>
        </button>
      )}
    </Password>
  );
};

export default Integration;
