import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';

import { T } from './T';

type Variant = 'primary' | 'yellow' | 'white' | 'teal' | 'danger';

const VARIANTS: Record<Variant, { bg: string; fg: string; shadow: string; border?: string }> = {
  primary: { bg: colors.purple, fg: colors.white, shadow: colors.purpleDark },
  yellow: { bg: colors.yellow, fg: colors.ink, shadow: colors.yellowDark },
  white: { bg: colors.white, fg: colors.ink, shadow: colors.border, border: colors.border },
  teal: { bg: colors.teal, fg: colors.white, shadow: colors.tealDark },
  danger: { bg: colors.pink, fg: colors.ink, shadow: '#C23B66' },
};

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  height?: number;
  fontSize?: number;
  radius?: number;
  disabled?: boolean;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/** Veľké tlačidlo s "3D" hranou, ktorá sa pri stlačení zatlačí. */
export function BigButton({
  label,
  onPress,
  variant = 'primary',
  height = 72,
  fontSize = 32,
  radius = 28,
  disabled,
  icon,
  iconAfter,
  style,
  accessibilityLabel,
}: Props) {
  const v = VARIANTS[variant];
  const lip = 6;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      style={[{ opacity: disabled ? 0.45 : 1 }, style]}
    >
      {({ pressed }) => (
        <View style={{ backgroundColor: v.shadow, borderRadius: radius, paddingBottom: pressed ? 2 : lip, marginTop: pressed ? lip - 2 : 0 }}>
          <View
            style={{
              height,
              borderRadius: radius,
              backgroundColor: v.bg,
              borderWidth: v.border ? 3 : 0,
              borderColor: v.border,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              paddingHorizontal: 16,
            }}
          >
            {icon}
            <T size={fontSize} w="bold" color={v.fg} numberOfLines={1} adjustsFontSizeToFit>
              {label}
            </T>
            {iconAfter}
          </View>
        </View>
      )}
    </Pressable>
  );
}

type ChoiceProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  height?: number;
  fontSize?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

/** Veľké prepínateľné tlačidlo (počet hráčov, podvodníkov, možnosti hádania). */
export function ChoiceButton({ label, selected, onPress, height = 72, fontSize = 30, radius = 24, style }: ChoiceProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={[{ flex: 1 }, style]}
    >
      {({ pressed }) => (
        <View
          style={{
            backgroundColor: selected ? colors.purpleDark : colors.border,
            borderRadius: radius,
            paddingBottom: pressed ? 2 : 5,
            marginTop: pressed ? 3 : 0,
          }}
        >
          <View
            style={{
              height,
              borderRadius: radius,
              backgroundColor: selected ? colors.purple : colors.white,
              borderWidth: 3,
              borderColor: selected ? colors.purple : colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <T size={fontSize} w="bold" color={selected ? colors.white : colors.ink} numberOfLines={1} adjustsFontSizeToFit>
              {label}
            </T>
          </View>
        </View>
      )}
    </Pressable>
  );
}

/** Štvorcové tlačidlo s ikonou (kocka, zavrieť). */
export function IconButton({
  children,
  onPress,
  label,
  size = 56,
  radius = 20,
}: {
  children: ReactNode;
  onPress: () => void;
  label: string;
  size?: number;
  radius?: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: radius,
        borderWidth: 3,
        borderColor: colors.border,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateY: pressed ? 3 : 0 }],
      })}
    >
      {children}
    </Pressable>
  );
}
