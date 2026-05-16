import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import {
  GENDER_OPTIONS,
  genderTileColor,
  type GenderOption,
} from '@/constants/genders';
import { RADIUS, SHADOW, SPACING } from '@/constants/theme';
import type { GenderWithCount } from '@/services/gender.service';

type Props = {
  counts?: GenderWithCount[];
  compact?: boolean;
};

export function GenderTileRow({ counts, compact }: Props) {
  const router = useRouter();
  const countFor = (opt: GenderOption) =>
    counts?.find((c) => c.id === opt.apiValue)?.count;

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      {GENDER_OPTIONS.map((g) => {
        const n = countFor(g);
        const bg = genderTileColor(g.colorKey, colors);
        return (
          <Pressable
            key={g.slug}
            onPress={() => router.push(`/category/${g.slug}`)}
            style={({ pressed }) => [
              styles.tile,
              compact && styles.tileCompact,
              { backgroundColor: bg },
              pressed && styles.tilePressed,
            ]}>
            <Text
              style={[styles.label, compact && styles.labelCompact]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}>
              {g.label}
            </Text>
            {n != null && n > 0 ? (
              <View style={styles.countBadge}>
                <Text style={styles.count}>{n}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  rowCompact: { marginBottom: SPACING.md },
  tile: {
    flex: 1,
    minWidth: 0,
    height: 88,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    ...SHADOW.card,
  },
  tileCompact: { height: 72 },
  tilePressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  label: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  labelCompact: { fontSize: 10 },
  countBadge: {
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
  },
  count: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
});
