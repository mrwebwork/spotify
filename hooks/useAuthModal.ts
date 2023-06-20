import { create } from "zustand";

interface AuthModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
    isOpen: false,
    onOpen: () => ({ isOpen: true }),
    onClose: () => ({ isOpen: false }),
}));