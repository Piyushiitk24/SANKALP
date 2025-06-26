import { create } from "zustand";

type HeartsModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  onHeartsRefilled?: () => void;
  setOnHeartsRefilled: (callback: () => void) => void;
};

export const useHeartsModal = create<HeartsModalState>((set, get) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  onHeartsRefilled: undefined,
  setOnHeartsRefilled: (callback: () => void) => set({ onHeartsRefilled: callback }),
}));
