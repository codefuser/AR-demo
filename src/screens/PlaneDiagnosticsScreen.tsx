/**
 * @file src/screens/PlaneDiagnosticsScreen.tsx
 * @description Plane Diagnostics Screen — Real Native Google ARCore Plane Detection Dashboard.
 *
 * Displays:
 *  - Detected Plane Count (Horizontal Floors & Vertical Walls)
 *  - Surface area telemetry statistics ($m^2$)
 *  - Live 6-DOF Pose Telemetry Card (`ARPoseCard`)
 *  - Active Physical Planes List (`PlaneListCard`)
 *  - Start / Pause / Clear Plane Detection Controls
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { usePlanes, usePlaneStats, usePlaneControl } from '../hooks/usePlane';
import { useARTracking } from '../hooks/useARTracking';
import {
  ScreenContainer,
  SectionHeader,
  PrimaryButton,
  PlaneSummaryCard,
  PlaneListCard,
  ARPoseCard,
} from '../components';

const PlaneDiagnosticsScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { spacing } = theme.custom;

  const planes = usePlanes();
  const stats = usePlaneStats();
  const metrics = useARTracking();
  const { startDetection, stopDetection, clearPlanes } = usePlaneControl();

  useEffect(() => {
    startDetection();
    return () => {
      stopDetection();
    };
  }, [startDetection, stopDetection]);

  return (
    <ScreenContainer scrollable padding={spacing.md} testID="plane-diagnostics-screen">
      <SectionHeader
        title="ARCore Plane Detection"
        subtitle="Real physical floor & wall surface detection telemetry"
        style={{ marginBottom: spacing.sm }}
      />

      {/* 1. Real Plane Detection Summary Card */}
      <PlaneSummaryCard stats={stats} trackingQuality={metrics.trackingQuality} fps={metrics.fps} />

      {/* 2. Active Detected Planes List */}
      <PlaneListCard planes={planes} onClearPlanes={clearPlanes} />

      {/* 3. Real-time 6-DOF Pose Telemetry */}
      <ARPoseCard metrics={metrics} />

      {/* 4. Controls */}
      <View style={{ gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.xl }}>
        <PrimaryButton
          label="Refresh Plane Detection"
          icon="refresh"
          onPress={() => {
            clearPlanes();
            startDetection();
          }}
          testID="btn-refresh-planes"
        />
      </View>
    </ScreenContainer>
  );
};

export default PlaneDiagnosticsScreen;
