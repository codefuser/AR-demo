/**
 * @file src/services/arService.ts
 * @description Top-level public AR Service module.
 *
 * Exposes clean service functions for screen components and custom hooks.
 */

import { ARManager } from './ar/ARManager';
import type { ARDeviceCapabilities, ARTrackingMetrics, ARSessionStatus } from '../types/ar';

const arManager = ARManager.getInstance();

export async function checkARCapabilities(): Promise<ARDeviceCapabilities> {
  return arManager.checkDeviceCapabilities();
}

export async function startARSession(): Promise<boolean> {
  return arManager.startSession();
}

export function pauseARSession(): void {
  arManager.pauseSession();
}

export async function resumeARSession(): Promise<boolean> {
  return arManager.resumeSession();
}

export function stopARSession(): void {
  arManager.stopSession();
}

export function resetARWorldOrigin(): void {
  arManager.resetSession();
}

export function getARMetrics(): ARTrackingMetrics {
  return arManager.getMetrics();
}

export function getARStatus(): ARSessionStatus {
  return arManager.getStatus();
}

export function subscribeARMetrics(listener: (metrics: ARTrackingMetrics) => void): () => void {
  return arManager.subscribeMetrics(listener);
}

export function subscribeARStatus(listener: (status: ARSessionStatus) => void): () => void {
  return arManager.subscribeStatus(listener);
}
