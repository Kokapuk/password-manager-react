import useEditorStore from '../../store/editor';
import CreateFieldModal from './CreateFieldModal';
import Credentials from './Credentials';
import DeleteModal from './DeleteModal';
import ExposedPasswordModal from './ExposedPasswordModal';
import Header from './Header';
import IntegrationModal from './IntegrationModal';
import styles from './PasswordEditor.module.scss';
import Title from './Title';

const PasswordEditor = () => {
  const { selectedPassword, draftPassword } = useEditorStore();

  if (!selectedPassword || !draftPassword) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Header />
      <Title />
      <Credentials />
      <CreateFieldModal />
      <IntegrationModal />
      <DeleteModal />
      <ExposedPasswordModal />
    </div>
  );
};

export default PasswordEditor;
