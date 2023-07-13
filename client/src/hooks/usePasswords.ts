import { useEffect, useState } from 'react';
import { Password } from '../utils/types';
import api from '../utils/api';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';

export default () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [query, setQuery] = useState('');
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!fetching || !auth.token) {
      return;
    }

    (async () => {
      try {
        const [totalCount, newPasswords] = await api.findAll(query, 20, page);
        setPasswords((prev) => [...prev, ...newPasswords]);
        setPage((prev) => prev + 1);
        setTotalCount(totalCount);
      } finally {
        setFetching(false);
      }
    })();
  }, [fetching, query, auth.token]);

  const update = () => {
    setPasswords([]);
    setPage(1);
    setFetching(true);
  };

  const search = (query: string) => {
    update();
    setQuery(query);
  };

  const paginate = () => {
    if (fetching || passwords.length === totalCount) {
      return;
    }

    setFetching(true);
  };

  return { passwords, fetching, totalCount, update, search, paginate };
};
