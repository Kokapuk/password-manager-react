import cn from 'classnames';
import { useEffect, useState } from 'react';
import CreatePasswordModal from '../../components/CreatePasswordModal';
import PasswordEditor from '../../components/PasswordEditor';
import PasswordList from '../../components/PasswordList';
import SearchVault from '../../components/SearchVault';
import useRedirect from '../../hooks/useRedirect';
import useEditorStore from '../../store/editor';
import usePasswordsStore from '../../store/passwords';
import styles from './Home.module.scss';

const Home = () => {
  const { selectedPassword, setSelectedPassword } = useEditorStore();
  const [isCreatePasswordModalOpen, setCreatePasswordModalOpen] = useState(false);
  const fetchPasswords = usePasswordsStore((state) => state.fetch);
  useRedirect('authOnly');

  useEffect(() => {
    fetchPasswords(undefined, undefined, true);
  }, [fetchPasswords]);

  return (
    <>
      <div className={styles.container}>
        <div className={cn(styles.passwordList, !!selectedPassword && styles.editorOpen)}>
          <SearchVault onPasswordCreateRequest={() => setCreatePasswordModalOpen(true)} />
          <PasswordList onPasswordSelect={(password) => setSelectedPassword(password)} />
        </div>
        <div className={cn(styles.passwordEditorContainer, !selectedPassword && styles.editorNotOpen)}>
          {selectedPassword ? (
            <PasswordEditor key={selectedPassword._id} />
          ) : (
            <p className={styles.placeholder}>Select a password to view and edit it</p>
          )}
        </div>
      </div>

      <CreatePasswordModal
        isOpen={isCreatePasswordModalOpen}
        close={() => setCreatePasswordModalOpen(false)}
        onSelect={setSelectedPassword}
      />
    </>
  );
};

export default Home;
