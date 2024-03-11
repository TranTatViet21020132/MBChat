const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

const COLORS = {
  gray: '#6E6E73',
  lightGray: '#DCDCE2',
  green: '#4FEE57',
  lightGreen: '#DBFFCB',
  red: '#EF0827',
  yellow: '#FCC70B',

  light: {
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    background: '#EFEEF6',
    text: '#6E6E73',
    primary: '#1063FD',
    muted: '#3A5A92',
    link: '#1063FD',

    welcome: {
      headline: '#000',
      background: '#fff',
      description: '#6E6E73',
      buttonText: '#1063FD',
    },

    otp: {
      background: '#EFEEF6',
      description: '#6E6E73',
      list: '#fff',
      listItem: '#fff',
      listItemText: '#1063FD',
      separator: '#6E6E73',
      legal: '#000',
      phoneCode: '#fff',
      phoneCodeText: '#000',
      button: '#DCDCE2',
      input: '#000',
    },

    verify: {
      legal: '#000', 
    }
  },

  dark: {
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    background: '#000',
    text: '#1063FD',
    primary: '#1063FD',
    muted: '#3A5A92',
    link: '#1063FD',

    welcome: {
      headline: '#fff',
      background: '#000',
      description: '#6E6E73',
      buttonText: '#1063FD',
    },

    otp: {
      background: '#000',
      description: '#6E6E73',
      list: '#1C1C1E',
      listItem: '#1C1C1E',
      listItemText: '#1063FD',
      separator: '#6E6E73',
      legal: '#6E6E73',
      phoneCode: '#1C1C1E',
      phoneCodeText: '#fff',
      button: '#DCDCE2',
      input: '#fff',
    },

    verify: {
      legal: '#6E6E73',
    }
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

export { COLORS, SIZES, SHADOWS };