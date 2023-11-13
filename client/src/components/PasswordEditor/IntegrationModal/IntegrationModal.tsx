import { useCallback, useEffect, useRef, useState } from 'react';
import useEditorStore from '../../../store/editor';
import { limitPerPage } from '../../../store/passwords';
import api from '../../../utils/api';
import { Password } from '../../../utils/types';
import Modal from '../../Modal';
import PasswordList from '../../PasswordList';
import PasswordSkeleton from '../../PasswordSkeleton';
import Search from '../../Search';
import styles from './IntegrationModal.module.scss';

const IntegrationModal = () => {
  const { selectedPassword, draftPassword, isIntegrationModalOpen, setDraftPassword, setIntegrationModalOpen } =
    useEditorStore();
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [isFetching, setFetching] = useState(true);
  const [isFailedToFetch, setFailedToFetch] = useState(false);
  const [retryDelay, setRetryDelay] = useState(5000);
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
      if (
        isFetching ||
        isFailedToFetch ||
        (totalCount !== undefined && fetchQuery === query && passwords.length >= totalCount)
      ) {
        return;
      }

      if (fetchQuery !== query) {
        setPasswords([]);
      }

      setFetching(true);

      try {
        const [totalCount, newPasswords] = await api.findAll(fetchQuery, limitPerPage, fetchPage);
        setPasswords((prev) => (fetchPage === 1 ? newPasswords : [...prev, ...newPasswords]));
        setRetryDelay(5000);
        page.current = fetchPage;
        setTotalCount(totalCount);
        setQuery(fetchQuery);
      } catch {
        setFailedToFetch(true);

        setTimeout(() => {
          setFailedToFetch(false);
          setRetryDelay((prev) => (prev < 40000 ? prev * 2 : prev));
        }, retryDelay);
      } finally {
        setFetching(false);
      }
    },
    [isFailedToFetch, isFetching, passwords.length, query, retryDelay, totalCount]
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
      containerClass={styles.modal}
    >
      {isIntegrationModalOpen && (
        <Search totalCount={totalCount ? totalCount - 1 : totalCount} noButtons onQueryUpdate={fetchPasswords} />
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
