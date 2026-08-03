/**
 * @file src/components/WalkthroughGuidanceCard.tsx
 * @description Card component displaying live AR User Guidance instructions & walking quality banner.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { WalkingQuality } from '../types/walkthrough';
import { useAppTheme } from '../hooks/useAppTheme';

interface WalkthroughGuidanceCardProps {
  quality: WalkingQuality;
  guidanceMessage: string;
}

const WalkthroughGuidanceCard: React.FC<WalkthroughGuidanceCardProps> = ({
  quality,
  guidanceMessage,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

  const getQualityColor = (q: WalkingQuality) => {
    switch (q) {
      case 'OPTIMAL':
        return colors.success;
      case 'TOO_SLOW':
      case 'LOW_PLANE_DETECTION':
      case 'POOR_POINT_CLOUD':
        return colors.warning;
      case 'TOO_FAST':
      case 'CAMERA_SHAKING':
      case 'LOW_LIGHT':
      case 'TRACKING_LOST':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getQualityIcon = (q: WalkingQuality) => {
    switch (q) {
      case 'OPTIMAL':
        return 'check-circle';
      case 'TOO_FAST':
        return 'speedometer-slow';
      case 'TRACKING_LOST':
        return 'alert-decagram';
      default:
        return 'information';
    }
  };

  const color = getQualityColor(quality);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: `${color}12`,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: `${color}40`,
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
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color,
    },
    qualityBadge: {
      fontSize: 10,
      fontWeight: typography.fontWeight.bold,
      color,
      backgroundColor: `${color}25`,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
    },
    messageText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
      marginTop: spacing.xs,
      lineHeight: typography.fontSize.sm * 1.4,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <MaterialCommunityIcons name={getQualityIcon(quality)} size={18} color={color} />
          <Text style={styles.title}>LIVE AR GUIDANCE</Text>
        </View>
        <Text style={styles.qualityBadge}>{quality}</Text>
      </View>
      <Text style={styles.messageText}>{guidanceMessage}</Text>
    </View>
  );
};

export default WalkthroughGuidanceCard;
