import useEditorStore from '../../../store/editor';
import simplifyUrl from '../../../utils/simplifyUrl';
import { Password as PasswordType } from '../../../utils/types';
import Field from '../../Field';
import Password from '../../Password';
import styles from './FieldList.module.scss';

const FieldList = () => {
  const { isEditing, draftPassword, setSelectedPassword, setDraftPassword, setIntegrationModalOpen } = useEditorStore();

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
    <div className={styles.fieldList}>
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
            <Password
              key={draftPassword.credentials.integration._id}
              onClick={() =>
                isEditing
                  ? setIntegrationModalOpen(true)
                  : setSelectedPassword(draftPassword.credentials.integration as PasswordType)
              }
              password={draftPassword.credentials.integration as PasswordType}
            />
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

export default FieldList;
