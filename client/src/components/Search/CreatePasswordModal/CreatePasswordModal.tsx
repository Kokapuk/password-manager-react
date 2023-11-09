import { useEffect, useRef, useState } from 'react';
import { HiMiniGlobeAlt, HiMiniLockClosed } from 'react-icons/hi2';
import useEditorStore from '../../../store/editor';
import usePasswordsStore from '../../../store/passwords';
import api from '../../../utils/api';
import simplifyUrl from '../../../utils/simplifyUrl';
import Modal from '../../Modal';
import TextInput from '../../TextInput';

interface Props {
  isOpen: boolean;
  onCloseRequest(): void;
}

const CreatePasswordModal = ({ isOpen, onCloseRequest }: Props) => {
  const [newPasswordInfo, setNewPasswordInfo] = useState<{ name: string; website: string }>({ name: '', website: '' });
  const [creatingPassword, setCreatingPassword] = useState(false);
  const newPasswordInput = useRef<HTMLInputElement>(null);
  const setSelectedPassword = useEditorStore((state) => state.setSelectedPassword);
  const fetchPasswords = usePasswordsStore((state) => state.fetch);

  useEffect(() => {
    if (isOpen && newPasswordInput.current) {
      newPasswordInput.current.focus();
    }
  }, [isOpen]);

  const createPassword = async () => {
    if (!newPasswordInfo.name.trim() || !newPasswordInfo.website.trim()) {
      return;
    }

    setCreatingPassword(true);

    try {
      const newPassword = await api.create(newPasswordInfo.name, newPasswordInfo.website);
      fetchPasswords();
      onCloseRequest();
      setSelectedPassword(newPassword);
    } finally {
      setCreatingPassword(false);
      setNewPasswordInfo({ name: '', website: '' });
    }
  };

  return (
    <Modal
      title="Create password"
      isOpen={isOpen}
      onCloseRequest={onCloseRequest}
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
  );
};

export default CreatePasswordModal;
