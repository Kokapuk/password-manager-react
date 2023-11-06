import { create } from 'zustand';

export interface AuthState {
  token: string | null;
  setToken(token: string | null): void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken(token) {
    set({ token });
  },
}));

export default useAuthStore;
