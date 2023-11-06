import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth';

export default (access: 'authOnly' | 'noAuthOnly') => {
  const isAuthenticated = useAuthStore((store) => !!store.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (access === 'authOnly' && !isAuthenticated) {
      navigate('/signIn');
    }

    if (access === 'noAuthOnly' && isAuthenticated) {
      navigate('/');
    }
  }, [access, isAuthenticated, navigate]);
};
