/**
 * @file src/services/buildingService.ts
 * @description Building service — Phase 2.
 *
 * Acts as the application's building logic layer between screens/stores
 * and the database repository. All business rules live here.
 *
 * Phase 2: Full in-memory CRUD — no SQLite yet.
 * Phase 3: Delegate each method to buildingRepository for persistence.
 */

import type {
  Building,
  CreateBuildingPayload,
  UpdateBuildingPayload,
  BuildingType,
  ScanStatus,
} from '../types';

// ---------------------------------------------------------------------------
// ID Generation
// ---------------------------------------------------------------------------

/**
 * Generates a pseudo-unique ID for a new building.
 * Phase 3: Replace with database auto-increment or expo-crypto UUID.
 */
function generateId(): string {
  return `bldg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// Fetch
// ---------------------------------------------------------------------------

/**
 * Fetch all buildings.
 *
 * Phase 2: Returns an empty array (Zustand store holds in-memory state).
 * Phase 3: Delegates to buildingRepository.getAllBuildings().
 */
export async function fetchBuildings(): Promise<Building[]> {
  return Promise.resolve([]);
}

/**
 * Get a single building by ID.
 *
 * Phase 2: Not used — store slice accessed directly in screens.
 * Phase 3: Delegates to buildingRepository.getBuildingById(id).
 *
 * @param _id - The building ID.
 */
export async function getBuildingById(_id: string): Promise<Building | null> {
  return Promise.resolve(null);
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

/**
 * Creates a new Building object from the provided payload.
 *
 * Applies defaults:
 *  - scanStatus: 'not_started'
 *  - status: 'draft'
 *  - timestamps: current UTC ISO 8601
 *
 * Phase 3: Also calls buildingRepository.insertBuilding(building).
 *
 * @param payload - User-supplied building fields.
 */
export async function createBuilding(
  payload: CreateBuildingPayload,
): Promise<Building> {
  const now = new Date().toISOString();

  const building: Building = {
    id: generateId(),
    name: payload.name.trim(),
    description: payload.description?.trim() || undefined,
    address: payload.address?.trim() || undefined,
    buildingType: payload.buildingType,
    floorCount: payload.floorCount,
    scanStatus: 'not_started' as ScanStatus,
    status: 'draft',
    thumbnailUri: payload.thumbnailUri,
    createdAt: now,
    updatedAt: now,
  };

  // Phase 3: await buildingRepository.insertBuilding(building);
  return Promise.resolve(building);
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

/**
 * Merges an update payload into an existing building.
 *
 * Phase 2: Returns the merged object; the store applies it.
 * Phase 3: Also persists via buildingRepository.updateBuildingById().
 *
 * @param existing - The current building object from the store.
 * @param payload  - Fields to overwrite.
 */
export async function updateBuilding(
  existing: Building,
  payload: UpdateBuildingPayload,
): Promise<Building> {
  const updated: Building = {
    ...existing,
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  // Phase 3: await buildingRepository.updateBuildingById(existing.id, payload);
  return Promise.resolve(updated);
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

/**
 * Deletes a building.
 *
 * Phase 2: No-op (Zustand store removes it client-side).
 * Phase 3: Calls buildingRepository.deleteBuildingById(id).
 *
 * @param _id - The building ID to delete.
 */
export async function deleteBuilding(_id: string): Promise<void> {
  // Phase 3: await buildingRepository.deleteBuildingById(_id);
  return Promise.resolve();
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns a human-readable label for a BuildingType value.
 */
export function getBuildingTypeLabel(type: BuildingType): string {
  const labels: Record<BuildingType, string> = {
    college: 'College',
    school: 'School',
    mall: 'Mall',
    hospital: 'Hospital',
    office: 'Office',
    other: 'Other',
  };
  return labels[type] ?? 'Other';
}

/**
 * Returns a human-readable label for a ScanStatus value.
 */
export function getScanStatusLabel(status: ScanStatus): string {
  const labels: Record<ScanStatus, string> = {
    not_started: 'Not Started',
    in_progress: 'Scanning',
    completed: 'Completed',
  };
  return labels[status] ?? 'Unknown';
}
