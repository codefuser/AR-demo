/**
 * @file src/store/useBuildingStore.ts
 * @description Building state store — Phase 2.
 *
 * Manages the full in-memory lifecycle of Building objects:
 *   Create → Read → Update → Delete
 *
 * Phase 3: Zustand persist middleware + SQLite will be added here.
 */

import { create } from 'zustand';
import type { BuildingState, Building, UpdateBuildingPayload } from '../types';

/**
 * Building store with full CRUD actions.
 *
 * @example
 * const buildings = useBuildingStore((s) => s.buildings);
 * const addBuilding = useBuildingStore((s) => s.addBuilding);
 * const deleteBuilding = useBuildingStore((s) => s.deleteBuilding);
 */
const useBuildingStore = create<BuildingState>((set, get) => ({
  // ── Initial State ──────────────────────────────────────────────────────────
  buildings: [],
  selectedBuildingId: null,
  isLoading: false,
  error: null,

  // ── Read ───────────────────────────────────────────────────────────────────

  /**
   * Replace the full buildings list (e.g. after initial database fetch).
   */
  setBuildings: (buildings: Building[]) => {
    set({ buildings });
  },

  // ── Create ─────────────────────────────────────────────────────────────────

  /**
   * Append a newly created building to the in-memory list.
   */
  addBuilding: (building: Building) => {
    set((state) => ({
      buildings: [building, ...state.buildings],
    }));
  },

  // ── Update ─────────────────────────────────────────────────────────────────

  /**
   * Merge an update payload into the building matching `id`.
   * If no building with that ID exists, the action is a no-op.
   *
   * @param id      - The target building ID.
   * @param payload - Partial fields to overwrite.
   */
  updateBuilding: (id: string, payload: UpdateBuildingPayload) => {
    set((state) => ({
      buildings: state.buildings.map((b) =>
        b.id === id
          ? { ...b, ...payload, updatedAt: new Date().toISOString() }
          : b,
      ),
    }));
  },

  // ── Delete ─────────────────────────────────────────────────────────────────

  /**
   * Remove a building from the in-memory list by ID.
   * Also clears selectedBuildingId if the deleted building was selected.
   *
   * @param id - The building ID to remove.
   */
  deleteBuilding: (id: string) => {
    set((state) => ({
      buildings: state.buildings.filter((b) => b.id !== id),
      selectedBuildingId:
        state.selectedBuildingId === id ? null : state.selectedBuildingId,
    }));
  },

  // ── Selection ──────────────────────────────────────────────────────────────

  /**
   * Set the currently focused building (for detail view).
   * Pass null to deselect.
   */
  selectBuilding: (id: string | null) => {
    set({ selectedBuildingId: id });
  },

  // ── Status ─────────────────────────────────────────────────────────────────

  setLoading: (value: boolean) => {
    set({ isLoading: value });
  },

  setError: (message: string | null) => {
    set({ error: message });
  },
}));

/**
 * Selector helper — get a single building by ID without subscribing to the full list.
 *
 * @example
 * const building = getBuildingByIdSelector(store.getState(), id);
 */
export function getBuildingByIdSelector(
  state: BuildingState,
  id: string,
): Building | undefined {
  return state.buildings.find((b) => b.id === id);
}

export default useBuildingStore;
