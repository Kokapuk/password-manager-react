import { useEffect, useRef, useState } from 'react';
import { HiMiniGlobeAlt, HiMiniLockClosed } from 'react-icons/hi2';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Modal from '../../components/Modal';
import PasswordEditor from '../../components/PasswordEditor';
import PasswordList from '../../components/PasswordList';
import SearchVault from '../../components/SearchVault';
import TextInput from '../../components/TextInput';
import usePasswords from '../../hooks/usePasswords';
import useRedirect from '../../hooks/useRedirect';
import api from '../../utils/api';
import simplifyUrl from '../../utils/simplifyUrl';
import { Password } from '../../utils/types';
import styles from './Home.module.scss';

const Home = () => {
  const { passwords, fetching, totalCount, update, search, paginate } = usePasswords();
  const [query, setQuery] = useState('');
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null);
  const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false);
  const [newPasswordInfo, setNewPasswordInfo] = useState<{ name: string; website: string }>({ name: '', website: '' });
  const [creatingPassword, setCreatingPassword] = useState(false);
  const newPasswordInput = useRef<HTMLInputElement>(null);
  useRedirect('AuthOnly');

  useEffect(() => {
    if (showCreatePasswordModal && newPasswordInput.current) {
      newPasswordInput.current.focus();
    }
  }, [showCreatePasswordModal]);

  const createPassword = async () => {
    if (!newPasswordInfo.name.trim() || !newPasswordInfo.website.trim()) {
      return;
    }

    setCreatingPassword(true);

    try {
      const newPassword = await api.create(newPasswordInfo.name, newPasswordInfo.website);
      update();
      setShowCreatePasswordModal(false);
      setSelectedPassword(newPassword);
    } finally {
      setCreatingPassword(false);
      setNewPasswordInfo({ name: '', website: '' });
    }
  };

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
              <PasswordEditor
                onUpdateRequest={update}
                onClose={() => setSelectedPassword(null)}
                onPasswordSelect={(password) => setSelectedPassword(password)}
                password={selectedPassword}
              />
            ) : (
              <div className={styles['password-list']}>
                <SearchVault
                  query={query}
                  onInput={(value) => setQuery(value)}
                  totalCount={totalCount}
                  onSearchRequest={search}
                  onPasswordCreateRequest={() => setShowCreatePasswordModal(true)}
                />
                <PasswordList
                  selectedPassword={selectedPassword}
                  onPaginationRequest={paginate}
                  passwords={passwords}
                  fetching={fetching}
                  onPasswordSelect={(password) => setSelectedPassword(password)}
                />
              </div>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>

      <Modal
        title="Create password"
        show={showCreatePasswordModal}
        onCloseRequest={() => setShowCreatePasswordModal(false)}
        buttons={[{ title: 'Create', onClick: createPassword, loading: creatingPassword }]}
      >
        <TextInput
          ref={newPasswordInput}
          value={newPasswordInfo.name}
          onChange={(e) => setNewPasswordInfo((prev) => ({ ...prev, name: e.target.value.trimStart() }))}
          icon={<HiMiniLockClosed />}
          placeholder="Name"
        />
        <TextInput
          value={newPasswordInfo.website}
          onChange={(e) => setNewPasswordInfo((prev) => ({ ...prev, website: simplifyUrl(e.target.value) }))}
          icon={<HiMiniGlobeAlt />}
          placeholder="Website"
        />
      </Modal>
    </>
  );
};

export default Home;
