/**
 * @file src/services/ar/ARTrackingManager.ts
 * @description AR Tracking Manager — high-frequency sensor fusion & 6-DOF VIO pose integration.
 *
 * Listens to `DeviceMotion` updates from `expo-sensors`, integrates linear acceleration
 * into 3D position $(X, Y, Z)$, computes orientation Euler angles and quaternions, and calculates FPS.
 */

import { DeviceMotion } from 'expo-sensors';
import { ARStateManager } from './ARStateManager';

interface EventSubscription {
  remove: () => void;
}
import { DEFAULT_SENSOR_INTERVAL_MS, ZERO_VECTOR } from '../../constants/ar';
import {
  radToDeg,
  eulerToQuaternion,
  lowPassFilter,
  classifyMotionState,
  estimateTrackingQuality,
} from '../../utils/arUtils';
import type { Vector3D } from '../../types/ar';

export class ARTrackingManager {
  private static instance: ARTrackingManager;
  private stateManager: ARStateManager;

  private subscription: EventSubscription | null = null;
  private isTracking = false;

  // Integrated position & velocity
  private posX = 0;
  private posY = 0;
  private posZ = 0;

  private velX = 0;
  private velY = 0;
  private velZ = 0;

  // Timing & FPS metrics
  private lastTimestamp = 0;
  private frameCount = 0;
  private fpsWindowStart = 0;
  private currentFps = 0;
  private sessionStartTime = 0;

  private constructor() {
    this.stateManager = ARStateManager.getInstance();
  }

  public static getInstance(): ARTrackingManager {
    if (!ARTrackingManager.instance) {
      ARTrackingManager.instance = new ARTrackingManager();
    }
    return ARTrackingManager.instance;
  }

  /**
   * Starts high-frequency sensor tracking.
   */
  public async startTracking(): Promise<boolean> {
    if (this.isTracking) return true;

    try {
      const isAvailable = await DeviceMotion.isAvailableAsync();
      if (!isAvailable) {
        console.warn('DeviceMotion sensor unavailable on this hardware.');
        this.stateManager.setStatus('ERROR');
        return false;
      }

      DeviceMotion.setUpdateInterval(DEFAULT_SENSOR_INTERVAL_MS);

      this.resetIntegrationState();
      this.sessionStartTime = Date.now();
      this.fpsWindowStart = Date.now();
      this.isTracking = true;

      this.subscription = DeviceMotion.addListener(this.handleMotionUpdate);
      this.stateManager.setStatus('TRACKING');
      return true;
    } catch (err) {
      console.warn('Failed to start AR tracking:', err);
      this.stateManager.setStatus('ERROR');
      return false;
    }
  }

  /**
   * Pauses sensor listener loop.
   */
  public stopTracking(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    this.isTracking = false;
  }

  /**
   * Reset integrated 3D position vectors to origin $(0,0,0)$.
   */
  public resetOrigin(): void {
    this.posX = 0;
    this.posY = 0;
    this.posZ = 0;

    this.velX = 0;
    this.velY = 0;
    this.velZ = 0;

    this.stateManager.resetWorldOrigin({ ...ZERO_VECTOR });
  }

  /**
   * Sensor fusion motion update handler (called at ~60Hz).
   */
  private handleMotionUpdate = (event: any) => {
    if (!this.isTracking) return;

    const now = Date.now();
    const dt = this.lastTimestamp ? (now - this.lastTimestamp) / 1000 : 0.016;
    this.lastTimestamp = now;

    // 1. Calculate FPS
    this.frameCount++;
    if (now - this.fpsWindowStart >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.fpsWindowStart));
      this.fpsWindowStart = now;
    }

    // 2. Extract rotation (Euler angles in radians)
    const rotation = event.rotation || { alpha: 0, beta: 0, gamma: 0 };
    const pitchRad = rotation.beta || 0;  // Tilting front/back
    const rollRad = rotation.gamma || 0;   // Tilting side-to-side
    const yawRad = rotation.alpha || 0;    // Compass heading

    const pitchDeg = radToDeg(pitchRad);
    const rollDeg = radToDeg(rollRad);
    const yawDeg = radToDeg(yawRad);

    const quaternion = eulerToQuaternion(pitchRad, rollRad, yawRad);

    // 3. Extract user linear acceleration (gravity removed)
    const userAccel = event.acceleration || { x: 0, y: 0, z: 0 };
    const rawAx = userAccel.x || 0;
    const rawAy = userAccel.y || 0;
    const rawAz = userAccel.z || 0;

    // Apply low pass filter to reduce noise
    const ax = lowPassFilter(rawAx, 0, 0.15);
    const ay = lowPassFilter(rawAy, 0, 0.15);
    const az = lowPassFilter(rawAz, 0, 0.15);

    const accelMag = Math.sqrt(ax * ax + ay * ay + az * az);

    const rotationRate = event.rotationRate || { alpha: 0, beta: 0, gamma: 0 };
    const rotRateMag = Math.sqrt(
      (rotationRate.alpha || 0) ** 2 +
      (rotationRate.beta || 0) ** 2 +
      (rotationRate.gamma || 0) ** 2,
    );

    // 4. Double integrate acceleration -> velocity -> 3D position
    if (dt > 0 && dt < 0.1) {
      // Damping factor for drift prevention
      this.velX = (this.velX + ax * dt) * 0.94;
      this.velY = (this.velY + ay * dt) * 0.94;
      this.velZ = (this.velZ + az * dt) * 0.94;

      this.posX += this.velX * dt;
      this.posY += this.velY * dt;
      this.posZ += this.velZ * dt;
    }

    // 5. Determine motion state & tracking quality
    const motionState = classifyMotionState(accelMag, rotRateMag);
    const trackingQuality = estimateTrackingQuality(motionState, true);

    const uptimeSeconds = Math.round((now - this.sessionStartTime) / 1000);

    const position: Vector3D = {
      x: Number(this.posX.toFixed(3)),
      y: Number(this.posY.toFixed(3)),
      z: Number(this.posZ.toFixed(3)),
    };

    // 6. Push update to State Manager
    this.stateManager.updateMetrics({
      pose: {
        position,
        rotation: { pitch: pitchDeg, roll: rollDeg, yaw: yawDeg },
        quaternion,
        timestamp: new Date(now).toISOString(),
      },
      motionState,
      trackingQuality,
      fps: this.currentFps || 60,
      frameCount: this.frameCount,
      uptimeSeconds,
    });
  };

  private resetIntegrationState(): void {
    this.posX = 0;
    this.posY = 0;
    this.posZ = 0;
    this.velX = 0;
    this.velY = 0;
    this.velZ = 0;
    this.lastTimestamp = 0;
    this.frameCount = 0;
    this.currentFps = 60;
  }
}
