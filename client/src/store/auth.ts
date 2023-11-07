import { create } from 'zustand';

export interface AuthState {
  token: string | null;
  setToken(token: string | null): void;
}

export const getDefaultAuthState = (): Omit<AuthState, 'setToken'> => ({
  token: null,
});

const useAuthStore = create<AuthState>((set) => ({
  ...getDefaultAuthState(),
  setToken(token) {
    set({ token });
  },
}));

export default useAuthStore;
