/**
 * @file src/services/buildingService.ts
 * @description Building service — Phase 1 stub.
 *
 * Provides the interface for all building CRUD operations.
 * Phase 1: Returns mock/in-memory data only.
 * Phase 2: Will delegate to the SQLite database layer.
 */

import type { Building, CreateBuildingPayload } from '../types';

/**
 * Generates a simple unique ID.
 * Phase 2: Replace with a proper UUID library or database-generated ID.
 */
function generateId(): string {
  return `building_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Fetch all buildings.
 *
 * Phase 1: Returns an empty array.
 * Phase 2: Queries the SQLite `buildings` table.
 */
export async function fetchBuildings(): Promise<Building[]> {
  // Phase 1 stub
  return Promise.resolve([]);
}

/**
 * Create a new building record.
 *
 * Phase 1: Constructs and returns a Building object without persisting it.
 * Phase 2: Inserts a row into the SQLite `buildings` table.
 *
 * @param payload - The building creation payload.
 * @returns The newly created Building object.
 */
export async function createBuilding(
  payload: CreateBuildingPayload,
): Promise<Building> {
  const now = new Date().toISOString();

  // Phase 1 stub — builds in-memory object only
  const building: Building = {
    id: generateId(),
    name: payload.name,
    description: payload.description,
    floorCount: payload.floorCount,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };

  return Promise.resolve(building);
}

/**
 * Delete a building by ID.
 *
 * Phase 1: No-op stub.
 * Phase 2: Deletes the row from the SQLite `buildings` table.
 *
 * @param _id - The building ID to delete.
 */
export async function deleteBuilding(_id: string): Promise<void> {
  // Phase 1 stub
  return Promise.resolve();
}
