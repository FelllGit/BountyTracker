import { create } from "zustand";

interface LogoHoverState {
  isHovered: boolean;
  setHovered: (hovered: boolean) => void;
}

export const useLogoHoverStore = create<LogoHoverState>((set) => ({
  isHovered: false,
  setHovered: (hovered) => set({ isHovered: hovered }),
}));
