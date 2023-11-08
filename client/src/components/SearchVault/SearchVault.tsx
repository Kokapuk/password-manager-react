import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HiMiniMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import usePasswordsStore from '../../store/passwords';
import Button from '../Button';
import TextInput from '../TextInput';
import Buttons from './Buttons';
import styles from './SearchVault.module.scss';

interface Props {
  noButtons?: boolean;
}

const SearchVault = ({ noButtons }: Props) => {
  const [query, setQuery] = useState('');
  const { fetch: fetchPasswords, totalCount } = usePasswordsStore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchPasswordsWithQuery = useCallback(
    debounce((query: string) => fetchPasswords(query), 250),
    []
  );
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    fetchPasswordsWithQuery(query);
  }, [fetchPasswordsWithQuery, query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={styles.container}>
      <TextInput
        autoFocus
        fullHeight
        icon={<HiMiniMagnifyingGlass />}
        value={query}
        onChange={handleInputChange}
        type="search"
        placeholder={`Search Vault (${totalCount})`}
      >
        {!!query && (
          <Button onClick={handleClear} className={styles.clearButton}>
            <HiMiniXMark />
          </Button>
        )}
      </TextInput>

      {!noButtons && <Buttons />}
    </div>
  );
};

export default SearchVault;
