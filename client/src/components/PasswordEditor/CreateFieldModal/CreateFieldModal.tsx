import { Types } from 'mongoose';
import { useEffect, useRef, useState } from 'react';
import { HiMiniLockClosed } from 'react-icons/hi2';
import useEditorStore from '../../../store/editor';
import { Field, Password } from '../../../utils/types';
import Modal from '../../Modal';
import TextInput from '../../TextInput';

const CreateFieldModal = () => {
  const { isCreateFieldModalOpen, setDraftPassword, setCreateFieldModalOpen } = useEditorStore();
  const newFieldInput = useRef<HTMLInputElement>(null);
  const [newFieldTitle, setNewFieldTitle] = useState('');

  useEffect(() => {
    if (isCreateFieldModalOpen && newFieldInput.current) {
      newFieldInput.current.focus();
    }
  }, [isCreateFieldModalOpen]);

  const createField = () => {
    if (newFieldTitle.trim() === '') {
      return;
    }

    setDraftPassword((prev) => {
      const prevState: Password = JSON.parse(JSON.stringify(prev));

      if (!prevState.credentials.fields) {
        prevState.credentials.fields = [];
      }

      const field: Field = {
        _id: new Types.ObjectId().toString(),
        title: newFieldTitle,
        isPassword: newFieldTitle.toLocaleLowerCase().includes('password'),
        value: '',
      };
      prevState.credentials.fields.push(field);
      return prevState;
    });

    setNewFieldTitle('');
    setCreateFieldModalOpen(false);
  };

  return (
    <Modal
      onCloseRequest={() => setCreateFieldModalOpen(false)}
      isOpen={isCreateFieldModalOpen}
      title="Create new field"
      buttons={[{ title: 'Create', onClick: createField }]}
    >
      <TextInput
        ref={newFieldInput}
        onChange={(e) => setNewFieldTitle(e.target.value.trimStart())}
        value={newFieldTitle}
        icon={<HiMiniLockClosed />}
        type="text"
        placeholder="Title"
      />
    </Modal>
  );
};

export default CreateFieldModal;
