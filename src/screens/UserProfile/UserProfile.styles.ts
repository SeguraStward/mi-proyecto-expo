import { PlantColors } from '@/src/constants/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ── Contenedor general ────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: PlantColors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── Header ────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: PlantColors.primaryPale,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatarWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: PlantColors.primary,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: PlantColors.white,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  nickname: {
    fontSize: 22,
    fontWeight: '700',
    color: PlantColors.textPrimary,
  },
  fullName: {
    fontSize: 14,
    color: PlantColors.textSecondary,
    marginTop: 2,
  },
  bio: {
    fontSize: 13,
    color: PlantColors.textMuted,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 18,
  },

  // ── Stats card ────────────────────────────────────────────
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: PlantColors.surface,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 12,
    // sombra
    shadowColor: PlantColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: PlantColors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: PlantColors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: PlantColors.divider,
    marginVertical: 4,
  },

  // ── Secciones ─────────────────────────────────────────────
  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PlantColors.textPrimary,
    marginBottom: 12,
  },

  // ── Categorías (chips) ────────────────────────────────────
  categoryChip: {
    backgroundColor: PlantColors.chipBackground,
    borderWidth: 1,
    borderColor: PlantColors.chipBorder,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: PlantColors.chipText,
  },

  // ── Planta favorita ───────────────────────────────────────
  favoritePlantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PlantColors.primaryPale,
    borderRadius: 16,
    padding: 16,
  },
  favoritePlantEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  favoritePlantLabel: {
    fontSize: 12,
    color: PlantColors.textSecondary,
  },
  favoritePlantName: {
    fontSize: 16,
    fontWeight: '600',
    color: PlantColors.textPrimary,
    marginTop: 2,
  },

  // ── Cumpleaños ────────────────────────────────────────────
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: PlantColors.textSecondary,
  },

  // ── Privacidad switch ─────────────────────────────────────
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: PlantColors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: PlantColors.border,
  },
  privacyLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: PlantColors.textPrimary,
  },
  privacyHint: {
    fontSize: 12,
    color: PlantColors.textMuted,
    marginTop: 2,
  },

  // ── Botón editar ──────────────────────────────────────────
  editButtonWrapper: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
});
