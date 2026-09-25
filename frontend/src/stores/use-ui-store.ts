import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * Usage Example:
 * 
 * const { isMobileNavOpen, isSidebarOpen, theme, toggleMobileNav, toggleSidebar, setTheme } = useUiStore();
 * or for performance:
 * const theme = useUiTheme();
 * const isMobileNavOpen = useIsMobileNavOpen();
 */

export interface UiState {
  isMobileNavOpen: boolean;
  isSidebarOpen: boolean;
  isFilterModalOpen: boolean;
  theme: "light" | "dark";
}

export interface UiActions {
  toggleMobileNav: (isOpen?: boolean) => void;
  toggleSidebar: (isOpen?: boolean) => void;
  toggleFilterModal: (isOpen?: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>()(
  devtools(
    persist(
      (set) => ({
        isMobileNavOpen: false,
        isSidebarOpen: false,
        isFilterModalOpen: false,
        theme: "dark",

        toggleMobileNav: (isOpen) =>
          set((state) => ({
            isMobileNavOpen: isOpen !== undefined ? isOpen : !state.isMobileNavOpen,
          })),

        toggleSidebar: (isOpen) =>
          set((state) => ({
            isSidebarOpen: isOpen !== undefined ? isOpen : !state.isSidebarOpen,
          })),

        toggleFilterModal: (isOpen) =>
          set((state) => ({
            isFilterModalOpen:
              isOpen !== undefined ? isOpen : !state.isFilterModalOpen,
          })),

        setTheme: (theme) => set({ theme }),
      }),
      {
        name: "gamezygo-ui-storage",
        // Only persist theme
        partialize: (state) => ({
          theme: state.theme,
        }),
      }
    ),
    { name: "ui-store" }
  )
);

// Performance-optimized selector hooks
export const useUiTheme = () => useUiStore((s) => s.theme);
export const useIsMobileNavOpen = () => useUiStore((s) => s.isMobileNavOpen);
export const useIsSidebarOpen = () => useUiStore((s) => s.isSidebarOpen);
export const useIsFilterModalOpen = () => useUiStore((s) => s.isFilterModalOpen);
