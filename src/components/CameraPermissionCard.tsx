/**
 * @file src/components/CameraPermissionCard.tsx
 * @description Camera permission request card view component.
 *
 * Rendered when camera permissions have not yet been granted or are denied.
 * Offers:
 *  - Clear title and explanation
 *  - "Grant Permission" primary button
 *  - "Open Device Settings" button if permission is denied
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import PrimaryButton from './PrimaryButton';
import { openAppDeviceSettings } from '../utils/cameraUtils';

interface CameraPermissionCardProps {
  /** Callback to trigger system permission dialog. */
  onRequestPermission: () => void;
  /** Whether a permission request is currently loading. */
  isLoading?: boolean;
}

/**
 * Camera permission request fallback view.
 */
const CameraPermissionCard: React.FC<CameraPermissionCardProps> = ({
  onRequestPermission,
  isLoading = false,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.background,
    },
    card: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
    },
    iconBox: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.full,
      backgroundColor: `${colors.primary}18`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    title: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: typography.fontSize.sm,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: typography.fontSize.sm * 1.5,
      marginBottom: spacing.xl,
    },
    buttonGroup: {
      width: '100%',
      gap: spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="camera-lock-outline" size={40} color={colors.primary} />
        </View>

        <Text style={styles.title}>Camera Access Required</Text>
        <Text style={styles.subtitle}>
          Allow AR Indoor Nav to access your camera for building scanning and 3D mapping features.
        </Text>

        <View style={styles.buttonGroup}>
          <PrimaryButton
            label="Grant Permission"
            icon="camera-outline"
            onPress={onRequestPermission}
            loading={isLoading}
            testID="btn-grant-camera-permission"
          />

          <PrimaryButton
            label="Open Device Settings"
            icon="cog-outline"
            mode="outlined"
            onPress={openAppDeviceSettings}
            testID="btn-open-device-settings"
          />
        </View>
      </View>
    </View>
  );
};

export default CameraPermissionCard;
