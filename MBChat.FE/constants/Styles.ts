import { COLORS } from '@/constants/Colors';
import { StyleSheet } from 'react-native';
import { useColorScheme } from '../components/useColorScheme';

type ColorName = keyof typeof COLORS.light & keyof typeof COLORS.dark;

export function useColor(props: { light?: string; dark?: string }, colorName: ColorName) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    const color = COLORS[theme][colorName];
    if (typeof color === 'string') {
      return color;
    } else {
      return undefined;
    }
  }
}

export const defaultStyles = StyleSheet.create({
  block: {
    backgroundColor: useColor({}, 'background'),
    borderRadius: 10,
    marginHorizontal: 14,
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.lightGray,
    marginLeft: 50,
  },
});
