import { useEffect, useMemo, useRef } from 'react';
import usePasswordsStore, { limitPerPage } from '../../store/passwords';
import { Password as PasswordType } from '../../utils/types';
import Password from '../Password';
import PasswordSkeleton from '../PasswordSkeleton';
import styles from './PasswordList.module.scss';

interface Props {
  onPasswordSelect?(password: PasswordType): void;
  filter?(password: PasswordType): boolean;
}

const PasswordList = ({ onPasswordSelect, filter }: Props) => {
  const { fetching, passwords, query, page, fetch: fetchPasswords } = usePasswordsStore();
  const list = useRef<HTMLDivElement>(null);
  const filteredPasswords = useMemo(
    () => (filter ? passwords.filter((password) => filter(password)) : passwords),
    [filter, passwords]
  );

  useEffect(() => {
    if (fetching && passwords.length === 0) {
      list.current?.scrollTo({ top: 0 });
    }
  }, [fetching, passwords.length]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (event.currentTarget.scrollHeight - (event.currentTarget.scrollTop + event.currentTarget.clientHeight) < 100) {
      fetchPasswords(query, page + 1);
    }
  };

  return (
    <div ref={list} onScroll={handleScroll} className={styles.list}>
      {filteredPasswords.map((password) => (
        <Password
          onClick={onPasswordSelect && (() => onPasswordSelect(password))}
          key={password._id}
          password={password}
        />
      ))}
      {fetching && new Array(limitPerPage).fill(0).map((_item, index) => <PasswordSkeleton key={index} />)}
      {!fetching && filteredPasswords.length === 0 && (
        <p className={styles.emptyPlaceholder}>{query ? 'Nothing found' : 'Nothing yet'}</p>
      )}
    </div>
  );
};

export default PasswordList;
