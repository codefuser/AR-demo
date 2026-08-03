/**
 * @file src/services/ar/ARCoreNativeBridge.ts
 * @description Native Google ARCore Bridge Contract — Architecture Migration Interface.
 *
 * Defines the native C++/Java Google ARCore binding contract used when building custom
 * native binaries via Expo Development Build (`expo run:android` / `eas build`).
 *
 * When compiling with native Google ARCore (`com.google.ar:core`), this bridge feeds real-time
 * ARCore Feature Point Clouds, Plane Detections, and Visual SLAM pose matrices directly into
 * our Phase 4 `ARTrackingManager` provider architecture without changing any UI or app logic.
 *
 * @see https://developers.google.com/ar/develop/java/quickstart
 */

import type { Vector3D, Quaternion, ARCameraPose } from '../../types/ar';

/**
 * Native ARCore Feature Point Cloud structure extracted during building scans.
 */
export interface ARCoreFeaturePoint {
  id: number;
  position: Vector3D;
  confidence: number;
}

/**
 * Native ARCore Detected Plane (floors, walls, ceilings).
 */
export interface ARCoreDetectedPlane {
  id: string;
  center: Vector3D;
  extentX: number;
  extentZ: number;
  planeType: 'HORIZONTAL_UPWARD_FACING' | 'HORIZONTAL_DOWNWARD_FACING' | 'VERTICAL';
  polygonPoints: Vector3D[];
}

/**
 * Native ARCore Spatial Anchor (for room annotations and QR origin calibration).
 */
export interface ARCoreAnchor {
  id: string;
  pose: ARCameraPose;
  trackingState: 'TRACKING' | 'PAUSED' | 'STOPPED';
}

/**
 * Contract interface for native ARCore module implementations.
 */
export interface ARCoreNativeModule {
  /** Checks if Google ARCore services are installed and up to date on device. */
  isARCoreInstalled(): Promise<boolean>;
  /** Initializes native ARCore Session with Depth API and Plane Detection enabled. */
  initializeARCoreSession(): Promise<boolean>;
  /** Destroys native ARCore Session. */
  destroyARCoreSession(): Promise<void>;
  /** Gets latest Visual SLAM feature points. */
  getFeaturePoints(): Promise<ARCoreFeaturePoint[]>;
  /** Gets current detected planes. */
  getDetectedPlanes(): Promise<ARCoreDetectedPlane[]>;
  /** Creates persistent spatial anchor at pose coordinates. */
  createAnchor(pose: Vector3D, rotation: Quaternion): Promise<ARCoreAnchor | null>;
}
