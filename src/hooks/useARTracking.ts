/**
 * @file src/hooks/useARTracking.ts
 * @description Custom React hook for subscribing to 60Hz AR pose & telemetry tracking metrics.
 */

import { useState, useEffect } from 'react';
import { getARMetrics, subscribeARMetrics } from '../services/arService';
import type { ARTrackingMetrics } from '../types/ar';

export function useARTracking(): ARTrackingMetrics {
  const [metrics, setMetrics] = useState<ARTrackingMetrics>(getARMetrics());

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = subscribeARMetrics((newMetrics) => {
      if (isMounted) {
        setMetrics(newMetrics);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return metrics;
}

export default useARTracking;
