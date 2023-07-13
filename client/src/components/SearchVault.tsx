import { useCallback } from 'react';
import { HiMiniMagnifyingGlass, HiMiniPlus, HiMiniXMark } from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import styles from '../styles/SearchVault.module.scss';
import debounce from '../utils/debounce';
import Button from './Button';
import TextInput from './TextInput';

interface Props {
  query: string;
  onInput(value: string): void;
  totalCount: number;
  onSearchRequest(query: string): void;
  onPasswordCreateRequest?(): void;
  noButtons?: boolean;
}

const SearchVault = ({ query, onInput, totalCount, onSearchRequest, onPasswordCreateRequest, noButtons }: Props) => {
  const requestSearch = useCallback(debounce(onSearchRequest, 250), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInput(event.target.value);
    requestSearch(event.target.value);
  };

  const handleClear = () => {
    onInput('');
    requestSearch('');
  };

  return (
    <div className={styles.container}>
      <TextInput
        autoFocus
        fullHeight
        icon={<HiMiniMagnifyingGlass />}
        value={query}
        onChange={handleInputChange}
        type='search'
        placeholder={`Search Vault (${totalCount})`}>
        <CSSTransition
          in={!!query}
          timeout={200}
          classNames={{
            enter: styles['clear-button_enter'],
            enterActive: styles['clear-button_enter-active'],
            exit: styles['clear-button_exit'],
            exitActive: styles['clear-button_exit-active'],
          }}
          unmountOnExit>
          <Button onClick={handleClear} className={styles['clear-button']}>
            <HiMiniXMark />
          </Button>
        </CSSTransition>
      </TextInput>

      {!noButtons && (
        <>
          <Button onClick={onPasswordCreateRequest} className={styles.button}>
            <HiMiniPlus />
          </Button>
          {/* <Link style={{ display: 'flex', flexShrink: 0, flexGrow: 0 }} to='/settings'>
            <Button className={styles.button}>
              <HiMiniCog8Tooth />
            </Button>
          </Link> */}
        </>
      )}
    </div>
  );
};

export default SearchVault;
