import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../app/store';

export default (access: 'AuthOnly' | 'NoAuthOnly') => {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (access === 'AuthOnly' && !auth.token) {
      navigate('/signIn');
    }

    if (access === 'NoAuthOnly' && auth.token) {
      navigate('/');
    }
  }, [access, auth.token, navigate]);
};
