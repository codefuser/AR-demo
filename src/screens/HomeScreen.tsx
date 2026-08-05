/**
 * @file src/screens/HomeScreen.tsx
 * @description Product Home Screen — Clean, End-User Business Dashboard.
 *
 * Displays ONLY primary business features:
 *  - Create Building
 *  - My Buildings
 *  - Settings
 *  - About
 *
 * Engineering & diagnostic modules are relocated to Settings ➔ Developer Options.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../hooks/useAppTheme';
import { AppLogo, MenuCard, ScreenContainer } from '../components';
import { APP_STRINGS } from '../constants/strings';
import { MAIN_ROUTES } from '../constants/routes';
import type { MainStackParamList } from '../types';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Home'>;
};

/** Business Feature Menu Items — Clean product focus */
const MENU_ITEMS = [
  {
    id: 'create',
    icon: 'office-building-plus' as const,
    label: APP_STRINGS.HOME_BTN_CREATE_BUILDING,
    subtitle: 'Define a new indoor building & floor plan',
    route: MAIN_ROUTES.CREATE_BUILDING,
    color: '#4F46E5',
    testID: 'home-btn-create-building',
  },
  {
    id: 'buildings',
    icon: 'city' as const,
    label: APP_STRINGS.HOME_BTN_BUILDINGS,
    subtitle: 'Browse, manage, and scan your buildings',
    route: MAIN_ROUTES.BUILDINGS,
    color: '#0EA5E9',
    testID: 'home-btn-buildings',
  },
  {
    id: 'settings',
    icon: 'cog-outline' as const,
    label: APP_STRINGS.HOME_BTN_SETTINGS,
    subtitle: 'Appearance and app preferences',
    route: MAIN_ROUTES.SETTINGS,
    color: '#10B981',
    testID: 'home-btn-settings',
  },
  {
    id: 'about',
    icon: 'information-outline' as const,
    label: APP_STRINGS.HOME_BTN_ABOUT,
    subtitle: 'System information and project specs',
    route: MAIN_ROUTES.ABOUT,
    color: '#F59E0B',
    testID: 'home-btn-about',
  },
] as const;

/**
 * Home screen with clean MD3 layout and entrance animations.
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  // Entrance animations for cards
  const cardAnimations = useRef(
    MENU_ITEMS.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    })),
  ).current;

  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const animations = cardAnimations.map(({ opacity, translateY }, index) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          delay: 150 + index * 80,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 80,
          delay: 150 + index * 80,
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

      {/* ── Primary Business Features ───────────────────────────────────── */}
      <Text style={styles.sectionLabel}>Main Navigation</Text>

      {MENU_ITEMS.map(({ id, icon, label, subtitle, route, color, testID }, index) => (
        <Animated.View
          key={id}
          style={[
            styles.cardGap,
            {
              opacity: cardAnimations[index]?.opacity || 1,
              transform: [{ translateY: cardAnimations[index]?.translateY || 0 }],
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
