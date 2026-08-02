/**
 * @file src/database/schema.ts
 * @description SQLite database schema — Phase 2 preparation.
 *
 * Defines the CREATE TABLE statements for all entities in the system.
 * Phase 2: Schema is defined here but NOT executed against a real database.
 * Phase 3: These statements will be run via expo-sqlite's SQLiteProvider.
 *
 * @see https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/
 */

/**
 * SQL statement to create the `buildings` table.
 *
 * Column notes:
 *  - id:            TEXT primary key (client-generated unique string)
 *  - scan_status:   TEXT — one of 'not_started' | 'in_progress' | 'completed'
 *  - building_type: TEXT — one of 'college' | 'school' | 'mall' | 'hospital' | 'office' | 'other'
 *  - floor_count:   INTEGER — validated min 1 / max 100 in the service layer
 *  - created_at:    TEXT — ISO 8601 timestamp
 *  - updated_at:    TEXT — ISO 8601 timestamp, updated on every write
 */
export const CREATE_BUILDINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS buildings (
    id            TEXT    PRIMARY KEY NOT NULL,
    name          TEXT    NOT NULL,
    description   TEXT,
    address       TEXT,
    building_type TEXT    NOT NULL DEFAULT 'other',
    floor_count   INTEGER NOT NULL DEFAULT 1,
    scan_status   TEXT    NOT NULL DEFAULT 'not_started',
    status        TEXT    NOT NULL DEFAULT 'draft',
    thumbnail_uri TEXT,
    created_at    TEXT    NOT NULL,
    updated_at    TEXT    NOT NULL
  );
`.trim();

/**
 * SQL statement to create an index on buildings.scan_status for fast filtering.
 */
export const CREATE_BUILDINGS_STATUS_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_buildings_scan_status
  ON buildings (scan_status);
`.trim();

/**
 * All migration statements in execution order.
 * Phase 3: Run these inside SQLiteProvider's onInit callback.
 */
export const DB_MIGRATIONS: string[] = [
  CREATE_BUILDINGS_TABLE,
  CREATE_BUILDINGS_STATUS_INDEX,
];

/**
 * Database file name stored on device storage.
 */
export const DB_NAME = 'ar_indoor_nav.db';

/**
 * Current schema version — increment when schema changes.
 */
export const SCHEMA_VERSION = 1;
