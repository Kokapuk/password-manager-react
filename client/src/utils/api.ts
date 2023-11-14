import axios from 'axios';
import { AuthType } from '../pages/Auth';
import useAuthStore from '../store/auth';
import { Password, PasswordDTO } from './types';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      saveToken(null);
    }

    throw error;
  }
);

export const setToken = (token: string | null) => {
  useAuthStore.setState({ token });

  if (!token) {
    delete api.defaults.headers.common['Authorization'];
    return;
  }

  api.defaults.headers.common['Authorization'] = token;
};

export const saveToken = (token: string | null) => {
  setToken(token);

  if (!token) {
    return sessionStorage.removeItem('token');
  }

  sessionStorage.setItem('token', token);
};

const auth = async (login: string, password: string, authType: AuthType) => {
  try {
    const response = await api.post(authType === 'signUp' ? '/auth/signUp' : '/auth/signIn', { login, password });
    saveToken(response.data.token);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const create = async (name: string, website: string): Promise<Password> => {
  try {
    const response = await api.post('/passwords', { name, website });
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const findAll = async (
  query: string,
  limit: number,
  page: number
): Promise<[totalCount: number, passwords: Password[]]> => {
  try {
    const response = await api.get('/passwords', { params: { query: query !== '' ? query : null, limit, page } });
    return [Number(response.headers['x-total-count']), response.data];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// const findOne = (id: string): Promise<Password> => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const password = passwords.find((password) => password._id === id);

//       if (!password) {
//         return reject();
//       }

//       resolve(JSON.parse(JSON.stringify(password)));
//     }, 500);
//   });
// };

const update = async (id: string, updatedObject: PasswordDTO): Promise<void> => {
  try {
    await api.put(`/passwords/${id}`, {
      ...updatedObject,
      credentials: {
        ...updatedObject.credentials,
        integration: updatedObject.credentials.integration && updatedObject.credentials.integration._id,
      },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const remove = async (id: string): Promise<void> => {
  try {
    await api.delete(`/passwords/${id}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default { auth, create, findAll, update, remove };
