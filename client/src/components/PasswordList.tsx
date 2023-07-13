import { useEffect, useRef } from 'react';
import styles from '../styles/PasswordList.module.scss';
import { Password as PasswordType } from '../utils/types';
import Password from './Password';
import PasswordSkeleton from './PasswordSkeleton';

interface Props {
  passwords: PasswordType[];
  onPaginationRequest(): void;
  fetching: boolean;
  selectedPassword?: PasswordType | null;
  onPasswordSelect?(password: PasswordType): void;
}

const PasswordList = ({ passwords, onPaginationRequest, fetching, selectedPassword, onPasswordSelect }: Props) => {
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fetching && passwords.length === 0) {
      list.current?.scrollTo({ top: 0 });
    }
  }, [fetching]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (event.currentTarget.scrollHeight - (event.currentTarget.scrollTop + event.currentTarget.clientHeight) < 100) {
      onPaginationRequest();
    }
  };

  return (
    <div ref={list} onScroll={handleScroll} className={styles.list}>
      {passwords.map((password) => (
        <Password
          selected={selectedPassword?._id === password._id}
          onClick={onPasswordSelect && (() => onPasswordSelect(password))}
          key={password._id}
          password={password}
        />
      ))}
      {fetching && new Array(20).fill(0).map((_item, index) => <PasswordSkeleton key={index} />)}
      {passwords.length === 0 && <p className={styles.list__nothing}>Nothing yet</p>}
    </div>
  );
};

export default PasswordList;
