import { create } from "zustand";

type HeartsModalState = {
  isOpen: boolean;
  showVideoOnOpen: boolean;
  open: () => void;
  openWithVideo: () => void;
  close: () => void;
  onHeartsRefilled?: () => void;
  setOnHeartsRefilled: (callback: () => void) => void;
};

export const useHeartsModal = create<HeartsModalState>((set, get) => ({
  isOpen: false,
  showVideoOnOpen: false,
  open: () => set({ isOpen: true, showVideoOnOpen: false }),
  openWithVideo: () => set({ isOpen: true, showVideoOnOpen: true }),
  close: () => set({ isOpen: false, showVideoOnOpen: false }),
  onHeartsRefilled: undefined,
  setOnHeartsRefilled: (callback: () => void) => set({ onHeartsRefilled: callback }),
}));
