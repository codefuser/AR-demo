/**
 * @file src/database/buildingRepository.ts
 * @description Building repository — Phase 2 stub / interface definition.
 *
 * Follows the Repository pattern: all database access goes through this file.
 * Screens and services never write SQL directly — they call repository methods.
 *
 * Phase 2: Methods are defined with proper signatures but return mock data.
 * Phase 3: Replace each method body with real expo-sqlite calls.
 *
 * @see https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/
 */

import type { Building, CreateBuildingPayload, UpdateBuildingPayload } from '../types';

// ---------------------------------------------------------------------------
// Helper — Row Mapper
// ---------------------------------------------------------------------------

/**
 * Maps a raw SQLite row object to a typed Building instance.
 * Used in Phase 3 when actual SELECT queries return rows.
 *
 * @param row - Raw database row from expo-sqlite.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapRowToBuilding(row: Record<string, any>): Building {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string | undefined,
    address: row.address as string | undefined,
    buildingType: row.building_type as Building['buildingType'],
    floorCount: row.floor_count as number,
    scanStatus: row.scan_status as Building['scanStatus'],
    status: row.status as Building['status'],
    thumbnailUri: row.thumbnail_uri as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ---------------------------------------------------------------------------
// Repository Interface
// ---------------------------------------------------------------------------

/**
 * Fetches all buildings from the database.
 *
 * Phase 2 stub: returns empty array.
 * Phase 3: `SELECT * FROM buildings ORDER BY created_at DESC`
 */
export async function getAllBuildings(): Promise<Building[]> {
  // Phase 3: const rows = await db.getAllAsync('SELECT * FROM buildings ORDER BY created_at DESC');
  // Phase 3: return rows.map(mapRowToBuilding);
  return [];
}

/**
 * Fetches a single building by its ID.
 *
 * Phase 2 stub: returns null.
 * Phase 3: `SELECT * FROM buildings WHERE id = ?`
 *
 * @param id - The building's unique identifier.
 */
export async function getBuildingById(id: string): Promise<Building | null> {
  // Phase 3: const row = await db.getFirstAsync('SELECT * FROM buildings WHERE id = ?', [id]);
  // Phase 3: return row ? mapRowToBuilding(row) : null;
  void id;
  return null;
}

/**
 * Inserts a new building into the database.
 *
 * Phase 2 stub: no-op, returns the payload as-is.
 * Phase 3: `INSERT INTO buildings (...) VALUES (?,...)`
 *
 * @param building - The complete Building object to persist.
 */
export async function insertBuilding(building: Building): Promise<void> {
  // Phase 3:
  // await db.runAsync(
  //   `INSERT INTO buildings
  //    (id, name, description, address, building_type, floor_count, scan_status,
  //     status, thumbnail_uri, created_at, updated_at)
  //    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  //   [building.id, building.name, building.description ?? null, building.address ?? null,
  //    building.buildingType, building.floorCount, building.scanStatus,
  //    building.status, building.thumbnailUri ?? null, building.createdAt, building.updatedAt],
  // );
  void building;
}

/**
 * Updates an existing building record.
 *
 * Phase 2 stub: no-op.
 * Phase 3: Dynamic `UPDATE buildings SET ... WHERE id = ?`
 *
 * @param id      - The building ID to update.
 * @param payload - Fields to update.
 */
export async function updateBuildingById(
  id: string,
  payload: UpdateBuildingPayload,
): Promise<void> {
  // Phase 3: build dynamic SET clause from payload keys and run UPDATE
  void id;
  void payload;
}

/**
 * Deletes a building by its ID.
 *
 * Phase 2 stub: no-op.
 * Phase 3: `DELETE FROM buildings WHERE id = ?`
 *
 * @param id - The building ID to delete.
 */
export async function deleteBuildingById(id: string): Promise<void> {
  // Phase 3: await db.runAsync('DELETE FROM buildings WHERE id = ?', [id]);
  void id;
}
