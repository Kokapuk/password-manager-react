import cn from 'classnames';
import { useEffect } from 'react';
import PasswordEditor from '../../components/PasswordEditor';
import PasswordList from '../../components/PasswordList';
import Search from '../../components/Search';
import useRedirect from '../../hooks/useRedirect';
import useEditorStore from '../../store/editor';
import usePasswordsStore from '../../store/passwords';
import styles from './Home.module.scss';

const Home = () => {
  const { selectedPassword, setSelectedPassword } = useEditorStore();
  const {
    passwords,
    isFetching,
    isFetchFailed,
    totalCount,
    query,
    fetch: fetchPasswords,
    paginate: paginatePasswords,
  } = usePasswordsStore();
  useRedirect('authOnly');

  useEffect(() => {
    fetchPasswords(undefined, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={cn(styles.passwordList, !selectedPassword && styles.active)}>
          <Search totalCount={totalCount} onQueryUpdate={fetchPasswords} />
          <PasswordList
            passwords={passwords}
            isFetching={isFetching}
            isFetchFailed={isFetchFailed}
            query={query}
            selectedPasswordId={selectedPassword?._id}
            onPasswordSelect={setSelectedPassword}
            onPaginationTriggerReached={paginatePasswords}
          />
        </div>
        <div className={cn(styles.passwordEditorContainer, !!selectedPassword && styles.active)}>
          {selectedPassword ? (
            <PasswordEditor key={selectedPassword._id} />
          ) : (
            <p className={styles.placeholder}>Select a password to view and edit it</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
