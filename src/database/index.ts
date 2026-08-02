/**
 * @file src/database/index.ts
 * @description SQLite database module — Phase 1 stub.
 *
 * This file intentionally contains only type definitions and an initialiser
 * stub.  No database calls are made in Phase 1.
 *
 * Phase 2 will replace the stub body with real expo-sqlite calls using the
 * new `useSQLiteContext` / `SQLiteProvider` API introduced in Expo SDK 51+.
 *
 * @see https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/
 */

/**
 * Represents a single database migration script.
 */
export interface Migration {
  /** Sequential version number (1, 2, 3 …). */
  version: number;
  /** SQL statements to run for this migration. */
  sql: string;
}

/**
 * List of planned database migrations.
 * Populated in Phase 2 when persistence is implemented.
 */
export const migrations: Migration[] = [
  // Phase 2 – initial schema
  // {
  //   version: 1,
  //   sql: `
  //     CREATE TABLE IF NOT EXISTS buildings (
  //       id TEXT PRIMARY KEY,
  //       name TEXT NOT NULL,
  //       description TEXT,
  //       floor_count INTEGER NOT NULL DEFAULT 1,
  //       status TEXT NOT NULL DEFAULT 'draft',
  //       created_at TEXT NOT NULL,
  //       updated_at TEXT NOT NULL
  //     );
  //   `,
  // },
];

/**
 * Initialises the SQLite database and runs pending migrations.
 *
 * Phase 1: No-op stub — returns immediately.
 * Phase 2: Will open the database file and execute `migrations`.
 *
 * @returns A promise that resolves when the database is ready.
 */
export async function initDatabase(): Promise<void> {
  // Phase 1 stub — no database operations performed.
  // Replace with SQLiteProvider setup in Phase 2.
  return Promise.resolve();
}
