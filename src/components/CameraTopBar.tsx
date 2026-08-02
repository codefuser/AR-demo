/**
 * @file src/components/CameraTopBar.tsx
 * @description Camera screen top bar overlay component.
 *
 * Renders a semi-transparent top header bar with back button, title,
 * and current camera status pill badge.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';

interface CameraTopBarProps {
  /** Title text displayed in header. */
  title?: string;
  /** Status indicator text ('Initializing', 'Ready', 'Error', etc.). */
  statusText: string;
  /** Whether the status is ready/active. */
  isReady: boolean;
  /** Callback when back button is pressed. */
  onBackPress: () => void;
}

/**
 * Top bar overlay component for CameraScreen.
 */
const CameraTopBar: React.FC<CameraTopBarProps> = ({
  title = 'Camera Preview',
  statusText,
  isReady,
  onBackPress,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xl,
      paddingBottom: spacing.sm,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    button: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.full,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleContainer: {
      alignItems: 'center',
    },
    title: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.bold,
      color: '#FFFFFF',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.full,
      backgroundColor: isReady ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)',
      gap: 4,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: isReady ? colors.success : colors.warning,
    },
    statusText: {
      fontSize: typography.fontSize.xs,
      color: isReady ? '#A7F3D0' : '#FDE68A',
      fontWeight: typography.fontWeight.medium,
    },
  });

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBackPress}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        testID="camera-btn-back"
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
      </Pressable>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.statusBadge}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>

      {/* Spacer for symmetry */}
      <View style={{ width: 40 }} />
    </View>
  );
};

export default CameraTopBar;
