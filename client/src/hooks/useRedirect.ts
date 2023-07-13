import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../app/store';
import { useEffect } from 'react';

export default (access: 'Auth' | 'NoAuth') => {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (access === 'Auth' && !auth.token) {
      navigate('/signIn');
    }

    if (access === 'NoAuth' && auth.token) {
      navigate('/');
    }
  }, [auth.token]);
};
