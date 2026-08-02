/**
 * @file src/components/ScreenContainer.tsx
 * @description Reusable screen wrapper component.
 *
 * Provides consistent safe-area padding, background colour, and optional
 * scroll behaviour for every screen in the application.
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../hooks/useAppTheme';

interface ScreenContainerProps {
  /** Screen content. */
  children: React.ReactNode;
  /** Whether the content should scroll vertically. */
  scrollable?: boolean;
  /** Whether to avoid the keyboard on form screens. */
  avoidKeyboard?: boolean;
  /** Additional style for the inner content container. */
  contentStyle?: ViewStyle;
  /** Padding override for the outer container. */
  padding?: number;
  /** Test identifier. */
  testID?: string;
}

/**
 * Screen wrapper that handles safe area, background colour, and scrolling.
 *
 * @example
 * <ScreenContainer scrollable>
 *   <Text>My screen content</Text>
 * </ScreenContainer>
 */
const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  avoidKeyboard = false,
  contentStyle,
  padding,
  testID,
}) => {
  const { theme } = useAppTheme();
  const { colors, spacing } = theme.custom;
  const appliedPadding = padding ?? spacing.md;

  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    inner: {
      flex: 1,
      backgroundColor: colors.background,
      padding: appliedPadding,
    },
    scrollContent: {
      flexGrow: 1,
      padding: appliedPadding,
    },
  });

  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      testID={testID}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.inner, contentStyle]} testID={testID}>
      {children}
    </View>
  );

  const wrapped = avoidKeyboard ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return <SafeAreaView style={styles.safe}>{wrapped}</SafeAreaView>;
};

export default ScreenContainer;
