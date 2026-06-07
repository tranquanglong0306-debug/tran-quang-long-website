import { create } from 'zustand';

type PanelType = 'about' | 'skills' | 'projects' | 'contact' | null;

interface AppState {
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
}

export const useAppState = create<AppState>((set) => ({
  activePanel: null,
  setActivePanel: (panel) => set({ activePanel: panel }),
}));
