/**
 * ============================================================================
 * Chat.styles — Estilos de la pantalla de chat grupal (estetica pixel art)
 * ============================================================================
 */

import type { AppTheme } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function getStyles(t: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.colors.background,
    },

    // ── Header ───────────────────────────────────
    header: {
      paddingTop: 56,
      paddingBottom: t.spacing.md,
      paddingHorizontal: t.spacing.lg,
      backgroundColor: t.colors.surfaceVariant,
      borderBottomWidth: t.borderWidths.thick,
      borderBottomColor: t.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: t.spacing.sm,
    },
    headerTexts: {
      flex: 1,
    },
    backBtn: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusDot: {
      width: 12,
      height: 12,
      borderRadius: t.radius.sm,
      borderWidth: t.borderWidths.medium,
      borderColor: t.colors.border,
    },

    // ── Selector General / Personas ──────────────
    segment: {
      flexDirection: 'row',
      gap: t.spacing.sm,
      paddingHorizontal: t.spacing.lg,
      paddingTop: t.spacing.md,
      paddingBottom: t.spacing.xs,
    },

    // ── Fila de usuario (lista de personas) ──────
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      padding: t.spacing.md,
      marginBottom: t.spacing.sm,
      ...t.elevation.sm,
    },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: t.radius.sm,
      backgroundColor: t.colors.primary,
      borderWidth: t.borderWidths.medium,
      borderColor: t.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userInfo: {
      flex: 1,
    },

    // ── Lista de mensajes ────────────────────────
    listContent: {
      padding: t.spacing.lg,
      gap: t.spacing.sm,
    },

    // ── Burbujas ─────────────────────────────────
    row: {
      flexDirection: 'row',
      marginBottom: t.spacing.sm,
    },
    rowMine: {
      justifyContent: 'flex-end',
    },
    rowTheirs: {
      justifyContent: 'flex-start',
    },
    bubble: {
      maxWidth: '80%',
      paddingVertical: t.spacing.sm,
      paddingHorizontal: t.spacing.md,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      ...t.elevation.sm,
    },
    bubbleMine: {
      backgroundColor: t.colors.primary,
    },
    bubbleTheirs: {
      backgroundColor: t.colors.surface,
    },
    bubbleMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: t.spacing.md,
      marginTop: t.spacing.xs,
    },

    // ── Barra de composicion ─────────────────────
    composer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: t.spacing.sm,
      paddingHorizontal: t.spacing.lg,
      paddingTop: t.spacing.sm,
      paddingBottom: t.spacing.lg,
      borderTopWidth: t.borderWidths.thick,
      borderTopColor: t.colors.border,
      backgroundColor: t.colors.surfaceVariant,
    },
    input: {
      flex: 1,
      backgroundColor: t.colors.surface,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      borderRadius: t.radius.md,
      paddingVertical: 12,
      paddingHorizontal: 14,
      fontSize: 13,
      fontFamily: t.typography.fontFamilyMono,
      color: t.colors.textPrimary,
      maxHeight: 120,
    },
    sendBtn: {
      width: 52,
      height: 52,
      borderRadius: t.radius.md,
      borderWidth: t.borderWidths.thick,
      borderColor: t.colors.border,
      backgroundColor: t.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...t.elevation.sm,
    },
    sendBtnDisabled: {
      backgroundColor: t.colors.disabled,
      borderColor: t.colors.border,
    },

    // ── Estados (carga / error / vacio) ──────────
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: t.spacing['2xl'],
      gap: t.spacing.md,
    },
    retryBtn: {
      marginTop: t.spacing.md,
      minWidth: 160,
    },
  });
}
