import { create } from 'zustand';
import api from '../utils/api';
import { Password } from '../utils/types';

export interface PasswordsState {
  passwords: Password[];
  isFetching: boolean;
  isFailedToFetch: boolean;
  retryDelay: number;
  page: number;
  totalCount: number;
  query: string;
  fetch(query?: string, page?: number, initialFetch?: boolean): Promise<void>;
}

export const getDefaultPasswordsState = (): Omit<PasswordsState, 'fetch'> => ({
  passwords: [],
  isFetching: true,
  isFailedToFetch: false,
  retryDelay: 5000,
  page: 1,
  totalCount: 0,
  query: '',
});

export const limitPerPage = 30;

const usePasswordsStore = create<PasswordsState>((set, get) => ({
  ...getDefaultPasswordsState(),
  async fetch(query = '', page = 1, initialFetch = false) {
    if (
      (!initialFetch && get().isFetching) ||
      get().isFailedToFetch ||
      (get().totalCount && query === get().query && get().passwords.length >= get().totalCount)
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
        });
      }, get().retryDelay);
    } finally {
      set({ isFetching: false });
    }
  },
}));

export default usePasswordsStore;
