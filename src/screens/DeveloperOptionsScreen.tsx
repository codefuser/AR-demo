/**
 * @file src/screens/DeveloperOptionsScreen.tsx
 * @description Developer Options & Engineering Diagnostics Screen.
 *
 * Houses internal developer diagnostic modules:
 *  - Camera Module (`CameraScreen`)
 *  - AR Tracking Engine (`ARStatusScreen`)
 *  - Real Plane Detection (`PlaneDiagnosticsScreen`)
 *  - Native AR Diagnostics (`ARDiagnosticsScreen`)
 *  - Scan Building Controller (`ScanSessionScreen`)
 *  - Building Walkthrough Engine (`WalkthroughScreen`)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../hooks/useAppTheme';
import { ScreenContainer, SectionHeader, MenuCard } from '../components';
import { MAIN_ROUTES } from '../constants/routes';
import type { MainStackParamList } from '../types';

type DeveloperOptionsScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'DeveloperOptions'>;
};

const DEV_MENU_ITEMS = [
  {
    id: 'camera',
    icon: 'camera-outline' as const,
    label: 'Camera Module',
    subtitle: 'Camera preview & photo capture testing',
    route: MAIN_ROUTES.CAMERA,
    color: '#EC4899',
    testID: 'dev-btn-camera',
  },
  {
    id: 'ar_status',
    icon: 'cube-scan' as const,
    label: 'AR Tracking Engine',
    subtitle: '6-DOF pose & VIO motion sensors',
    route: MAIN_ROUTES.AR_STATUS,
    color: '#8B5CF6',
    testID: 'dev-btn-ar-status',
  },
  {
    id: 'plane_diagnostics',
    icon: 'floor-plan' as const,
    label: 'Real Plane Detection',
    subtitle: 'Google ARCore physical floor & wall surfaces',
    route: MAIN_ROUTES.PLANE_DIAGNOSTICS,
    color: '#D97706',
    testID: 'dev-btn-plane-diagnostics',
  },
  {
    id: 'ar_diagnostics',
    icon: 'select-all' as const,
    label: 'Native AR Diagnostics',
    subtitle: 'Planes, Anchors, and AR Session foundation',
    route: MAIN_ROUTES.AR_DIAGNOSTICS,
    color: '#3B82F6',
    testID: 'dev-btn-ar-diagnostics',
  },
  {
    id: 'walkthrough',
    icon: 'walk' as const,
    label: 'Walkthrough Engine',
    subtitle: 'Indoor walking analysis & AR guidance',
    route: MAIN_ROUTES.WALKTHROUGH,
    color: '#E11D48',
    testID: 'dev-btn-walkthrough',
  },
  {
    id: 'coverage_diagnostics',
    icon: 'chart-donut' as const,
    label: 'Coverage Analysis Engine',
    subtitle: '2D spatial grid cell hashing & 5-factor quality scores',
    route: MAIN_ROUTES.COVERAGE_DIAGNOSTICS,
    color: '#10B981',
    testID: 'dev-btn-coverage-diagnostics',
  },
  {
    id: 'scan_session',
    icon: 'radar' as const,
    label: 'Scan Building Controller',
    subtitle: 'Raw scan session controller & debug timers',
    route: MAIN_ROUTES.SCAN_SESSION,
    color: '#059669',
    testID: 'dev-btn-scan-session',
  },
] as const;

const DeveloperOptionsScreen: React.FC<DeveloperOptionsScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  const styles = StyleSheet.create({
    warningBox: {
      backgroundColor: `${colors.warning}15`,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: `${colors.warning}40`,
      marginBottom: spacing.lg,
    },
    warningTitle: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.warning,
      marginBottom: 2,
    },
    warningText: {
      fontSize: typography.fontSize.xs,
      color: colors.onSurfaceVariant,
      lineHeight: typography.fontSize.xs * 1.4,
    },
    cardGap: {
      marginBottom: spacing.sm,
    },
  });

  return (
    <ScreenContainer scrollable padding={spacing.md} testID="developer-options-screen">
      <SectionHeader
        title="Developer Options"
        subtitle="Internal engineering modules & diagnostic suites"
        style={{ marginBottom: spacing.md }}
      />

      <View style={styles.warningBox}>
        <Text style={styles.warningTitle}>INTERNAL ENGINEERING TOOLS</Text>
        <Text style={styles.warningText}>
          These modules are intended for ARCore hardware calibration and technical verification. Internal engines run automatically during normal building scans.
        </Text>
      </View>

      {DEV_MENU_ITEMS.map(({ id, icon, label, subtitle, route, color, testID }) => (
        <View key={id} style={styles.cardGap}>
          <MenuCard
            icon={icon}
            label={label}
            subtitle={subtitle}
            iconColor={color}
            onPress={() => navigation.navigate(route as any)}
            testID={testID}
          />
        </View>
      ))}
    </ScreenContainer>
  );
};

export default DeveloperOptionsScreen;
