/**
 * @file src/config/appConfig.ts
 * @description Application-level configuration constants.
 *
 * Values here control global behaviour (timeouts, feature flags, etc.).
 * Replace hard-coded values across the app with references to this file.
 */

const appConfig = {
  // ── Identity ───────────────────────────────────────────────────────────────
  /** Display name used in the UI. */
  appName: 'AR Indoor Nav',

  /** Semantic version following major.minor.patch convention. */
  version: '1.0.0',

  /** Current development phase identifier. */
  phase: 1,

  // ── Splash Screen ─────────────────────────────────────────────────────────
  /** Duration (ms) to show the splash screen before navigating to Home. */
  splashDurationMs: 2500,

  // ── Animations ────────────────────────────────────────────────────────────
  /** Default transition duration for screen animations (ms). */
  animationDurationMs: 300,

  // ── Database ──────────────────────────────────────────────────────────────
  /** SQLite database file name (Phase 2+). */
  dbName: 'ar_indoor_nav.db',

  // ── Feature Flags ─────────────────────────────────────────────────────────
  /**
   * Feature flags gate functionality that is not yet implemented.
   * Set to true when the corresponding phase is complete.
   */
  features: {
    /** Phase 2: QR code scanning. */
    qrScanning: false,
    /** Phase 2: AR navigation overlay. */
    arNavigation: false,
    /** Phase 2: Room management. */
    roomManagement: false,
    /** Phase 2: Database persistence. */
    databasePersistence: false,
    /** Phase 2: 3D building viewer. */
    viewer3D: false,
  },
} as const;

export default appConfig;
