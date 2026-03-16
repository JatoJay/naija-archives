import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface UIState {
  language: string;
  isChatOpen: boolean;
  isUploadModalOpen: boolean;
  isSidebarOpen: boolean;
  user: User | null;
  setLanguage: (language: string) => void;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
  toggleUploadModal: () => void;
  setUploadModalOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setUser: (user: User | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      language: 'en',
      isChatOpen: false,
      isUploadModalOpen: false,
      isSidebarOpen: false,
      user: null,
      setLanguage: (language) => set({ language }),
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      setChatOpen: (open) => set({ isChatOpen: open }),
      toggleUploadModal: () =>
        set((state) => ({ isUploadModalOpen: !state.isUploadModalOpen })),
      setUploadModalOpen: (open) => set({ isUploadModalOpen: open }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'nigeria-archives-ui',
      partialize: (state) => ({ language: state.language }),
    }
  )
);
