import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';

export const authFormStyles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: SPACING.lg, paddingBottom: SPACING.xl },
  scrollCentered: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
    color: colors.darkGray,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    marginBottom: SPACING.sm,
    fontSize: 16,
    color: colors.darkGray,
  },
  inputErr: { borderColor: colors.error },
  fieldErr: { color: colors.error, marginBottom: SPACING.sm, fontSize: 12 },
  err: {
    color: colors.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  success: {
    color: colors.success,
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontWeight: '600',
  },
  footerLink: {
    marginTop: SPACING.lg,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '600',
  },
  footerMuted: {
    textAlign: 'center',
    color: colors.mediumGray,
    marginTop: SPACING.lg,
  },
});
