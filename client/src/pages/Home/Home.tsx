import { useEffect, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import CreatePasswordModal from '../../components/CreatePasswordModal';
import PasswordEditor from '../../components/PasswordEditor';
import PasswordList from '../../components/PasswordList';
import SearchVault from '../../components/SearchVault';
import useRedirect from '../../hooks/useRedirect';
import { Password } from '../../utils/types';
import styles from './Home.module.scss';
import usePasswordsStore from '../../store/passwords';

const Home = () => {
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null);
  const [isCreatePasswordModalOpen, setCreatePasswordModalOpen] = useState(false);
  const fetchPasswords = usePasswordsStore((state) => state.fetch);
  useRedirect('authOnly');

  useEffect(() => {
    fetchPasswords(undefined, undefined, true);
  }, [fetchPasswords]);

  return (
    <>
      <SwitchTransition>
        <CSSTransition
          timeout={200}
          key={selectedPassword?._id ?? ''}
          classNames={{
            enter: styles['container_switch-enter'],
            enterActive: styles['container_switch-enter-active'],
            exit: styles['container_switch-exit'],
            exitActive: styles['container_switch-exit-active'],
          }}
        >
          <div className={styles.container}>
            {selectedPassword ? (
              <PasswordEditor onClose={() => setSelectedPassword(null)} password={selectedPassword} />
            ) : (
              <div className={styles['password-list']}>
                <SearchVault onPasswordCreateRequest={() => setCreatePasswordModalOpen(true)} />
                <PasswordList
                  selectedPassword={selectedPassword}
                  onPasswordSelect={(password) => setSelectedPassword(password)}
                />
              </div>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
      <CreatePasswordModal
        isOpen={isCreatePasswordModalOpen}
        close={() => setCreatePasswordModalOpen(false)}
        onSelect={setSelectedPassword}
      />
    </>
  );
};

export default Home;
