/**
 * @file src/screens/HomeScreen.tsx
 * @description Application home screen.
 *
 * Serves as the main entry point after the splash screen.  Displays:
 *  - Application logo
 *  - Project name and tagline
 *  - Four primary navigation cards (Create Building, Buildings, Settings, About)
 *
 * Design: Dark/light adaptive, gradient header band, animated card entrance.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../hooks/useAppTheme';
import { AppLogo, MenuCard, ScreenContainer } from '../components';
import { APP_STRINGS } from '../constants/strings';
import { MAIN_ROUTES } from '../constants/routes';
import type { MainStackParamList } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Home'>;
};

/** Menu card data — keeps JSX clean and makes it easy to add entries later. */
const MENU_ITEMS = [
  {
    id: 'create',
    icon: 'office-building-plus' as const,
    label: APP_STRINGS.HOME_BTN_CREATE_BUILDING,
    subtitle: 'Define a new indoor building',
    route: MAIN_ROUTES.CREATE_BUILDING,
    color: '#4F46E5',
    testID: 'home-btn-create-building',
  },
  {
    id: 'buildings',
    icon: 'city' as const,
    label: APP_STRINGS.HOME_BTN_BUILDINGS,
    subtitle: 'Browse and manage your buildings',
    route: MAIN_ROUTES.BUILDINGS,
    color: '#0EA5E9',
    testID: 'home-btn-buildings',
  },
  {
    id: 'camera',
    icon: 'camera-outline' as const,
    label: 'Camera Module',
    subtitle: 'Test camera preview and image capture',
    route: MAIN_ROUTES.CAMERA,
    color: '#EC4899',
    testID: 'home-btn-camera',
  },
  {
    id: 'settings',
    icon: 'cog-outline' as const,
    label: APP_STRINGS.HOME_BTN_SETTINGS,
    subtitle: 'Appearance and preferences',
    route: MAIN_ROUTES.SETTINGS,
    color: '#10B981',
    testID: 'home-btn-settings',
  },
  {
    id: 'about',
    icon: 'information-outline' as const,
    label: APP_STRINGS.HOME_BTN_ABOUT,
    subtitle: 'Project info and tech stack',
    route: MAIN_ROUTES.ABOUT,
    color: '#F59E0B',
    testID: 'home-btn-about',
  },
] as const;

/**
 * Home screen with animated entrance and themed menu cards.
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  // Staggered card entrance animations
  const cardAnimations = useRef(
    MENU_ITEMS.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
    })),
  ).current;

  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Header fades in first
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Then cards stagger in
    const animations = cardAnimations.map(({ opacity, translateY }, index) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          delay: 300 + index * 100,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 7,
          tension: 70,
          delay: 300 + index * 100,
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.parallel(animations).start();
  }, [cardAnimations, headerAnim]);

  const styles = StyleSheet.create({
    headerBand: {
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxl,
      marginHorizontal: -spacing.md,
      marginTop: -spacing.md,
      marginBottom: spacing.lg,
      borderBottomLeftRadius: borderRadius.xl,
      borderBottomRightRadius: borderRadius.xl,
      borderBottomWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    logoMargin: {
      marginBottom: spacing.lg,
    },
    appName: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.extraBold,
      color: colors.onBackground,
      letterSpacing: -0.8,
      textAlign: 'center',
    },
    tagline: {
      marginTop: spacing.xs,
      fontSize: typography.fontSize.sm,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      letterSpacing: 0.2,
    },
    sectionLabel: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.textMuted,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: spacing.sm,
    },
    cardGap: {
      marginBottom: spacing.sm,
    },
  });

  return (
    <ScreenContainer scrollable padding={spacing.md} testID="home-screen">
      {/* ── Header Band ─────────────────────────────────────────────────── */}
      <Animated.View style={[styles.headerBand, { opacity: headerAnim }]}>
        <View style={styles.logoMargin}>
          <AppLogo size="large" />
        </View>
        <Text style={styles.appName}>{APP_STRINGS.APP_NAME}</Text>
        <Text style={styles.tagline}>{APP_STRINGS.HOME_TAGLINE}</Text>
      </Animated.View>

      {/* ── Menu Cards ──────────────────────────────────────────────────── */}
      <Text style={styles.sectionLabel}>Quick Access</Text>

      {MENU_ITEMS.map(({ id, icon, label, subtitle, route, color, testID }, index) => (
        <Animated.View
          key={id}
          style={[
            styles.cardGap,
            {
              opacity: cardAnimations[index].opacity,
              transform: [{ translateY: cardAnimations[index].translateY }],
            },
          ]}
        >
          <MenuCard
            icon={icon}
            label={label}
            subtitle={subtitle}
            iconColor={color}
            onPress={() => navigation.navigate(route as any)}
            testID={testID}
          />
        </Animated.View>
      ))}
    </ScreenContainer>
  );
};

export default HomeScreen;
