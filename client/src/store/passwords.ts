import { create } from 'zustand';
import api from '../utils/api';
import { Password } from '../utils/types';
import useAuthStore from './auth';

export interface PasswordsState {
  passwords: Password[];
  isFetching: boolean;
  isFailedToFetch: boolean;
  retryDelay: number;
  page: number;
  totalCount?: number;
  query: string;
  fetch(query?: string, page?: number, initialFetch?: boolean): Promise<void>;
}

export const getDefaultPasswordsState = (): Omit<PasswordsState, 'fetch'> => ({
  passwords: [],
  isFetching: true,
  isFailedToFetch: false,
  retryDelay: 5000,
  page: 1,
  totalCount: undefined,
  query: '',
});

export const limitPerPage = 30;

const usePasswordsStore = create<PasswordsState>((set, get) => ({
  ...getDefaultPasswordsState(),
  async fetch(query = '', page = 1, initialFetch = false) {
    if (
      (!initialFetch && get().isFetching) ||
      get().isFailedToFetch ||
      !useAuthStore.getState().token ||
      (get().totalCount !== undefined &&
        query === get().query &&
        get().passwords.length >= (get().totalCount as number))
    ) {
      return;
    }

    if (query !== get().query) {
      set({ passwords: [] });
    }

    set({ isFetching: true });

    try {
      const [totalCount, newPasswords] = await api.findAll(query, limitPerPage, page);
      set((state) => ({
        ...state,
        passwords: page === 1 ? newPasswords : [...state.passwords, ...newPasswords],
        retryDelay: 5000,
        page,
        totalCount,
        query,
      }));
    } catch {
      set({ isFailedToFetch: true });

      setTimeout(() => {
        set({
          isFailedToFetch: false,
          retryDelay: get().retryDelay < 40000 ? get().retryDelay * 2 : get().retryDelay,
          page: 1
        });
      }, get().retryDelay);
    } finally {
      set({ isFetching: false });
    }
  },
}));

export default usePasswordsStore;
