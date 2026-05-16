import type { colors } from '@/constants/colors';

export type GenderApiValue = 'male' | 'female' | 'kids' | 'unisex';

export type GenderColorKey = 'mensTile' | 'womensTile' | 'kidsTile' | 'unisexTile';

export type GenderOption = {
  slug: string;
  label: string;
  apiValue: GenderApiValue;
  colorKey: GenderColorKey;
};

export const GENDER_OPTIONS: GenderOption[] = [
  { slug: 'g_male', label: "MEN'S", apiValue: 'male', colorKey: 'mensTile' },
  { slug: 'g_female', label: "WOMEN'S", apiValue: 'female', colorKey: 'womensTile' },
  { slug: 'g_kids', label: "KIDS'", apiValue: 'kids', colorKey: 'kidsTile' },
  { slug: 'g_unisex', label: 'UNISEX', apiValue: 'unisex', colorKey: 'unisexTile' },
];

export function genderTileColor(
  colorKey: GenderColorKey,
  palette: typeof colors
): string {
  return palette[colorKey];
}
