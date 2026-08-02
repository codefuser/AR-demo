/**
 * @file src/store/useBuildingStore.ts
 * @description Building-related state store powered by Zustand.
 *
 * Phase 1: Manages an in-memory list of buildings with no persistence.
 * Phase 2+: Will be backed by SQLite via the database service layer.
 */

import { create } from 'zustand';
import type { BuildingState, Building } from '../types';

/**
 * Building store.
 *
 * @example
 * const buildings = useBuildingStore((s) => s.buildings);
 * const addBuilding = useBuildingStore((s) => s.addBuilding);
 */
const useBuildingStore = create<BuildingState>((set) => ({
  // ── Initial State ──────────────────────────────────────────────────────────
  buildings: [],
  selectedBuildingId: null,
  isLoading: false,
  error: null,

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Replace the full list of buildings (e.g. after a database fetch).
   */
  setBuildings: (buildings: Building[]) => {
    set({ buildings });
  },

  /**
   * Append a single newly created building to the list.
   */
  addBuilding: (building: Building) => {
    set((state) => ({ buildings: [...state.buildings, building] }));
  },

  /**
   * Set the currently selected building by ID.
   * Pass `null` to deselect.
   */
  selectBuilding: (id: string | null) => {
    set({ selectedBuildingId: id });
  },

  /**
   * Set the loading flag (true while async operations are in flight).
   */
  setLoading: (value: boolean) => {
    set({ isLoading: value });
  },

  /**
   * Set or clear the last error message.
   */
  setError: (message: string | null) => {
    set({ error: message });
  },
}));

export default useBuildingStore;
