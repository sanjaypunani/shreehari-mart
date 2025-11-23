/**
 * Global State Management with Zustand
 *
 * Manages global UI state including theme, sidebar, modals, and user preferences.
 * This should NOT be used for server state - use TanStack Query for that.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Auth State Interface
 */
interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'customer';
  } | null;
  token: string | null;
  isAuthenticated: boolean;
}

/**
 * UI State Interface
 */
interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  notifications: boolean;
}

/**
 * App Store Interface
 */
interface AppStore {
  // Auth State
  auth: AuthState;

  // UI State
  ui: UIState;

  // Auth Actions
  login: (user: AuthState['user'], token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthState['user']>) => void;

  // UI Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setNotifications: (enabled: boolean) => void;
}

/**
 * Initial state
 */
const initialState = {
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
  ui: {
    sidebarCollapsed: false,
    theme: 'light' as const,
    notifications: true,
  },
};

/**
 * Create the global store
 * Using devtools for debugging and persist for localStorage
 */
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Auth Actions
        login: (user, token) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', token);
          }
          set(
            {
              auth: {
                user,
                token,
                isAuthenticated: true,
              },
            },
            false,
            'auth/login'
          );
        },

        logout: () => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
          }
          set(
            {
              auth: {
                user: null,
                token: null,
                isAuthenticated: false,
              },
            },
            false,
            'auth/logout'
          );
        },

        updateUser: (userData) => {
          const currentUser = get().auth.user;
          if (currentUser) {
            set(
              {
                auth: {
                  ...get().auth,
                  user: { ...currentUser, ...userData },
                },
              },
              false,
              'auth/updateUser'
            );
          }
        },

        // UI Actions
        toggleSidebar: () => {
          set(
            (state) => ({
              ui: {
                ...state.ui,
                sidebarCollapsed: !state.ui.sidebarCollapsed,
              },
            }),
            false,
            'ui/toggleSidebar'
          );
        },

        setSidebarCollapsed: (collapsed) => {
          set(
            (state) => ({
              ui: {
                ...state.ui,
                sidebarCollapsed: collapsed,
              },
            }),
            false,
            'ui/setSidebarCollapsed'
          );
        },

        setTheme: (theme) => {
          set(
            (state) => ({
              ui: {
                ...state.ui,
                theme,
              },
            }),
            false,
            'ui/setTheme'
          );
        },

        toggleTheme: () => {
          set(
            (state) => ({
              ui: {
                ...state.ui,
                theme: state.ui.theme === 'light' ? 'dark' : 'light',
              },
            }),
            false,
            'ui/toggleTheme'
          );
        },

        setNotifications: (enabled) => {
          set(
            (state) => ({
              ui: {
                ...state.ui,
                notifications: enabled,
              },
            }),
            false,
            'ui/setNotifications'
          );
        },
      }),
      {
        name: 'shreehari-mart-storage', // localStorage key
        partialize: (state) => ({
          // Only persist certain parts of the state
          auth: {
            user: state.auth.user,
            token: state.auth.token,
            isAuthenticated: state.auth.isAuthenticated,
          },
          ui: {
            theme: state.ui.theme,
            sidebarCollapsed: state.ui.sidebarCollapsed,
            notifications: state.ui.notifications,
          },
        }),
      }
    ),
    {
      name: 'AppStore', // DevTools name
    }
  )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useAuth = () => useAppStore((state) => state.auth);
export const useUser = () => useAppStore((state) => state.auth.user);
export const useIsAuthenticated = () =>
  useAppStore((state) => state.auth.isAuthenticated);
export const useTheme = () => useAppStore((state) => state.ui.theme);
export const useSidebarCollapsed = () =>
  useAppStore((state) => state.ui.sidebarCollapsed);
