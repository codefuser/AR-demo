/**
 * @file src/screens/SplashScreen.tsx
 * @description Application splash screen.
 *
 * Displays the app logo and title with animated entrance effects, then
 * automatically navigates to the Home screen after a configurable delay.
 *
 * This screen uses expo-splash-screen to control the native splash and
 * then renders its own animated in-app splash while loading.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useAppTheme } from '../hooks/useAppTheme';
import { useAppStore } from '../store';
import { AppLogo } from '../components';
import { APP_STRINGS } from '../constants/strings';
import { ROOT_ROUTES } from '../constants/routes';
import appConfig from '../config/appConfig';
import type { RootStackParamList } from '../types';

// Prevent the native splash from auto-hiding; we control it here
ExpoSplashScreen.preventAutoHideAsync().catch(() => {
  /* Already hidden or unavailable — safe to ignore */
});

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

/**
 * Animated in-app splash screen shown while the app initialises.
 *
 * Animation sequence:
 * 1. Logo fades + slides up
 * 2. Title and subtitle fade in with a slight delay
 * 3. After `splashDurationMs`, navigate to Main
 */
const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography } = theme.custom;
  const setSplashShown = useAppStore((s) => s.setSplashShown);

  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(40)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const dotScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hide the native splash once React is ready
    ExpoSplashScreen.hideAsync().catch(() => {});

    // Logo entrance animation
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(logoTranslateY, {
        toValue: 0,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Text and dot appear after logo settles
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(dotScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Navigate after the configured duration
    const timer = setTimeout(() => {
      setSplashShown(true);
      navigation.replace(ROOT_ROUTES.MAIN as any);
    }, appConfig.splashDurationMs);

    return () => clearTimeout(timer);
  }, [logoOpacity, logoTranslateY, textOpacity, dotScale, navigation, setSplashShown]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoWrapper: {
      marginBottom: spacing.xl,
    },
    appName: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.extraBold,
      color: colors.onBackground,
      letterSpacing: -0.8,
      textAlign: 'center',
    },
    subtitle: {
      marginTop: spacing.xs,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.regular,
      color: colors.onSurfaceVariant,
      letterSpacing: 0.4,
      textAlign: 'center',
      maxWidth: SCREEN_WIDTH * 0.7,
    },
    dotRow: {
      flexDirection: 'row',
      marginTop: spacing.xxl,
      gap: spacing.sm,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    versionText: {
      position: 'absolute',
      bottom: spacing.xl,
      fontSize: typography.fontSize.xs,
      color: colors.textMuted,
      letterSpacing: 0.3,
    },
  });

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Animated.View
        style={[
          styles.logoWrapper,
          { opacity: logoOpacity, transform: [{ translateY: logoTranslateY }] },
        ]}
      >
        <AppLogo size="large" />
      </Animated.View>

      {/* App name + subtitle */}
      <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
        <Text style={styles.appName}>{APP_STRINGS.APP_NAME}</Text>
        <Text style={styles.subtitle}>{APP_STRINGS.APP_SUBTITLE}</Text>

        {/* Animated loading dots */}
        <Animated.View
          style={[styles.dotRow, { transform: [{ scale: dotScale }] }]}
        >
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.dot} />
          ))}
        </Animated.View>
      </Animated.View>

      <Text style={styles.versionText}>v{appConfig.version}</Text>
    </View>
  );
};

export default SplashScreen;
