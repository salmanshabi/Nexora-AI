import { create } from 'zustand';

export type LanguageCode = 'auto' | 'en' | 'he' | 'ar';

export interface AppState {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
}

export const useAppStore = create<AppState>((set) => ({
    language: 'auto',
    setLanguage: (lang) => set({ language: lang }),
}));
