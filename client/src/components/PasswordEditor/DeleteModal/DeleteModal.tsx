import useEditorStore from '../../../store/editor';
import usePasswordsStore from '../../../store/passwords';
import api from '../../../utils/api';
import Modal from '../../Modal';

const DeleteModal = () => {
  const {
    selectedPassword,
    draftPassword,
    isDeleteModalOpen,
    setSelectedPassword,
    setEditing,
    setLoading,
    setDeleteModalOpen,
  } = useEditorStore();
  const { query, fetch: fetchPasswords } = usePasswordsStore();

  if (!selectedPassword || !draftPassword) {
    return null;
  }

  const removePassword = async () => {
    setDeleteModalOpen(false);
    setLoading(true);

    try {
      await api.remove(draftPassword._id);
      setSelectedPassword(null);
      fetchPasswords(query);
    } finally {
      setEditing(false);
      setLoading(false);
    }
  };

  return (
    <Modal
      onCloseRequest={() => setDeleteModalOpen(false)}
      isOpen={isDeleteModalOpen}
      title="Confirm action"
      buttons={[
        { title: 'Yes', onClick: removePassword, secondary: true },
        { title: 'No', onClick: () => setDeleteModalOpen(false) },
      ]}
    >
      <p>
        Are you sure you want to delete <b>{selectedPassword.name}</b>?
      </p>
    </Modal>
  );
};

export default DeleteModal;
