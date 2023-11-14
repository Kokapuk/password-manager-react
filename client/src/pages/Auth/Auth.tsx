import { AxiosError } from 'axios';
import cn from 'classnames';
import { useState } from 'react';
import { HiMiniLockClosed, HiMiniUser } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { AuthType } from '.';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import useRedirect from '../../hooks/useRedirect';
import api from '../../utils/api';
import styles from './Auth.module.scss';

interface Props {
  authType: AuthType;
}

const Auth = ({ authType }: Props) => {
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<{ login: string; password: string }>({
    login: authType === 'signIn' ? localStorage.getItem('login') ?? '' : '',
    password: '',
  });
  const [isLoading, setLoading] = useState(false);
  const authTitle = authType === 'signUp' ? 'Sign Up' : 'Sign In';
  useRedirect('noAuthOnly');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.auth(credentials.login, credentials.password, authType);
      localStorage.setItem('login', credentials.login);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message ?? err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>{authTitle}</h2>
        <TextInput
          autoFocus={!credentials.login}
          value={credentials.login}
          onChange={(e) => setCredentials((prev) => ({ ...prev, login: e.target.value.trimStart() }))}
          required
          minLength={3}
          type="text"
          placeholder="Login"
          icon={<HiMiniUser />}
        />
        <TextInput
          autoFocus={!!credentials.login}
          value={credentials.password}
          onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
          required
          minLength={6}
          type="password"
          placeholder="Password"
          icon={<HiMiniLockClosed />}
        />
        {error && <p className={styles.error}>{error}&nbsp;</p>}
        <div className={styles.buttonsContainer}>
          <Button loading={isLoading} className={styles.button}>
            {authTitle}
          </Button>
          <Link to={authType === 'signUp' ? '/signIn' : '/signUp'}>
            <Button loading={isLoading} className={cn(styles.button, styles.alternateAuth)} type="button">
              {authType === 'signUp' ? 'Sign In' : 'Sign Up'}
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Auth;
