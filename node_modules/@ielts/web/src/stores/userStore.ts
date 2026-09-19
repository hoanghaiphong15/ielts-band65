import { create } from 'zustand';
import { UserProfile } from '@ielts/shared';
import { api } from '../services/api';

interface UserState {
  profile: UserProfile | null;
  language: 'en' | 'vi';
  theme: 'light' | 'dark' | 'system';
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  setLanguage: (lang: 'en' | 'vi') => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  language: (localStorage.getItem('ielts-lang') as 'en' | 'vi') || 'vi',
  theme: (localStorage.getItem('ielts-theme') as 'light' | 'dark' | 'system') || 'system',
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await api.getProfile();
      set({
        profile,
        language: profile.language as 'en' | 'vi',
        theme: profile.theme as 'light' | 'dark' | 'system',
        isLoading: false,
      });

      // Apply theme
      applyThemeToDom(profile.theme as 'light' | 'dark' | 'system');
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    try {
      const updated = await api.updateProfile(data);
      set({ profile: updated });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  setLanguage: (lang: 'en' | 'vi') => {
    localStorage.setItem('ielts-lang', lang);
    set({ language: lang });
    const { profile, updateProfile } = get();
    if (profile) {
      updateProfile({ language: lang });
    }
  },

  setTheme: (theme: 'light' | 'dark' | 'system') => {
    localStorage.setItem('ielts-theme', theme);
    set({ theme });
    applyThemeToDom(theme);
    const { profile, updateProfile } = get();
    if (profile) {
      updateProfile({ theme });
    }
  },
}));

function applyThemeToDom(theme: 'light' | 'dark' | 'system') {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
  } else {
    // system
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
