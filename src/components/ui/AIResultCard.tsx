import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppTheme } from '@/src/theme';
import { useAppTheme } from '@/src/theme/designSystem';
import type { PlantIdentificationResult } from '@/src/types-dtos/identification.types';

interface AIResultCardProps {
  result: PlantIdentificationResult;
  onAccept: () => void;
  onDiscard: () => void;
}

function getConfidenceColor(theme: AppTheme, confidence: number): string {
  if (confidence >= 0.75) return theme.colors.primary;
  if (confidence >= 0.45) return theme.colors.secondary;
  return theme.colors.error;
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.85) return 'MUY ALTA';
  if (confidence >= 0.65) return 'ALTA';
  if (confidence >= 0.4) return 'MEDIA';
  return 'BAJA';
}

export const AIResultCard: React.FC<AIResultCardProps> = ({
  result,
  onAccept,
  onDiscard,
}) => {
  const theme = useAppTheme();
  const s = getStyles(theme);
  const confidencePct = Math.round(result.confidence * 100);
  const barColor = getConfidenceColor(theme, result.confidence);
  const confidenceLabel = getConfidenceLabel(result.confidence);

  if (!result.isPlant) {
    return (
      <View style={s.card}>
        <View style={s.header}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={28}
            color={theme.colors.secondary}
          />
          <Text style={s.title}>NO SE DETECTO PLANTA</Text>
        </View>
        <Text style={s.subtitle}>
          La imagen no parece contener una planta. Intenta tomar otra foto con mejor enfoque.
        </Text>
        <Pressable style={[s.btn, s.btnCancel]} onPress={onDiscard}>
          <Text style={s.btnCancelText}>TOMAR OTRA FOTO</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={s.card}>
      <View style={s.header}>
        <MaterialCommunityIcons name="leaf" size={28} color={theme.colors.primary} />
        <Text style={s.title}>IDENTIFICACION IA</Text>
      </View>

      <View style={s.section}>
        <Text style={s.label}>NOMBRE COMUN</Text>
        <Text style={s.value}>{result.commonName || '—'}</Text>
      </View>

      <View style={s.section}>
        <Text style={s.label}>NOMBRE CIENTIFICO</Text>
        <Text style={[s.value, s.italic]}>{result.scientificName || '—'}</Text>
      </View>

      {result.description ? (
        <View style={s.section}>
          <Text style={s.label}>DESCRIPCION BREVE</Text>
          <Text style={s.value}>{result.description}</Text>
        </View>
      ) : null}

      {result.family ? (
        <View style={s.section}>
          <Text style={s.label}>FAMILIA</Text>
          <Text style={s.value}>{result.family}</Text>
        </View>
      ) : null}

      <View style={s.section}>
        <View style={s.confidenceHeader}>
          <Text style={s.label}>CONFIANZA</Text>
          <Text style={[s.confidenceValue, { color: barColor }]}>
            {confidencePct}% · {confidenceLabel}
          </Text>
        </View>
        <View style={s.barTrack}>
          <View
            style={[
              s.barFill,
              { width: `${confidencePct}%`, backgroundColor: barColor },
            ]}
          />
        </View>
      </View>

      {result.care ? (
        <View style={s.careBox}>
          <Text style={s.careTitle}>CUIDADOS SUGERIDOS</Text>
          {result.care.water ? (
            <Text style={s.careLine}>
              <Text style={s.careLabel}>AGUA: </Text>
              {result.care.water}
            </Text>
          ) : null}
          {result.care.light ? (
            <Text style={s.careLine}>
              <Text style={s.careLabel}>LUZ: </Text>
              {result.care.light}
            </Text>
          ) : null}
          {result.care.soil ? (
            <Text style={s.careLine}>
              <Text style={s.careLabel}>SUELO: </Text>
              {result.care.soil}
            </Text>
          ) : null}
        </View>
      ) : null}

      {result.toxicity ? (
        <View style={s.warningBox}>
          <MaterialCommunityIcons
            name="alert-outline"
            size={18}
            color={theme.colors.secondary}
          />
          <Text style={s.warningText}>{result.toxicity}</Text>
        </View>
      ) : null}

      <View style={s.actions}>
        <Pressable style={[s.btn, s.btnAccept]} onPress={onAccept}>
          <Text style={s.btnAcceptText}>USAR ESTOS DATOS</Text>
        </Pressable>
        <Pressable style={[s.btn, s.btnCancel]} onPress={onDiscard}>
          <Text style={s.btnCancelText}>DESCARTAR</Text>
        </Pressable>
      </View>
    </View>
  );
};

function getStyles(t: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      padding: t.spacing.lg,
      gap: t.spacing.md,
      ...t.elevation.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
    },
    title: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.body,
      color: t.colors.textPrimary,
      letterSpacing: 1,
    },
    subtitle: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.body,
      color: t.colors.textSecondary,
      lineHeight: 20,
    },
    section: {
      gap: 4,
    },
    label: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textMuted,
      letterSpacing: 1,
    },
    value: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.body,
      color: t.colors.textPrimary,
    },
    italic: {
      fontStyle: 'italic',
    },
    confidenceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    confidenceValue: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.caption,
      letterSpacing: 1,
    },
    barTrack: {
      height: 10,
      backgroundColor: t.colors.surfaceVariant,
      borderWidth: t.borderWidths.thin,
      borderColor: t.colors.border,
      overflow: 'hidden',
      marginTop: 4,
    },
    barFill: {
      height: '100%',
    },
    careBox: {
      backgroundColor: t.colors.surfaceVariant,
      borderWidth: t.borderWidths.thin,
      borderColor: t.colors.border,
      padding: t.spacing.md,
      borderRadius: t.radius.sm,
      gap: 4,
    },
    careTitle: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textMuted,
      letterSpacing: 1,
      marginBottom: 4,
    },
    careLine: {
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.body,
      color: t.colors.textPrimary,
    },
    careLabel: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.primary,
      letterSpacing: 1,
    },
    warningBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
      padding: t.spacing.sm,
      backgroundColor: t.colors.surfaceVariant,
      borderWidth: t.borderWidths.thin,
      borderColor: t.colors.secondary,
      borderRadius: t.radius.sm,
    },
    warningText: {
      flex: 1,
      fontFamily: t.typography.fontFamilyMono,
      fontSize: t.typography.sizes.caption,
      color: t.colors.textSecondary,
    },
    actions: {
      gap: t.spacing.sm,
      marginTop: t.spacing.sm,
    },
    btn: {
      borderWidth: t.borderWidths.thick,
      borderRadius: t.radius.md,
      paddingVertical: t.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },
    btnAccept: {
      backgroundColor: t.colors.primary,
      borderColor: t.colors.border,
      ...t.elevation.sm,
    },
    btnAcceptText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textOnPrimary,
      letterSpacing: 1,
    },
    btnCancel: {
      backgroundColor: t.colors.surface,
      borderColor: t.colors.border,
    },
    btnCancelText: {
      fontFamily: t.typography.fontFamily,
      fontSize: t.typography.sizes.overline,
      color: t.colors.textSecondary,
      letterSpacing: 1,
    },
  });
}

export default AIResultCard;
