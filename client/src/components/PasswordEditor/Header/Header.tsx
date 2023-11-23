import { IconContext } from 'react-icons';
import { HiMiniCheckCircle, HiMiniPencil, HiMiniTrash, HiMiniXMark } from 'react-icons/hi2';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import useEditorStore from '../../../store/editor';
import isExposedPasswordField from '../../../utils/isExposedPasswordField';
import Button from '../../Button';
import styles from './Header.module.scss';

const Header = () => {
  const {
    selectedPassword,
    isEditing,
    isLoading,
    draftPassword,
    setSelectedPassword,
    setEditing,
    setDraftPassword,
    savePassword,
    setDeleteModalOpen,
    setExposedPasswordModalOpen,
  } = useEditorStore();

  if (!selectedPassword || !draftPassword) {
    return null;
  }

  const handleSavePassword = () => {
    const hasExposedPasswordField = draftPassword.credentials.fields?.some((item) => isExposedPasswordField(item));

    if (hasExposedPasswordField) {
      return setExposedPasswordModalOpen(true);
    }

    savePassword();
  };

  const onCancel = () => {
    setDraftPassword(JSON.parse(JSON.stringify(selectedPassword)));
    setEditing(false);
  };

  return (
    <IconContext.Provider value={{ className: styles.icon }}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={isEditing ? 'editing' : 'notEditing'}
          classNames={{
            enter: styles.enter,
            enterActive: styles.enterActive,
            exit: styles.exit,
            exitActive: styles.exitActive,
          }}
          timeout={200}
        >
          <div className={styles.header}>
            {isEditing ? (
              <Button loading={isLoading} onClick={handleSavePassword} className={styles.button}>
                <HiMiniCheckCircle /> Save
              </Button>
            ) : (
              <Button loading={isLoading} onClick={() => setEditing(true)} className={styles.button}>
                <HiMiniPencil /> Edit
              </Button>
            )}
            <Button loading={isLoading} onClick={() => setDeleteModalOpen(true)} className={styles.button}>
              <HiMiniTrash /> Delete
            </Button>
            {isEditing ? (
              <Button onClick={onCancel} className={styles.button}>
                <HiMiniXMark /> Cancel
              </Button>
            ) : (
              <Button onClick={() => setSelectedPassword(null)} className={styles.button}>
                <HiMiniXMark /> Close
              </Button>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </IconContext.Provider>
  );
};

export default Header;
