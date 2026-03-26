/**
 * WateringFrequencyPicker
 * ─────────────────────────────────────────────────────────────
 * Componente controlado para seleccionar la frecuencia de riego
 * de una planta. Usa iconos de gota de agua (1-4) como indicador
 * visual en lugar de un TextInput o Picker nativo.
 *
 * Props:
 *   value    — opción seleccionada actualmente (o null)
 *   onChange — callback cuando el usuario elige una opción
 *   label    — etiqueta del campo (opcional)
 *
 * Uso:
 *   <WateringFrequencyPicker
 *     label="Frecuencia de riego"
 *     value={watering}
 *     onChange={setWatering}
 *   />
 *
 * Decisiones de UX/diseño:
 *   - Las gotas de agua refuerzan visualmente la cantidad (1=poco, 4=mucho)
 *   - El borde pixel-art en el ítem seleccionado da feedback inmediato
 *   - El color de fondo cambia al seleccionar (contraste WCAG AA)
 *   - Haptic feedback al cambiar la selección (confirmación táctil)
 *   - Iconos + texto = doble canal de información (accesibilidad)
 */

import { useAppTheme } from '@/src/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// ── Tipos ────────────────────────────────────────────────────────────────────

export type WateringFrequency = 'daily' | 'every3days' | 'weekly' | 'monthly';

interface FrequencyOption {
  value: WateringFrequency;
  label: string;
  sublabel: string;
  drops: number; // cuántas gotas se muestran (1-4)
}

const OPTIONS: FrequencyOption[] = [
  { value: 'daily',     label: 'Diario',      sublabel: 'cada día',    drops: 4 },
  { value: 'every3days',label: 'Cada 3 días', sublabel: 'moderado',    drops: 3 },
  { value: 'weekly',    label: 'Semanal',     sublabel: 'una vez/sem', drops: 2 },
  { value: 'monthly',  label: 'Mensual',     sublabel: 'resistente',  drops: 1 },
];

// ── Props ────────────────────────────────────────────────────────────────────

interface WateringFrequencyPickerProps {
  value: WateringFrequency | null;
  onChange: (value: WateringFrequency) => void;
  label?: string;
}

// ── Componente ───────────────────────────────────────────────────────────────

export function WateringFrequencyPicker({ value, onChange, label }: WateringFrequencyPickerProps) {
  const theme = useAppTheme();

  const handleSelect = (freq: WateringFrequency) => {
    if (freq === value) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(freq);
  };

  const s = StyleSheet.create({
    wrapper: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      fontFamily: 'PressStart2P',
      fontSize: 8,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      letterSpacing: 0.5,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    option: {
      flex: 1,
      minWidth: '45%',
      borderWidth: 2,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    optionIdle: {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    optionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryLight + '22',
      // sombra sólida pixel-art al seleccionar
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 3,
    },
    dropsRow: {
      flexDirection: 'row',
      gap: 2,
    },
    optionLabel: {
      fontFamily: 'PressStart2P',
      fontSize: 7,
      textAlign: 'center',
    },
    optionSublabel: {
      fontFamily: 'Courier New',
      fontSize: 10,
      textAlign: 'center',
    },
  });

  return (
    <View style={s.wrapper}>
      {label ? <Text style={s.label}>{label.toUpperCase()}</Text> : null}

      <View style={s.grid}>
        {OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          const dropColor = isSelected ? theme.colors.primary : theme.colors.border;

          return (
            <Pressable
              key={opt.value}
              style={[s.option, isSelected ? s.optionSelected : s.optionIdle]}
              onPress={() => handleSelect(opt.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${opt.label}: ${opt.sublabel}`}
            >
              {/* Gotas de agua — cantidad visual */}
              <View style={s.dropsRow}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <MaterialCommunityIcons
                    key={i}
                    name="water"
                    size={14}
                    color={i < opt.drops ? dropColor : theme.colors.border + '33'}
                  />
                ))}
              </View>

              <Text style={[s.optionLabel, { color: isSelected ? theme.colors.primary : theme.colors.textPrimary }]}>
                {opt.label}
              </Text>
              <Text style={[s.optionSublabel, { color: theme.colors.textSecondary }]}>
                {opt.sublabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
