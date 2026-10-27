import { Text, type TextProps } from 'react-native';

import { colors, font, type Weight } from '@/constants/theme';

type Props = TextProps & {
  size?: number;
  w?: Weight;
  color?: string;
  center?: boolean;
  lh?: number;
};

/** Text s písmom Baloo 2. Veľkosť, hrúbka a farba sa zadávajú ako props. */
export function T({ size = 20, w = 'regular', color = colors.ink, center, lh, style, ...rest }: Props) {
  return (
    <Text
      maxFontSizeMultiplier={1.15}
      {...rest}
      style={[
        {
          fontFamily: font[w],
          fontSize: size,
          color,
          lineHeight: lh ?? Math.round(size * 1.2),
          textAlign: center ? 'center' : undefined,
        },
        style,
      ]}
    />
  );
}
