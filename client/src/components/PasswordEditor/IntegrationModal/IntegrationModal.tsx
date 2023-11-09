import useEditorStore from '../../../store/editor';
import { Password } from '../../../utils/types';
import Modal from '../../Modal';
import PasswordList from '../../PasswordList';
import PasswordSkeleton from '../../PasswordSkeleton';
import Search from '../../Search';

const IntegrationModal = () => {
  const { selectedPassword, isIntegrationModalOpen, setDraftPassword, setIntegrationModalOpen } = useEditorStore();

  if (!selectedPassword) {
    return null;
  }

  const handleIntegrationSelect = (integration: Password | undefined) => {
    setDraftPassword((prev) => {
      const prevState: Password = JSON.parse(JSON.stringify(prev));

      prevState.credentials.integration = integration;
      return prevState;
    });

    setIntegrationModalOpen(false);
  };

  return (
    <Modal
      onCloseRequest={() => setIntegrationModalOpen(false)}
      isOpen={isIntegrationModalOpen}
      title="Select integration"
      fullHeight
    >
      <Search noButtons />
      {isIntegrationModalOpen ? (
        <PasswordList onPasswordSelect={handleIntegrationSelect} filter={(item) => item._id !== selectedPassword._id} />
      ) : (
        Array(20)
          .fill(0)
          .map((_item, index) => <PasswordSkeleton key={index} />)
      )}
    </Modal>
  );
};

export default IntegrationModal;
