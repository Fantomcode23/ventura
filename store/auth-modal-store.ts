import { create } from "zustand";

interface authModalStore {
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const useAuthModal = create<authModalStore>((set) => ({
  isAuthModalOpen: false,
  setIsAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
}));

export default useAuthModal;
