import { IconContext } from 'react-icons';
import { HiMiniCheckCircle, HiMiniPencil, HiMiniTrash, HiMiniXMark } from 'react-icons/hi2';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import useEditorStore from '../../../store/editor';
import usePasswordsStore from '../../../store/passwords';
import api from '../../../utils/api';
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
    setLoading,
    setDeleteModalOpen,
  } = useEditorStore();
  const fetchPasswords = usePasswordsStore((state) => state.fetch);

  if (!selectedPassword || !draftPassword) {
    return null;
  }

  const savePassword = async () => {
    if (JSON.stringify(draftPassword) === JSON.stringify(selectedPassword)) {
      setEditing(false);
      return;
    }

    setLoading(true);

    try {
      await api.update(draftPassword._id, {
        name: draftPassword.name,
        credentials: draftPassword.credentials,
        website: draftPassword.website,
      });
      fetchPasswords();
    } finally {
      setEditing(false);
      setLoading(false);
    }
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
              <>
                <Button loading={isLoading} onClick={savePassword} className={styles.button}>
                  <HiMiniCheckCircle /> Save
                </Button>
                <Button loading={isLoading} onClick={() => setDeleteModalOpen(true)} className={styles.button}>
                  <HiMiniTrash /> Delete
                </Button>
                <Button onClick={onCancel} className={styles.button}>
                  <HiMiniXMark /> Cancel
                </Button>
              </>
            ) : (
              <>
                <Button loading={isLoading} onClick={() => setEditing(true)} className={styles.button}>
                  <HiMiniPencil /> Edit
                </Button>
                <Button loading={isLoading} onClick={() => setDeleteModalOpen(true)} className={styles.button}>
                  <HiMiniTrash /> Delete
                </Button>
                <Button onClick={() => setSelectedPassword(null)} className={styles.button}>
                  <HiMiniXMark /> Close
                </Button>
              </>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </IconContext.Provider>
  );
};

export default Header;
