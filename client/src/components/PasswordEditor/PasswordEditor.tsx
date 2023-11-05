import classNames from 'classnames';
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
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group';
import usePasswords from '../../hooks/usePasswords';
import api from '../../utils/api';
import simplifyUrl from '../../utils/simplifyUrl';
import { Field as FieldType, Password as PasswordType } from '../../utils/types';
import Button from '../Button';
import Favicon from '../Favicon';
import Field from '../Field';
import Modal from '../Modal';
import Password from '../Password';
import PasswordList from '../PasswordList';
import SearchVault from '../SearchVault';
import TextInput from '../TextInput';
import styles from './PasswordEditor.module.scss';

interface Props {
  password: PasswordType | null;
  onClose(): void;
  onUpdateRequest(): void;
  onPasswordSelect?(password: PasswordType): void;
}

const PasswordEditor = ({ password: initialPassword, onClose, onUpdateRequest, onPasswordSelect }: Props) => {
  const [password, setPassword] = useState<PasswordType>(JSON.parse(JSON.stringify(initialPassword)));
  const [website, setWebsite] = useState(password.website);
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showNewFieldModal, setShowNewFieldModal] = useState(false);
  const [newFieldTitle, setNewFieldTitle] = useState('');
  const newFieldInput = useRef<HTMLInputElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSelectIntegration, setShowSelectIntegration] = useState(false);
  const { passwords, fetching, totalCount, search, paginate } = usePasswords();
  const [query, setQuery] = useState('');

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
        prevState.credentials = { fields: [] };
      }

      prevState.credentials = { fields: prevState.credentials.fields };

      const field: FieldType = {
        _id: new Types.ObjectId().toString(),
        title: newFieldTitle,
        isPassword: newFieldTitle.toLocaleLowerCase().includes('password'),
        value: '',
      };
      prevState.credentials.fields?.push(field);
      return prevState;
    });

    setNewFieldTitle('');
    setShowNewFieldModal(false);
  };

  const handleIntegrationSelect = (integration: PasswordType) => {
    if (integration._id === password._id) {
      return;
    }

    setPassword((prev) => {
      const prevState: PasswordType = JSON.parse(JSON.stringify(prev));

      prevState.credentials = { integration: integration };
      return prevState;
    });

    setShowSelectIntegration(false);
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
      onUpdateRequest();
    } finally {
      setEditing(false);
      setLoading(false);
    }
  };

  const removePassword = async () => {
    setShowDeleteModal(false);
    setLoading(true);

    try {
      await api.remove(password._id);
      onClose();
      onUpdateRequest();
    } finally {
      setEditing(false);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <IconContext.Provider value={{ className: styles.header__button__icon }}>
          <SwitchTransition>
            <CSSTransition
              key={isEditing ? 'save' : 'edit'}
              timeout={200}
              classNames={{
                enter: styles['edit_enter'],
                enterActive: styles['edit_enter-active'],
                exit: styles['edit_exit'],
                exitActive: styles['edit_exit-active'],
              }}
            >
              <Button
                loading={isLoading}
                onClick={() => (isEditing ? savePassword() : setEditing(true))}
                className={classNames(styles.header__button)}
              >
                {isEditing ? (
                  <>
                    <HiMiniCheckCircle /> Save
                  </>
                ) : (
                  <>
                    <HiMiniPencil /> Edit
                  </>
                )}
              </Button>
            </CSSTransition>
          </SwitchTransition>
          <Button loading={isLoading} onClick={() => setShowDeleteModal(true)} className={styles.header__button}>
            <HiMiniTrash /> Delete
          </Button>

          <SwitchTransition>
            <CSSTransition
              key={isEditing ? 'cancel' : 'close'}
              timeout={200}
              classNames={{
                enter: styles.close_enter,
                enterActive: styles['close_enter-active'],
                exit: styles.close_exit,
                exitActive: styles['close_exit-active'],
              }}
            >
              {isEditing ? (
                <Button onClick={onCancel} className={styles.header__button}>
                  <HiMiniXMark /> Cancel
                </Button>
              ) : (
                <Button onClick={onClose} className={styles.header__button}>
                  <HiMiniXMark /> Close
                </Button>
              )}
            </CSSTransition>
          </SwitchTransition>
        </IconContext.Provider>
      </div>

      <div className={styles.title}>
        <Favicon website={website} />
        <input
          value={password.name}
          onChange={(e) => setPassword((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Title"
          className={styles.title__input}
          readOnly={!isEditing}
        />
        <CSSTransition
          in={isEditing}
          timeout={200}
          classNames={{
            appear: styles.title__buttons_enter,
            appearActive: styles['title__buttons_enter-active'],
            enter: styles.title__buttons_enter,
            enterActive: styles['title__buttons_enter-active'],
            exit: styles.title__buttons_exit,
            exitActive: styles['title__buttons_exit-active'],
          }}
          unmountOnExit
        >
          <div className={styles.title__buttons}>
            <Button onClick={() => setShowSelectIntegration(true)} className={styles.title__buttons__button}>
              <HiMiniLink />
            </Button>
            <Button onClick={() => setShowNewFieldModal(true)} className={styles.title__buttons__button}>
              <HiMiniPlus />
            </Button>
          </div>
        </CSSTransition>
      </div>

      <TransitionGroup className={styles['field-list']}>
        {password.credentials.fields?.map((field) => (
          <CSSTransition
            classNames={{
              enter: styles['password_enter'],
              enterActive: styles['password_enter-active'],
              exit: styles['password_exit'],
              exitActive: styles['password_exit-active'],
            }}
            timeout={200}
            key={field._id}
          >
            <Field
              onInput={(value) => handleFieldInput(field._id, value)}
              onToggleShow={() => handleFieldToggleShow(field._id)}
              onDelete={() => handleDeleteField(field._id)}
              field={field}
              readOnly={!isEditing}
            />
          </CSSTransition>
        ))}
        <>
          {password.credentials.integration && (
            <>
              <h4>Integration</h4>
              <Password
                onClick={
                  isEditing
                    ? () => setShowSelectIntegration(true)
                    : onPasswordSelect
                    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      () => onPasswordSelect(password.credentials.integration!)
                    : undefined
                }
                password={password.credentials.integration}
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
      </TransitionGroup>

      <Modal
        onCloseRequest={() => setShowNewFieldModal(false)}
        show={showNewFieldModal}
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
        onCloseRequest={() => setShowDeleteModal(false)}
        show={showDeleteModal}
        title="Confirm action"
        buttons={[
          { title: 'Yes', onClick: removePassword, secondary: true },
          { title: 'No', onClick: () => setShowDeleteModal(false) },
        ]}
      >
        <p>
          Are you sure you want to delete <b>{password.name}</b>?
        </p>
      </Modal>

      <Modal
        onCloseRequest={() => setShowSelectIntegration(false)}
        show={showSelectIntegration}
        title="Select integration"
      >
        <SearchVault
          query={query}
          onInput={(value) => setQuery(value)}
          totalCount={totalCount}
          onSearchRequest={search}
          noButtons
        />
        <PasswordList
          onPaginationRequest={paginate}
          passwords={passwords}
          fetching={fetching}
          selectedPassword={password.credentials.integration}
          onPasswordSelect={handleIntegrationSelect}
        />
      </Modal>
    </div>
  );
};

export default PasswordEditor;
