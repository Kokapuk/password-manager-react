import { IconContext } from 'react-icons';
import { HiMiniXMark } from 'react-icons/hi2';
import useEditorStore from '../../../store/editor';
import { Password as PasswordType } from '../../../utils/types';
import Password from '../../Password';
import Tooltip from '../../Tooltip';
import styles from './Integration.module.scss';

const Integration = () => {
  const { isEditing, draftPassword, setSelectedPassword, setDraftPassword, setIntegrationModalOpen } = useEditorStore();

  if (!draftPassword?.credentials.integration) {
    return null;
  }

  const handleRemoveClick = () => {
    setDraftPassword((prev) => {
      if (!prev) {
        return prev;
      }

      return { ...prev, credentials: { ...prev.credentials, integration: undefined } };
    });
  };

  return (
    <div className={styles.container}>
      <Password
        key={draftPassword.credentials.integration._id}
        password={draftPassword.credentials.integration as PasswordType}
        className={styles.password}
        onClick={() =>
          isEditing
            ? setIntegrationModalOpen(true)
            : setSelectedPassword(draftPassword.credentials.integration as PasswordType)
        }
      />
      {isEditing && (
        <Tooltip containerClass={styles.removeButtonContainer} content="Remove integration" position="left">
          <button onClick={handleRemoveClick} className={styles.removeButton}>
            <IconContext.Provider value={{ className: styles.icon }}>
              <HiMiniXMark />
            </IconContext.Provider>
          </button>
        </Tooltip>
      )}
    </div>
  );
};

export default Integration;
