import { create } from 'zustand';
import { Password } from '../utils/types';

export interface EditorState {
  selectedPassword: Password | null;
  setSelectedPassword(selectedPassword: Password | null): void;
}

export const getDefaultEditorState = (): Omit<EditorState, 'setSelectedPassword'> => ({
  selectedPassword: null,
});

const useEditorStore = create<EditorState>((set) => ({
  ...getDefaultEditorState(),
  setSelectedPassword(selectedPassword) {
    set({ selectedPassword });
  },
}));

export default useEditorStore;
