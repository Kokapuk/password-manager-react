import { useCallback, useEffect, useRef, useState } from 'react';
import useEditorStore from '../../../store/editor';
import { Password } from '../../../utils/types';
import Modal from '../../Modal';
import PasswordList from '../../PasswordList';
import PasswordSkeleton from '../../PasswordSkeleton';
import Search from '../../Search';
import api from '../../../utils/api';
import { limitPerPage } from '../../../store/passwords';

const IntegrationModal = () => {
  const { selectedPassword, draftPassword, isIntegrationModalOpen, setDraftPassword, setIntegrationModalOpen } =
    useEditorStore();
  const [totalCount, setTotalCount] = useState(0);
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [isFetching, setFetching] = useState(true);
  const [query, setQuery] = useState('');
  const page = useRef(1);

  useEffect(() => {
    if (!isIntegrationModalOpen) {
      return;
    }

    (async () => {
      try {
        const [totalCount, passwords] = await api.findAll('', limitPerPage, 1);
        setTotalCount(totalCount);
        setPasswords(passwords);
        setQuery('');
        page.current = 1;
      } finally {
        setFetching(false);
      }
    })();
  }, [isIntegrationModalOpen]);

  const fetchPasswords = useCallback(
    async (fetchQuery = '', fetchPage = 1) => {
      if (isFetching || (totalCount && fetchQuery === query && passwords.length >= totalCount)) {
        return;
      }

      if (fetchQuery !== query) {
        setPasswords([]);
      }

      setFetching(true);

      try {
        const [totalCount, newPasswords] = await api.findAll(fetchQuery, limitPerPage, fetchPage);
        setPasswords((prev) => (fetchPage === 1 ? newPasswords : [...prev, ...newPasswords]));
        page.current = fetchPage;
        setTotalCount(totalCount);
        setQuery(fetchQuery);
      } finally {
        setFetching(false);
      }
    },
    [isFetching, passwords.length, query, totalCount]
  );

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

  const handlePaginationTriggerReached = () => {
    fetchPasswords(query, page.current + 1);
  };

  return (
    <Modal
      onCloseRequest={() => setIntegrationModalOpen(false)}
      isOpen={isIntegrationModalOpen}
      title="Select integration"
      fullHeight
    >
      {isIntegrationModalOpen && (
        <Search totalCount={totalCount > 0 ? totalCount - 1 : totalCount} noButtons onQueryUpdate={fetchPasswords} />
      )}
      {isIntegrationModalOpen ? (
        <PasswordList
          selectedPasswordId={draftPassword?.credentials.integration?._id}
          passwords={passwords.filter((item) => item._id !== selectedPassword._id)}
          isFetching={isFetching}
          query={query}
          onPasswordSelect={handleIntegrationSelect}
          onPaginationTriggerReached={handlePaginationTriggerReached}
        />
      ) : (
        Array(20)
          .fill(0)
          .map((_item, index) => <PasswordSkeleton key={index} />)
      )}
    </Modal>
  );
};

export default IntegrationModal;
