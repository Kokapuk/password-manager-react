import useEditorStore from '../../../store/editor';
import simplifyUrl from '../../../utils/simplifyUrl';
import { Password as PasswordType } from '../../../utils/types';
import Field from '../../Field';
import Integration from '../Integration';
import styles from './Credentials.module.scss';

const Credentials = () => {
  const { isEditing, draftPassword, setDraftPassword } = useEditorStore();

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

  const handleDeleteField = (id: string) => {
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
      {draftPassword.credentials.fields?.map((field) => (
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
        {draftPassword.credentials.integration && (
          <>
            <h4>Integration</h4>
            <Integration />
          </>
        )}
      </>
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
