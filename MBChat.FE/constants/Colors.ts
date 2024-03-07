const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: '#1063FD',
    muted: '#3A5A92',
    gray: '#6E6E73',
    lightGray: '#DCDCE2',
    green: '#4FEE57',
    lightGreen: '#DBFFCB',
    red: '#EF0827',
    yellow: '#FCC70B',

    text: '#000',
    background: '#fff',
    description: '#6E6E73',
    link: '#1063FD',
    list: '#fff',
  },
  dark: {
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    primary: '#1063FD',
    muted: '#3A5A92',
    gray: '#6E6E73',
    lightGray: '#DCDCE2',
    green: '#4FEE57',
    lightGreen: '#DBFFCB',
    red: '#EF0827',
    yellow: '#FCC70B',

    text: '#fff',
    background: '#000',
    description: '#6E6E73',
    link: '#1063FD',
    list: '#000',
  },
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { SIZES, SHADOWS };