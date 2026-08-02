/**
 * @file src/types/index.ts
 * @description Global TypeScript type definitions and interfaces for the
 *              AR Indoor Navigation & 3D Building Mapping System.
 *
 * All shared types across the application are exported from this single file
 * so other modules can import from '@/types' without circular dependencies.
 */

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

/**
 * Root stack navigator param list.
 * Each key is a route name; the value is the params type for that route.
 */
export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
};

/**
 * Main stack navigator param list.
 */
export type MainStackParamList = {
  Home: undefined;
  Buildings: undefined;
  CreateBuilding: undefined;
  Settings: undefined;
  About: undefined;
};

// ---------------------------------------------------------------------------
// Building
// ---------------------------------------------------------------------------

/**
 * Status of a building in the system.
 */
export type BuildingStatus = 'draft' | 'scanned' | 'published';

/**
 * Represents a physical indoor building managed by the application.
 */
export interface Building {
  /** Unique identifier (UUID). */
  id: string;
  /** Human-readable name of the building. */
  name: string;
  /** Optional description or address. */
  description?: string;
  /** Number of floors in the building. */
  floorCount: number;
  /** Current processing status. */
  status: BuildingStatus;
  /** ISO 8601 timestamp of creation. */
  createdAt: string;
  /** ISO 8601 timestamp of last update. */
  updatedAt: string;
}

/**
 * Payload for creating a new building (excludes server-generated fields).
 */
export type CreateBuildingPayload = Pick<
  Building,
  'name' | 'description' | 'floorCount'
>;

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

/**
 * Supported color scheme identifiers.
 */
export type ColorScheme = 'light' | 'dark';

// ---------------------------------------------------------------------------
// App State
// ---------------------------------------------------------------------------

/**
 * Global application configuration state stored in Zustand.
 */
export interface AppState {
  /** Currently active color scheme. */
  colorScheme: ColorScheme;
  /** Whether the splash screen has been shown. */
  splashShown: boolean;
  /** Toggle between light and dark themes. */
  toggleColorScheme: () => void;
  /** Mark the splash screen as shown. */
  setSplashShown: (value: boolean) => void;
}

/**
 * Building-related state stored in Zustand.
 */
export interface BuildingState {
  /** List of buildings loaded in memory. */
  buildings: Building[];
  /** ID of the currently selected building, if any. */
  selectedBuildingId: string | null;
  /** Whether a loading operation is in progress. */
  isLoading: boolean;
  /** Last error message, if any. */
  error: string | null;
  /** Set the list of buildings. */
  setBuildings: (buildings: Building[]) => void;
  /** Add a single building to the list. */
  addBuilding: (building: Building) => void;
  /** Select a building by ID. */
  selectBuilding: (id: string | null) => void;
  /** Set the loading flag. */
  setLoading: (value: boolean) => void;
  /** Set or clear the error message. */
  setError: (message: string | null) => void;
}
