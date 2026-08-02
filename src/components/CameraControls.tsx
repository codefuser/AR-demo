/**
 * @file src/components/CameraControls.tsx
 * @description Camera screen bottom controls overlay component.
 *
 * Renders:
 *  - Capture Button (centered primary circle)
 *  - Switch Camera (front/back flip button)
 *  - Flash Mode Toggle (cycle modes off/on/auto/torch)
 *  - Cancel Button
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CameraFacing, FlashMode } from '../types/camera';
import { FLASH_MODE_CONFIG } from '../constants/camera';
import { useAppTheme } from '../hooks/useAppTheme';

interface CameraControlsProps {
  /** Active facing mode ('back' | 'front'). */
  facing: CameraFacing;
  /** Active flash mode ('off' | 'on' | 'auto' | 'torch'). */
  flashMode: FlashMode;
  /** Whether the camera is ready for photo capture. */
  isReady: boolean;
  /** Whether photo capture or initialization is loading. */
  isLoading: boolean;
  /** Callback to capture photo. */
  onCapture: () => void;
  /** Callback to toggle facing mode. */
  onToggleFacing: () => void;
  /** Callback to cycle flash mode. */
  onCycleFlash: () => void;
  /** Callback when cancel button is pressed. */
  onCancel: () => void;
}

/**
 * Bottom control overlay component for CameraScreen.
 */
const CameraControls: React.FC<CameraControlsProps> = ({
  facing,
  flashMode,
  isReady,
  isLoading,
  onCapture,
  onToggleFacing,
  onCycleFlash,
  onCancel,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius } = theme.custom;

  const flashConfig = FLASH_MODE_CONFIG[flashMode];

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xxl,
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: '100%',
    },
    controlButton: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.full,
      backgroundColor: 'rgba(255, 255, 255, 0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    captureButtonOuter: {
      width: 76,
      height: 76,
      borderRadius: 38,
      borderWidth: 4,
      borderColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    captureButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: isReady && !isLoading ? colors.primary : colors.textMuted,
    },
    disabledBtn: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Cancel Button */}
        <Pressable
          onPress={onCancel}
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel="Cancel camera"
          testID="camera-btn-cancel"
        >
          <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
        </Pressable>

        {/* Flash Mode Toggle */}
        <Pressable
          onPress={onCycleFlash}
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel={`Flash mode: ${flashConfig.label}`}
          testID="camera-btn-flash"
        >
          <MaterialCommunityIcons
            name={flashConfig.icon}
            size={24}
            color={flashMode !== 'off' ? '#FBBF24' : '#FFFFFF'}
          />
        </Pressable>

        {/* Capture Button */}
        <Pressable
          onPress={onCapture}
          disabled={!isReady || isLoading}
          style={[styles.captureButtonOuter, (!isReady || isLoading) && styles.disabledBtn]}
          accessibilityRole="button"
          accessibilityLabel="Take photo"
          testID="camera-btn-capture"
        >
          <View style={styles.captureButtonInner} />
        </Pressable>

        {/* Switch Camera (Front/Back) */}
        <Pressable
          onPress={onToggleFacing}
          style={styles.controlButton}
          accessibilityRole="button"
          accessibilityLabel={`Switch camera facing. Currently ${facing}`}
          testID="camera-btn-switch"
        >
          <MaterialCommunityIcons name="camera-flip-outline" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
};

export default CameraControls;
