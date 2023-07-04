import { create } from 'zustand';

interface AuthModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
