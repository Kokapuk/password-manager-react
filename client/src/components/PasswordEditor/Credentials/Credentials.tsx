import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useEditorStore from '../../../store/editor';
import simplifyUrl from '../../../utils/simplifyUrl';
import { Password as PasswordType } from '../../../utils/types';
import Field from '../../Field';
import Integration from '../Integration';
import styles from './Credentials.module.scss';

const Credentials = () => {
  const { selectedPassword, isEditing, draftPassword, setDraftPassword } = useEditorStore();

  if (!draftPassword) {
    return null;
  }

  const handleFieldInput = (id: string, value: string) => {
    setDraftPassword((prev) => {
      if (!prev) {
        return prev;
      }

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
    setDraftPassword((prev) => {
      const prevState: PasswordType = JSON.parse(JSON.stringify(prev));

      if (!prevState.credentials.fields) {
        return prev;
      }

      const index = prevState.credentials.fields.findIndex((item) => item._id === id);
      prevState.credentials.fields[index].isPassword = !prevState.credentials.fields[index].isPassword;

      return prevState;
    });
  };

  const handleFieldRemove = (id: string) => {
    setDraftPassword((prev) => {
      const prevState: PasswordType = JSON.parse(JSON.stringify(prev));

      if (!prevState.credentials.fields) {
        return prev;
      }

      prevState.credentials.fields = prevState.credentials.fields.filter((item) => item._id !== id);

      return prevState;
    });
  };

  return (
    <div className={styles.container}>
      <TransitionGroup className={styles.fieldList}>
        {draftPassword.credentials.fields?.map((field) => (
          <CSSTransition
            key={field._id}
            timeout={200}
            classNames={{
              enter: styles.fieldEnter,
              enterActive: styles.fieldEnterActive,
              exit: styles.fieldExit,
              exitActive: styles.fieldExitActive,
            }}
          >
            <>
              <Field
                onInput={(value) => handleFieldInput(field._id, value)}
                onToggleShow={
                  isEditing || selectedPassword?.credentials.fields?.find((item) => item._id === field._id)?.isPassword
                    ? () => handleFieldToggleShow(field._id)
                    : undefined
                }
                onRemove={() => handleFieldRemove(field._id)}
                field={field}
                readOnly={!isEditing}
              />
            </>
          </CSSTransition>
        ))}
      </TransitionGroup>
      <CSSTransition
        in={!!draftPassword.credentials.integration}
        classNames={{
          enter: styles.integrationEnter,
          enterActive: styles.integrationEnterActive,
          exit: styles.integrationExit,
          exitActive: styles.integrationExitActive,
        }}
        timeout={200}
        unmountOnExit
      >
        <Integration />
      </CSSTransition>
      <Field
        website
        onInput={(value) =>
          setDraftPassword(
            (prev) =>
              prev && {
                ...prev,
                website: simplifyUrl(value),
              }
          )
        }
        readOnly={!isEditing}
        field={{ title: 'Website', value: draftPassword.website, isPassword: false }}
      />
    </div>
  );
};

export default Credentials;
