import { create } from 'zustand';

interface SubscribeModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSubscribeModal = create<SubscribeModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
