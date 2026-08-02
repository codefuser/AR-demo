/**
 * @file src/screens/CameraScreen.tsx
 * @description Camera Screen — Phase 3.
 *
 * Fullscreen camera view containing:
 *  - Top Bar: Back Button, Title, Camera Status indicator
 *  - Fullscreen Camera Preview (using CameraView from expo-camera)
 *  - Bottom Controls: Capture Button, Switch Camera, Flash Button, Cancel Button
 *  - Permission Card view when camera permissions are missing or denied
 *  - Temporary image capture preview feedback (no processing or database save)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAppTheme } from '../hooks/useAppTheme';
import { useCamera } from '../hooks/useCamera';
import {
  CameraTopBar,
  CameraControls,
  CameraPermissionCard,
  PrimaryButton,
} from '../components';
import { getCameraErrorMessage } from '../utils/cameraUtils';
import type { MainStackParamList, CapturedPictureResult } from '../types';

type CameraScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Camera'>;
};

/**
 * Camera preview & single capture screen component.
 */
const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, borderRadius, typography } = theme.custom;

  const {
    cameraRef,
    facing,
    flashMode,
    isReady,
    isLoading,
    error,
    errorType,
    hasPermission,
    requestPermission,
    toggleFacing,
    cycleFlashMode,
    takePicture,
    onCameraReady,
    onCameraError,
  } = useCamera();

  // Temporary captured photo state for preview modal
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPictureResult | null>(null);

  const handleCapture = async () => {
    const result = await takePicture();
    if (result) {
      setCapturedPhoto(result);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Status text for top bar
  const statusText = !hasPermission
    ? 'Permission Needed'
    : isLoading
    ? 'Initializing...'
    : isReady
    ? 'Camera Ready'
    : error
    ? 'Camera Error'
    : 'Connecting...';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    cameraView: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5,
    },
    loadingText: {
      marginTop: spacing.md,
      color: '#FFFFFF',
      fontSize: typography.fontSize.sm,
    },
    errorOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      zIndex: 15,
    },
    errorBox: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      width: '100%',
    },
    errorTitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.bold,
      color: colors.error,
      marginTop: spacing.sm,
      marginBottom: spacing.xs,
    },
    errorMsg: {
      fontSize: typography.fontSize.sm,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    // Modal preview for captured photo
    modalContainer: {
      flex: 1,
      backgroundColor: '#000000',
    },
    previewImage: {
      flex: 1,
      width: '100%',
      resizeMode: 'contain',
    },
    previewHeader: {
      position: 'absolute',
      top: 40,
      left: spacing.md,
      right: spacing.md,
      zIndex: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    previewBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.85)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    previewBadgeText: {
      color: '#FFFFFF',
      fontWeight: typography.fontWeight.bold,
      fontSize: typography.fontSize.xs,
    },
    previewFooter: {
      position: 'absolute',
      bottom: spacing.xl,
      left: spacing.lg,
      right: spacing.lg,
      zIndex: 20,
    },
  });

  // Permission missing / denied view
  if (hasPermission === false || errorType === 'PERMISSION_DENIED') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <CameraPermissionCard
          onRequestPermission={requestPermission}
          isLoading={isLoading}
        />
      </SafeAreaView>
    );
  }

  // CameraView flash prop accepts 'off' | 'on' | 'auto'
  const flashProp = flashMode === 'torch' ? 'off' : flashMode;

  return (
    <View style={styles.container} testID="camera-screen">
      {/* Top Bar Overlay */}
      <CameraTopBar
        title="Camera Preview"
        statusText={statusText}
        isReady={isReady}
        onBackPress={handleBack}
      />

      {/* Camera Preview */}
      <CameraView
        ref={cameraRef}
        style={styles.cameraView}
        facing={facing}
        flash={flashProp}
        enableTorch={flashMode === 'torch'}
        onCameraReady={onCameraReady}
        onMountError={onCameraError}
      />

      {/* Loading Spinner */}
      {isLoading && !error && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Initializing camera...</Text>
        </View>
      )}

      {/* Error Overlay */}
      {error && errorType && (
        <View style={styles.errorOverlay}>
          <View style={styles.errorBox}>
            <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.error} />
            <Text style={styles.errorTitle}>Camera Error</Text>
            <Text style={styles.errorMsg}>
              {getCameraErrorMessage(errorType)}
            </Text>
            <PrimaryButton
              label="Try Again / Go Back"
              onPress={handleBack}
            />
          </View>
        </View>
      )}

      {/* Bottom Controls Overlay */}
      <CameraControls
        facing={facing}
        flashMode={flashMode}
        isReady={isReady}
        isLoading={isLoading}
        onCapture={handleCapture}
        onToggleFacing={toggleFacing}
        onCycleFlash={cycleFlashMode}
        onCancel={handleBack}
      />

      {/* Temporary Captured Photo Preview Modal */}
      <Modal
        visible={!!capturedPhoto}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setCapturedPhoto(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.previewHeader}>
            <View style={styles.previewBadge}>
              <Text style={styles.previewBadgeText}>Photo Captured (Temporary)</Text>
            </View>
            <Pressable onPress={() => setCapturedPhoto(null)}>
              <MaterialCommunityIcons name="close-circle" size={32} color="#FFFFFF" />
            </Pressable>
          </View>

          {capturedPhoto && (
            <Image source={{ uri: capturedPhoto.uri }} style={styles.previewImage} />
          )}

          <View style={styles.previewFooter}>
            <PrimaryButton
              label="Retake Photo"
              icon="camera-retake-outline"
              onPress={() => setCapturedPhoto(null)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CameraScreen;
