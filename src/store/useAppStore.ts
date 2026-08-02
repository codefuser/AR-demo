/**
 * @file src/store/useAppStore.ts
 * @description Global application state store powered by Zustand.
 *
 * Manages cross-cutting concerns such as color scheme, splash state, and
 * any future global flags.  Business logic is intentionally kept out of
 * this file — stores only hold and mutate state.
 */

import { create } from 'zustand';
import type { AppState, ColorScheme } from '../types';

/**
 * Global application store.
 *
 * @example
 * const colorScheme = useAppStore((s) => s.colorScheme);
 * const toggleColorScheme = useAppStore((s) => s.toggleColorScheme);
 */
const useAppStore = create<AppState>((set, get) => ({
  // ── Initial State ──────────────────────────────────────────────────────────
  colorScheme: 'dark' as ColorScheme,
  splashShown: false,

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Toggle between light and dark color schemes.
   */
  toggleColorScheme: () => {
    const next: ColorScheme = get().colorScheme === 'dark' ? 'light' : 'dark';
    set({ colorScheme: next });
  },

  /**
   * Mark whether the splash screen has been displayed.
   *
   * @param value - true once splash has been shown.
   */
  setSplashShown: (value: boolean) => {
    set({ splashShown: value });
  },
}));

export default useAppStore;
