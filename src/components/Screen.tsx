import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { sk } from '@/constants/sk';

import { BackChevron } from './Icons';

type ScreenProps = {
  bg?: string;
  dark?: boolean;
  children: ReactNode;
  /** Vypne vnútorné okraje (pre obrazovky s vlastným rozložením). */
  bare?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ bg = colors.cream, dark = false, children, bare, style }: ScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: bg,
          paddingTop: bare ? 0 : insets.top + 12,
          paddingBottom: bare ? 0 : insets.bottom + 16,
          paddingHorizontal: bare ? 0 : 20,
        },
        style,
      ]}
    >
      <StatusBar style={dark ? 'light' : 'dark'} />
      {children}
    </View>
  );
}

/** Okrúhle tlačidlo späť + dva body (alebo dlhý a krátky) označujúce krok. */
export function StepHeader({ onBack, step, label }: { onBack: () => void; step: 1 | 2; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={sk.common.back}
        style={({ pressed }) => ({
          width: 56,
          height: 56,
          borderRadius: 28,
          borderWidth: 3,
          borderColor: colors.border,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ translateY: pressed ? 3 : 0 }],
        })}
      >
        <BackChevron />
      </Pressable>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} accessibilityLabel={label}>
        <View style={{ width: step === 1 ? 44 : 14, height: 14, borderRadius: 7, backgroundColor: step === 1 ? colors.purple : colors.borderDark }} />
        <View style={{ width: step === 2 ? 44 : 14, height: 14, borderRadius: 7, backgroundColor: step === 2 ? colors.purple : colors.borderDark }} />
      </View>
    </View>
  );
}

/** Dekoratívne kruhy v pozadí. */
export function Blob({ size, color, style, opacity = 1 }: { size: number; color: string; style: ViewStyle; opacity?: number }) {
  return (
    <View
      pointerEvents="none"
      style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity }, style]}
    />
  );
}
