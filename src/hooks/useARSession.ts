/**
 * @file src/hooks/useARSession.ts
 * @description Custom React hook for controlling AR session lifecycle and device capability status.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  checkARCapabilities,
  startARSession,
  pauseARSession,
  resumeARSession,
  stopARSession,
  resetARWorldOrigin,
  getARStatus,
  subscribeARStatus,
} from '../services/arService';
import type { ARDeviceCapabilities, ARSessionStatus } from '../types/ar';

export interface UseARSessionReturn {
  /** Current session status. */
  status: ARSessionStatus;
  /** Device capability check result. */
  capabilities: ARDeviceCapabilities | null;
  /** Whether capability check is loading. */
  isLoading: boolean;
  /** Start AR Session. */
  start: () => Promise<boolean>;
  /** Pause AR Session. */
  pause: () => void;
  /** Resume AR Session. */
  resume: () => Promise<boolean>;
  /** Stop AR Session. */
  stop: () => void;
  /** Reset world origin baseline to $(0,0,0)$. */
  resetOrigin: () => void;
}

export function useARSession(): UseARSessionReturn {
  const [status, setStatus] = useState<ARSessionStatus>(getARStatus());
  const [capabilities, setCapabilities] = useState<ARDeviceCapabilities | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Subscribe to session status changes & run capability check
  useEffect(() => {
    let isMounted = true;

    async function init() {
      setIsLoading(true);
      const caps = await checkARCapabilities();
      if (isMounted) {
        setCapabilities(caps);
        setIsLoading(false);
      }
    }

    init();
    const unsubscribe = subscribeARStatus((newStatus) => {
      if (isMounted) {
        setStatus(newStatus);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const start = useCallback(async (): Promise<boolean> => {
    return startARSession();
  }, []);

  const pause = useCallback(() => {
    pauseARSession();
  }, []);

  const resume = useCallback(async (): Promise<boolean> => {
    return resumeARSession();
  }, []);

  const stop = useCallback(() => {
    stopARSession();
  }, []);

  const resetOrigin = useCallback(() => {
    resetARWorldOrigin();
  }, []);

  return {
    status,
    capabilities,
    isLoading,
    start,
    pause,
    resume,
    stop,
    resetOrigin,
  };
}

export default useARSession;
