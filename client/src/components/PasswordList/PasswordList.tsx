import { useEffect, useRef } from 'react';
import { limitPerPage } from '../../store/passwords';
import { Password as PasswordType } from '../../utils/types';
import Password from '../Password';
import PasswordSkeleton from '../PasswordSkeleton';
import styles from './PasswordList.module.scss';

interface Props {
  passwords: PasswordType[];
  isFetching: boolean;
  query: string;
  selectedPasswordId?: string;
  onPasswordSelect?(password: PasswordType): void;
  onPaginationTriggerReached(): void;
}

const PasswordList = ({
  passwords,
  isFetching,
  query,
  selectedPasswordId,
  onPasswordSelect,
  onPaginationTriggerReached,
}: Props) => {
  const list = useRef<HTMLDivElement>(null);
  const paginationTrigger = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFetching && passwords.length === 0) {
      list.current?.scrollTo({ top: 0 });
    }
  }, [isFetching, passwords.length]);

  useEffect(() => {
    if (isFetching) {
      return;
    }

    if (!paginationTrigger.current) {
      return;
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        onPaginationTriggerReached();
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: paginationTrigger.current.parentElement,
      rootMargin: '450px',
      threshold: 0,
    });
    observer.observe(paginationTrigger.current);

    return () => observer.disconnect();
  }, [isFetching, onPaginationTriggerReached]);

  return (
    <div ref={list} className={styles.list}>
      {passwords.map((password) => (
        <Password
          key={password._id}
          password={password}
          isSelected={selectedPasswordId === password._id}
          onClick={onPasswordSelect && (() => onPasswordSelect(password))}
        />
      ))}
      {!isFetching && <div ref={paginationTrigger} data-pagination-trigger style={{ height: 1, flexShrink: 0 }} />}
      {isFetching && new Array(limitPerPage).fill(0).map((_item, index) => <PasswordSkeleton key={index} />)}
      {!isFetching && passwords.length === 0 && (
        <p className={styles.emptyPlaceholder}>{query ? 'Nothing found' : 'Nothing yet'}</p>
      )}
    </div>
  );
};

export default PasswordList;
