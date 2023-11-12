import { IconContext } from 'react-icons';
import { HiMiniXMark } from 'react-icons/hi2';
import useEditorStore from '../../../store/editor';
import { Password as PasswordType } from '../../../utils/types';
import Password from '../../Password';
import PasswordSkeleton from '../../PasswordSkeleton';
import Tooltip from '../../Tooltip';
import styles from './Integration.module.scss';
import { CSSTransition } from 'react-transition-group';

const Integration = () => {
  const { isEditing, draftPassword, setSelectedPassword, setDraftPassword, setIntegrationModalOpen } = useEditorStore();

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
      <h4>Integration</h4>
      {draftPassword?.credentials.integration ? (
        <div className={styles.passwordContainer}>
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
          <CSSTransition
            in={isEditing}
            timeout={200}
            classNames={{
              enter: styles.enter,
              enterActive: styles.enterActive,
              exit: styles.exit,
              exitActive: styles.exitActive,
            }}
            unmountOnExit
          >
            <Tooltip containerClass={styles.removeButtonContainer} content="Remove integration" placement="left">
              <button onClick={handleRemoveClick} className={styles.removeButton}>
                <IconContext.Provider value={{ className: styles.icon }}>
                  <HiMiniXMark />
                </IconContext.Provider>
              </button>
            </Tooltip>
          </CSSTransition>
        </div>
      ) : (
        <PasswordSkeleton />
      )}
    </div>
  );
};

export default Integration;
