/**
 * @file src/screens/BuildingDetailsScreen.tsx
 * @description Building Details Screen — Clean Production Product UX.
 *
 * Displays:
 *  - Building Information (ID, Name, Description, Address, Category, Floor Count, Dates, Scan Status)
 *  - Action Suite:
 *    1. Scan Building (Launches unified AR Scan experience automatically starting background engines)
 *    2. Generate QR Code (Placeholder action for Phase 6)
 *    3. Edit Building (Navigates to building form in edit mode)
 *    4. Delete Building (With confirmation modal)
 */

import React from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../hooks/useAppTheme';
import { ScreenContainer, PrimaryButton, StatusBadge, SectionHeader } from '../components';
import { useBuildingStore } from '../store';
import { getBuildingTypeLabel } from '../services/buildingService';
import { APP_STRINGS } from '../constants/strings';
import { MAIN_ROUTES } from '../constants/routes';
import { formatDate } from '../utils';
import type { MainStackParamList } from '../types';

type BuildingDetailsScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'BuildingDetails'>;
  route: RouteProp<MainStackParamList, 'BuildingDetails'>;
};

/**
 * Building details screen displaying metadata and primary administrator actions.
 */
const BuildingDetailsScreen: React.FC<BuildingDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { buildingId } = route.params;
  const { theme } = useAppTheme();
  const { colors, spacing, typography, borderRadius } = theme.custom;

  const buildings = useBuildingStore((s) => s.buildings);
  const deleteBuildingStore = useBuildingStore((s) => s.deleteBuilding);

  const building = buildings.find((b) => b.id === buildingId);

  if (!building) {
    return (
      <ScreenContainer testID="building-details-screen">
        <SectionHeader title="Building Not Found" subtitle="The requested building does not exist." />
        <PrimaryButton label="Back to Buildings" onPress={() => navigation.navigate(MAIN_ROUTES.BUILDINGS)} />
      </ScreenContainer>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      APP_STRINGS.BUILDING_DETAILS_DELETE_CONFIRM_TITLE,
      APP_STRINGS.BUILDING_DETAILS_DELETE_CONFIRM_MSG(building.name),
      [
        { text: APP_STRINGS.BUILDING_DETAILS_CANCEL, style: 'cancel' },
        {
          text: APP_STRINGS.BUILDING_DETAILS_DELETE_BTN,
          style: 'destructive',
          onPress: () => {
            deleteBuildingStore(building.id);
            navigation.navigate(MAIN_ROUTES.BUILDINGS);
          },
        },
      ],
    );
  };

  const handleEdit = () => {
    navigation.navigate(MAIN_ROUTES.CREATE_BUILDING, { editId: building.id });
  };

  const handleGenerateQR = () => {
    Alert.alert(
      'Generate QR Marker',
      `QR Anchor generation placeholder for ${building.name}. QR alignment markers will be supported in Phase 6.`,
      [{ text: 'OK' }],
    );
  };

  const handleStartScan = () => {
    navigation.navigate(MAIN_ROUTES.SCAN_SESSION, {
      buildingId: building.id,
      buildingName: building.name,
      floor: 1,
    });
  };

  const typeLabel = getBuildingTypeLabel(building.buildingType);

  const styles = StyleSheet.create({
    content: {
      paddingBottom: spacing.xxl,
    },
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
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    title: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.onSurface,
    },
    subtitle: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary,
      marginTop: 2,
    },
    description: {
      fontSize: typography.fontSize.sm,
      color: colors.onSurfaceVariant,
      lineHeight: typography.fontSize.sm * 1.5,
      marginTop: spacing.xs,
    },
    sectionTitle: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.1,
      marginBottom: spacing.xs,
      marginTop: spacing.sm,
    },
    metaGrid: {
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    metaLabelGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    metaLabel: {
      fontSize: typography.fontSize.sm,
      color: colors.onSurfaceVariant,
    },
    metaValue: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.onSurface,
    },
    idText: {
      fontSize: typography.fontSize.xs,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      color: colors.textMuted,
    },
    actionSection: {
      gap: spacing.sm,
      marginTop: spacing.md,
    },
  });

  return (
    <ScreenContainer scrollable padding={spacing.md} testID="building-details-screen">
      <View style={styles.content}>
        {/* Main Building Header Card */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Text style={styles.title}>{building.name}</Text>
              <Text style={styles.subtitle}>{typeLabel}</Text>
            </View>
            <StatusBadge status={building.scanStatus} />
          </View>

          {building.description ? (
            <Text style={styles.description}>{building.description}</Text>
          ) : null}
        </View>

        {/* Detailed Metadata Card */}
        <Text style={styles.sectionTitle}>{APP_STRINGS.BUILDING_DETAILS_INFO_SECTION}</Text>
        <View style={styles.card}>
          <View style={styles.metaGrid}>
            <View style={styles.metaRow}>
              <View style={styles.metaLabelGroup}>
                <MaterialCommunityIcons name="tag-outline" size={16} color={colors.textMuted} />
                <Text style={styles.metaLabel}>{APP_STRINGS.BUILDING_DETAILS_ID_LABEL}</Text>
              </View>
              <Text style={styles.idText}>{building.id}</Text>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaLabelGroup}>
                <MaterialCommunityIcons name="layers-outline" size={16} color={colors.textMuted} />
                <Text style={styles.metaLabel}>{APP_STRINGS.BUILDING_DETAILS_FLOORS_LABEL}</Text>
              </View>
              <Text style={styles.metaValue}>{building.floorCount}</Text>
            </View>

            {building.address ? (
              <View style={styles.metaRow}>
                <View style={styles.metaLabelGroup}>
                  <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.textMuted} />
                  <Text style={styles.metaLabel}>{APP_STRINGS.BUILDING_DETAILS_ADDRESS_LABEL}</Text>
                </View>
                <Text style={[styles.metaValue, { maxWidth: '60%' }]} numberOfLines={1}>
                  {building.address}
                </Text>
              </View>
            ) : null}

            <View style={styles.metaRow}>
              <View style={styles.metaLabelGroup}>
                <MaterialCommunityIcons name="calendar-clock-outline" size={16} color={colors.textMuted} />
                <Text style={styles.metaLabel}>{APP_STRINGS.BUILDING_DETAILS_CREATED_LABEL}</Text>
              </View>
              <Text style={styles.metaValue}>{formatDate(building.createdAt)}</Text>
            </View>
          </View>
        </View>

        {/* Actions Suite */}
        <Text style={styles.sectionTitle}>{APP_STRINGS.BUILDING_DETAILS_ACTIONS_SECTION}</Text>
        <View style={styles.actionSection}>
          {/* 1. Scan Building */}
          <PrimaryButton
            label="Scan Building"
            icon="radar"
            onPress={handleStartScan}
            testID="btn-scan-building"
          />

          {/* 2. Generate QR Code (Placeholder) */}
          <PrimaryButton
            label="Generate QR Code"
            icon="qrcode"
            mode="outlined"
            onPress={handleGenerateQR}
            testID="btn-generate-qr"
          />

          {/* 3. Edit Building */}
          <PrimaryButton
            label={APP_STRINGS.BUILDING_DETAILS_BTN_EDIT}
            icon="pencil-outline"
            mode="outlined"
            onPress={handleEdit}
            testID="btn-edit-building"
          />

          {/* 4. Delete Building */}
          <PrimaryButton
            label={APP_STRINGS.BUILDING_DETAILS_BTN_DELETE}
            icon="trash-can-outline"
            mode="text"
            style={{ backgroundColor: `${colors.error}15` }}
            onPress={handleDelete}
            testID="btn-delete-building"
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

export default BuildingDetailsScreen;
