export const Colors = {
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
};

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
