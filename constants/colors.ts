export const colors = {
  primary: '#E8193C',
  primaryDark: '#C0143A',
  success: '#2E7D32',
  warning: '#FF6F00',
  error: '#B00020',
  white: '#FFFFFF',
  offWhite: '#F5F5F5',
  lightGray: '#EEEEEE',
  mediumGray: '#9E9E9E',
  darkGray: '#212121',
  mensTile: '#00838F',
  womensTile: '#AD1457',
  kidsTile: '#2E7D32',
} as const;

const tintColorLight = colors.primary;
const tintColorDark = '#ffffff';

/** Legacy tab template theme (Themed.tsx / EditScreenInfo) */
export default {
  light: {
    text: colors.darkGray,
    background: colors.white,
    tint: tintColorLight,
    tabIconDefault: colors.mediumGray,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: colors.white,
    background: '#000000',
    tint: tintColorDark,
    tabIconDefault: colors.mediumGray,
    tabIconSelected: tintColorDark,
  },
} as const;
