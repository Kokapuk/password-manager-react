import { create } from 'zustand';
import { Password } from '../utils/types';

export interface EditorState {
  selectedPassword: Password | null;
  isEditing: boolean;
  isLoading: boolean;
  draftPassword?: Password;
  isDeleteModalOpen: boolean;
  isCreateFieldModalOpen: boolean;
  isIntegrationModalOpen: boolean;
  setSelectedPassword(selectedPassword: Password | null): void;
  setEditing(isEditing: boolean): void;
  setLoading(isLoading: boolean): void;
  setDraftPassword(draftPassword: Password | ((prev: Password | undefined) => Password | undefined)): void;
  setDeleteModalOpen(isDeleteModalOpen: boolean): void;
  setCreateFieldModalOpen(isCreateFieldModalOpen: boolean): void;
  setIntegrationModalOpen(isIntegrationModalOpen: boolean): void;
}

export const getDefaultEditorState = (): Omit<
  EditorState,
  | 'setSelectedPassword'
  | 'setEditing'
  | 'setLoading'
  | 'setDraftPassword'
  | 'setDeleteModalOpen'
  | 'setCreateFieldModalOpen'
  | 'setIntegrationModalOpen'
> => ({
  selectedPassword: null,
  isEditing: false,
  isLoading: false,
  isDeleteModalOpen: false,
  isCreateFieldModalOpen: false,
  isIntegrationModalOpen: false,
});

const useEditorStore = create<EditorState>((set) => ({
  ...getDefaultEditorState(),
  setSelectedPassword(selectedPassword) {
    set({ selectedPassword, isEditing: false, draftPassword: selectedPassword || undefined });
  },
  setEditing(isEditing) {
    set({ isEditing });
  },
  setLoading(isLoading) {
    set({ isLoading });
  },
  setDraftPassword(draftPassword) {
    if (typeof draftPassword === 'function') {
      set((prev) => ({ ...prev, draftPassword: draftPassword(prev.draftPassword) }));
    } else if (typeof draftPassword === 'object') {
      set((prev) => ({
        ...prev,
        draftPassword,
      }));
    }
  },
  setDeleteModalOpen(isDeleteModalOpen) {
    set({ isDeleteModalOpen });
  },
  setCreateFieldModalOpen(isCreateFieldModalOpen) {
    set({ isCreateFieldModalOpen });
  },
  setIntegrationModalOpen(isIntegrationModalOpen) {
    set({ isIntegrationModalOpen });
  },
}));

export default useEditorStore;
