import { Types } from 'mongoose';
import { useEffect, useRef, useState } from 'react';
import { IconContext } from 'react-icons';
import {
  HiMiniCheckCircle,
  HiMiniLink,
  HiMiniLockClosed,
  HiMiniPencil,
  HiMiniPlus,
  HiMiniTrash,
  HiMiniXMark,
} from 'react-icons/hi2';
import useEditorStore from '../../store/editor';
import usePasswordsStore from '../../store/passwords';
import api from '../../utils/api';
import simplifyUrl from '../../utils/simplifyUrl';
import { Field as FieldType, Password as PasswordType } from '../../utils/types';
import Button from '../Button';
import Favicon from '../Favicon';
import Field from '../Field';
import Modal from '../Modal';
import Password from '../Password';
import PasswordList from '../PasswordList';
import PasswordSkeleton from '../PasswordSkeleton';
import SearchVault from '../SearchVault';
import TextInput from '../TextInput';
import styles from './PasswordEditor.module.scss';

const PasswordEditor = () => {
  const { selectedPassword: initialPassword, setSelectedPassword } = useEditorStore();
  const [password, setPassword] = useState<PasswordType>(JSON.parse(JSON.stringify(initialPassword)));
  const [website, setWebsite] = useState(password.website);
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showNewFieldModal, setShowNewFieldModal] = useState(false);
  const [newFieldTitle, setNewFieldTitle] = useState('');
  const newFieldInput = useRef<HTMLInputElement>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isIntegrationSelectModalOpen, setIntegrationSelectModalOpen] = useState(false);
  const fetchPasswords = usePasswordsStore((state) => state.fetch);

  useEffect(() => {
    if (!initialPassword) {
      return;
    }

    setPassword(JSON.parse(JSON.stringify(initialPassword)));
  }, [initialPassword]);

  useEffect(() => {
    if (showNewFieldModal && newFieldInput.current) {
      newFieldInput.current.focus();
    }
  }, [showNewFieldModal]);

  const onCancel = () => {
    setPassword(JSON.parse(JSON.stringify(initialPassword)));
    setEditing(false);
  };

  const handleFieldInput = (id: string, value: string) => {
    setPassword((prev) => {
      const prevState: PasswordType = JSON.parse(JSON.stringify(prev));

      if (!prevState.credentials.fields) {
        return prev;
      }

      const index = prevState.credentials.fields.findIndex((item) => item._id === id);
      prevState.credentials.fields[index].value = value;

      return prevState;
    });
  };

  const handleFieldToggleShow = (id: string) => {
    setPassword((prev) => {
      const prevState: PasswordType = JSON.parse(JSON.stringify(prev));

      if (!prevState.credentials.fields) {
        return prev;
      }

      const index = prevState.credentials.fields.findIndex((item) => item._id === id);
      prevState.credentials.fields[index].isPassword = !prevState.credentials.fields[index].isPassword;

      return prevState;
    });
  };

  const handleDeleteField = (id: string) => {
    setPassword((prev) => {
      const prevState: PasswordType = JSON.parse(JSON.stringify(prev));

      if (!prevState.credentials.fields) {
        return prev;
      }

      prevState.credentials.fields = prevState.credentials.fields.filter((item) => item._id !== id);

      return prevState;
    });
  };

  const createField = () => {
    if (newFieldTitle.trim() === '') {
      return;
    }

    setPassword((prev) => {
      const prevState: PasswordType = JSON.parse(JSON.stringify(prev));

      if (!prevState.credentials.fields) {
        prevState.credentials.fields = [];
      }

      const field: FieldType = {
        _id: new Types.ObjectId().toString(),
        title: newFieldTitle,
        isPassword: newFieldTitle.toLocaleLowerCase().includes('password'),
        value: '',
      };
      prevState.credentials.fields.push(field);
      return prevState;
    });

    setNewFieldTitle('');
    setShowNewFieldModal(false);
  };

  const handleIntegrationSelect = (integration: PasswordType | undefined) => {
    setPassword((prev) => {
      const prevState: PasswordType = JSON.parse(JSON.stringify(prev));

      prevState.credentials.integration = integration;
      return prevState;
    });

    setIntegrationSelectModalOpen(false);
  };

  const savePassword = async () => {
    if (JSON.stringify(password) === JSON.stringify(initialPassword)) {
      setEditing(false);
      return;
    }

    setLoading(true);

    try {
      await api.update(password._id, {
        name: password.name,
        credentials: password.credentials,
        website: password.website,
      });
      fetchPasswords();
    } finally {
      setEditing(false);
      setLoading(false);
    }
  };

  const removePassword = async () => {
    setDeleteModalOpen(false);
    setLoading(true);

    try {
      await api.remove(password._id);
      setSelectedPassword(null);
      fetchPasswords();
    } finally {
      setEditing(false);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <IconContext.Provider value={{ className: styles.icon }}>
          {isEditing ? (
            <Button loading={isLoading} onClick={savePassword} className={styles.button}>
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
        </IconContext.Provider>
      </div>

      <div className={styles.title}>
        <Favicon website={website} />
        <input
          value={password.name}
          onChange={(e) => setPassword((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Title"
          className={styles.input}
          readOnly={!isEditing}
        />
        {isEditing && (
          <div className={styles.buttons}>
            <Button onClick={() => setIntegrationSelectModalOpen(true)} className={styles.button}>
              <HiMiniLink />
            </Button>
            <Button onClick={() => setShowNewFieldModal(true)} className={styles.button}>
              <HiMiniPlus />
            </Button>
          </div>
        )}
      </div>

      <div className={styles.fieldList}>
        {password.credentials.fields?.map((field) => (
          <Field
            key={field._id}
            onInput={(value) => handleFieldInput(field._id, value)}
            onToggleShow={() => handleFieldToggleShow(field._id)}
            onDelete={() => handleDeleteField(field._id)}
            field={field}
            readOnly={!isEditing}
          />
        ))}
        <>
          {password.credentials.integration && (
            <>
              <h4>Integration</h4>
              <Password
                onClick={() =>
                  isEditing
                    ? setIntegrationSelectModalOpen(true)
                    : setSelectedPassword(password.credentials.integration as PasswordType)
                }
                password={password.credentials.integration as PasswordType}
              />
            </>
          )}
        </>
        <Field
          website
          onInput={(value) =>
            setPassword((prev) => ({
              ...prev,
              website: simplifyUrl(value),
            }))
          }
          onBlur={() => setWebsite(password.website)}
          readOnly={!isEditing}
          field={{ title: 'Website', value: password.website, isPassword: false }}
        />
      </div>

      <Modal
        close={() => setShowNewFieldModal(false)}
        isOpen={showNewFieldModal}
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

      <Modal
        close={() => setDeleteModalOpen(false)}
        isOpen={isDeleteModalOpen}
        title="Confirm action"
        buttons={[
          { title: 'Yes', onClick: removePassword, secondary: true },
          { title: 'No', onClick: () => setDeleteModalOpen(false) },
        ]}
      >
        <p>
          Are you sure you want to delete <b>{password.name}</b>?
        </p>
      </Modal>

      <Modal
        close={() => setIntegrationSelectModalOpen(false)}
        isOpen={isIntegrationSelectModalOpen}
        title="Select integration"
        fullHeight
      >
        <SearchVault noButtons />
        {isIntegrationSelectModalOpen ? (
          <PasswordList onPasswordSelect={handleIntegrationSelect} filter={(item) => item._id !== password._id} />
        ) : (
          Array(20)
            .fill(0)
            .map((_item, index) => <PasswordSkeleton key={index} />)
        )}
      </Modal>
    </div>
  );
};

export default PasswordEditor;
