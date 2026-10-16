import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Settings {
  openaiKey: string;
  claudeKey: string;
  geminiKey: string;
  lmStudioUrl: string;
}

interface SettingsState {
  settings: Settings;
  setSettings: (settings: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        openaiKey: '',
        claudeKey: '',
        geminiKey: '',
        lmStudioUrl: 'http://localhost:1234/v1',
      },
      setSettings: (newSettings) =>
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),
    }),
    {
      name: 'jules-settings',
    }
  )
);
