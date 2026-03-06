/**
 * ============================================================================
 * UserProfile.styles — Estilos de la pantalla de perfil de usuario
 * ============================================================================
 *
 * Propósito:
 *   Estilos extraídos para la pantalla UserProfile. Ahora usa tokens
 *   del Design System (getAppTheme) para colores, espaciado, radios
 *   y elevaciones, garantizando coherencia con el resto de la app.
 *
 * Nota: Este archivo usa getAppTheme('light') como base estática.
 *   Para soporte dinámico de dark mode, los estilos dependientes de
 *   color se aplican inline en el componente usando useAppTheme().
 *
 * @see docs/DESIGN_SYSTEM.md
 * ============================================================================
 */

import { getAppTheme } from '@/src/theme/designSystem';
import { StyleSheet } from 'react-native';

// Obtenemos valores base para estilos estáticos (los colores dinámicos se aplican inline)
const t = getAppTheme('light');

export const styles = StyleSheet.create({
  // ── Contenedor general ────────────────────────────────────
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: t.spacing['4xl'],
  },

  // ── Header ────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: t.spacing['2xl'],
    borderBottomLeftRadius: t.radius.xl + 4,
    borderBottomRightRadius: t.radius.xl + 4,
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: t.radius.full,
    borderWidth: 3,
    overflow: 'hidden',
    marginBottom: t.spacing.md,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  nickname: {
    fontSize: t.typography.sizes.subtitle + 2,
    fontWeight: t.typography.weights.bold,
  },
  fullName: {
    fontSize: t.typography.sizes.bodySmall,
    marginTop: 2,
  },
  bio: {
    fontSize: t.typography.sizes.caption + 1,
    marginTop: t.spacing.sm,
    textAlign: 'center',
    paddingHorizontal: t.spacing['4xl'],
    lineHeight: 18,
  },

  // ── Stats card ────────────────────────────────────────────
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: t.spacing.xl,
    marginTop: -20,
    borderRadius: t.radius.lg,
    paddingVertical: t.spacing.xl,
    paddingHorizontal: t.spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: t.typography.sizes.subtitle + 2,
    fontWeight: t.typography.weights.bold,
  },
  statLabel: {
    fontSize: t.typography.sizes.caption,
    marginTop: t.spacing.xs,
  },
  statDivider: {
    width: 1,
    marginVertical: t.spacing.xs,
  },

  // ── Secciones ─────────────────────────────────────────────
  section: {
    marginTop: t.spacing['2xl'] + 4,
    paddingHorizontal: t.spacing.xl,
  },
  sectionTitle: {
    fontSize: t.typography.sizes.body,
    fontWeight: t.typography.weights.semibold,
    marginBottom: t.spacing.md,
  },

  // ── Categorías (chips) ────────────────────────────────────
  categoryChip: {
    borderWidth: 1,
    borderRadius: t.radius.lg,
    paddingVertical: t.spacing.sm,
    paddingHorizontal: t.spacing.lg + 2,
    marginRight: t.spacing.sm + 2,
  },
  categoryChipText: {
    fontSize: t.typography.sizes.caption + 1,
    fontWeight: t.typography.weights.medium,
  },

  // ── Planta favorita ───────────────────────────────────────
  favoritePlantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: t.radius.lg - 4,
    padding: t.spacing.lg,
  },
  favoritePlantEmoji: {
    fontSize: 28,
    marginRight: t.spacing.md,
  },
  favoritePlantLabel: {
    fontSize: t.typography.sizes.caption,
  },
  favoritePlantName: {
    fontSize: t.typography.sizes.body,
    fontWeight: t.typography.weights.semibold,
    marginTop: 2,
  },

  // ── Cumpleaños ────────────────────────────────────────────
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: t.spacing.sm,
  },
  infoEmoji: {
    fontSize: 18,
    marginRight: t.spacing.sm,
  },
  infoText: {
    fontSize: t.typography.sizes.bodySmall,
  },

  // ── Privacidad switch ─────────────────────────────────────
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: t.radius.lg - 4,
    padding: t.spacing.lg,
    marginTop: t.spacing.md,
    borderWidth: 1,
  },
  privacyLabel: {
    fontSize: t.typography.sizes.body - 1,
    fontWeight: t.typography.weights.medium,
  },
  privacyHint: {
    fontSize: t.typography.sizes.caption,
    marginTop: 2,
  },

  // ── Botón editar ──────────────────────────────────────────
  editButtonWrapper: {
    marginTop: t.spacing['3xl'],
    paddingHorizontal: t.spacing.xl,
  },
});
