import { colors } from './Colors';

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const RADIUS = { sm: 6, md: 10, lg: 16, pill: 999 } as const;
export const SHADOW = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
} as const;

export const theme = {
  colors,
  SPACING,
  RADIUS,
  SHADOW,
} as const;
