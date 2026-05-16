import { colors } from '@/constants/colors';
import {
  GENDER_OPTIONS,
  genderTileColor,
  type GenderApiValue,
} from '@/constants/genders';

const SLUG_PREFIX = 'g_';

/** Parse `g_male` or legacy `g_Men` slug into API gender value. */
export function parseGenderSlug(slug: string): GenderApiValue | undefined {
  if (!slug.startsWith(SLUG_PREFIX)) return undefined;
  const rest = slug.slice(SLUG_PREFIX.length);
  const bySlug = GENDER_OPTIONS.find(
    (g) => g.slug === slug || g.slug === `${SLUG_PREFIX}${rest.toLowerCase()}`
  );
  if (bySlug) return bySlug.apiValue;
  return toApiGender(rest);
}

export function isGenderSlug(slug: string): boolean {
  return slug.startsWith(SLUG_PREFIX);
}

/** Normalize free-form gender string to canonical API value. */
export function toApiGender(value: string): GenderApiValue | undefined {
  const key = value.trim().toLowerCase();
  const map: Record<string, GenderApiValue> = {
    male: 'male',
    men: 'male',
    man: 'male',
    mens: 'male',
    female: 'female',
    women: 'female',
    woman: 'female',
    womens: 'female',
    kids: 'kids',
    kid: 'kids',
    children: 'kids',
    unisex: 'unisex',
  };
  return map[key];
}

export function genderDisplayName(apiValue: string | undefined): string {
  if (!apiValue) return 'Products';
  const labels: Record<string, string> = {
    male: "Men's",
    female: "Women's",
    kids: "Kids'",
    unisex: 'Unisex',
  };
  return labels[apiValue] ?? GENDER_OPTIONS.find((g) => g.apiValue === apiValue)?.label ?? apiValue;
}

export function genderSlugForApiValue(apiValue: GenderApiValue): string {
  return GENDER_OPTIONS.find((g) => g.apiValue === apiValue)?.slug ?? `g_${apiValue}`;
}

export function genderAccentColor(apiValue: string | undefined): string {
  if (!apiValue) return colors.primary;
  const opt = GENDER_OPTIONS.find((g) => g.apiValue === apiValue);
  return opt ? genderTileColor(opt.colorKey, colors) : colors.primary;
}
