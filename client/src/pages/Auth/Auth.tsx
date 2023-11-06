import classNames from 'classnames';
import { useState } from 'react';
import { HiMiniLockClosed, HiMiniUser } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Form from '../../components/Form';
import TextInput from '../../components/TextInput';
import useRedirect from '../../hooks/useRedirect';
import api from '../../utils/api';
import { AuthType } from '../../utils/types';
import styles from './Auth.module.scss';

interface Props {
  authType: AuthType;
}

const Auth = ({ authType }: Props) => {
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<{ login: string; password: string }>({
    login: localStorage.getItem('login') ?? '',
    password: '',
  });
  const [isLoading, setLoading] = useState(false);
  useRedirect('noAuthOnly');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.auth(credentials.login, credentials.password, authType);
      localStorage.setItem('login', credentials.login);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} error={error} title={authType}>
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
      <Button loading={isLoading} className={styles.button}>
        {authType}
      </Button>
      <Link to={authType === 'Sign Up' ? '/signIn' : '/signUp'}>
        <Button
          loading={isLoading}
          className={classNames(styles.button, styles['button__alternate-auth'])}
          type="button"
        >
          {authType === 'Sign Up' ? 'Sign In' : 'Sign Up'}
        </Button>
      </Link>
    </Form>
  );
};

export default Auth;
