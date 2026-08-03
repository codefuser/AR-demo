/**
 * @file src/components/WalkthroughTelemetryCard.tsx
 * @description Card component rendering real-time movement velocity, direction, movement classification, plane & point counters.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { WalkthroughSession } from '../types/walkthrough';
import { useAppTheme } from '../hooks/useAppTheme';

interface WalkthroughTelemetryCardProps {
  session: WalkthroughSession;
}

const WalkthroughTelemetryCard: React.FC<WalkthroughTelemetryCardProps> = ({ session }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    titleGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    title: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    movementBadge: {
      fontSize: 10,
      fontWeight: typography.fontWeight.bold,
      color: colors.primary,
      backgroundColor: `${colors.primary}18`,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
    },
    gridRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.xs,
      paddingTop: spacing.xs,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    gridItem: {
      alignItems: 'center',
      flex: 1,
    },
    gridVal: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    gridLabel: {
      fontSize: 10,
      color: colors.onSurfaceVariant,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name="walk" size={18} color={colors.primary} />
          <Text style={styles.title}>Movement Analysis Telemetry</Text>
        </View>
        <Text style={styles.movementBadge}>{session.movementType}</Text>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{session.speedMps} m/s</Text>
          <Text style={styles.gridLabel}>Walking Speed</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>
            {session.cardinalDirection} ({session.headingDegrees}°)
          </Text>
          <Text style={styles.gridLabel}>Heading Direction</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{session.trackingQuality}</Text>
          <Text style={styles.gridLabel}>Tracking State</Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{session.detectedPlaneCount}</Text>
          <Text style={styles.gridLabel}>Detected Planes</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{session.pointCloudCount}</Text>
          <Text style={styles.gridLabel}>3D Vertices</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridVal}>{session.scanPointCount}</Text>
          <Text style={styles.gridLabel}>Scan Points</Text>
        </View>
      </View>
    </View>
  );
};

export default WalkthroughTelemetryCard;
