import useEditorStore from '../../store/editor';
import CreateFieldModal from './CreateFieldModal';
import DeleteModal from './DeleteModal';
import FieldList from './FieldList';
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
      <FieldList />
      <CreateFieldModal />
      <IntegrationModal />
      <DeleteModal />
    </div>
  );
};

export default PasswordEditor;
