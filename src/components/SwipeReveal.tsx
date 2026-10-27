import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

type Props = {
  /** Výška celého panelu. Pri otvorení siaha od vrchu (sheetHeight od spodku) po spodok obrazovky. */
  sheetHeight: number;
  /** Koľko panelu je vidieť, kým je zatvorený. */
  peekHeight: number;
  /** Obsah za panelom, kým je zatvorený. */
  closedBehind: ReactNode;
  /** Obsah za panelom (nad ním), kým je otvorený. */
  openBehind: ReactNode;
  /** Obsah panelu, kým je zatvorený (výzva potiahnuť nahor, tlačidlo ďalej). */
  peek: ReactNode;
  /** Obsah panelu, kým je otvorený (slovo alebo nápoveda). */
  revealed: ReactNode;
  /** Farba, ktorou sa panel vyfarbí pri odhalení. Má byť rovnaká pre všetky roly. */
  revealColor: string;
  /** Farba hrany panelu. */
  edgeColor?: string;
  /** Peek obsah prijíma dotyky (tlačidlo), len keď je true. */
  peekInteractive?: boolean;
  /** Zavolá sa raz, keď je panel natiahnutý dosť vysoko na to, aby bolo slovo čitateľné. */
  onRevealed?: () => void;
};

/** Pomer natiahnutia, od ktorého je slovo plne viditeľné (0 = hore, 1 = zatvorený). */
const READABLE_AT = 0.3;
/** Prst sa pohne o toľko, o koľko sa pohne panel × tento činiteľ, aby stačil kratší ťah. */
const GAIN = 1.3;

/**
 * Panel, ktorý sa ťahá zo spodku obrazovky nahor a odhalí tajnú kartu, kým ho držíš.
 * Po pustení spadne späť dole.
 */
export function SwipeReveal({
  sheetHeight,
  peekHeight,
  closedBehind,
  openBehind,
  peek,
  revealed,
  revealColor,
  edgeColor = colors.purpleDark,
  peekInteractive = false,
  onRevealed,
}: Props) {
  const range = Math.max(1, sheetHeight - peekHeight);
  const y = useRef(new Animated.Value(range)).current;
  const pos = useRef(range);
  const startPos = useRef(range);
  const revealedOnce = useRef(false);
  const rangeRef = useRef(range);
  const onRevealedRef = useRef(onRevealed);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  rangeRef.current = range;
  onRevealedRef.current = onRevealed;

  useEffect(() => {
    const id = y.addListener(({ value }) => {
      pos.current = value;
      if (!revealedOnce.current && value <= rangeRef.current * READABLE_AT) {
        revealedOnce.current = true;
        onRevealedRef.current?.();
      }
    });
    return () => {
      y.removeListener(id);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [y]);

  const drop = useRef(() => {
    Animated.spring(y, {
      toValue: rangeRef.current,
      useNativeDriver: false,
      bounciness: 3,
      speed: 14,
    }).start();
  }).current;

  const lift = useRef(() => {
    Animated.spring(y, {
      toValue: 0,
      useNativeDriver: false,
      bounciness: 0,
      speed: 16,
    }).start();
  }).current;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 3,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        if (timer.current) clearTimeout(timer.current);
        y.stopAnimation();
        startPos.current = pos.current;
      },
      onPanResponderMove: (_, g) => {
        const next = Math.min(rangeRef.current, Math.max(0, startPos.current + g.dy * GAIN));
        y.setValue(next);
      },
      // Pustenie = panel padne späť. Slovo sa dá pozerať len kým ho držíš.
      onPanResponderRelease: drop,
      onPanResponderTerminate: drop,
    }),
  ).current;

  const closedBehindOpacity = y.interpolate({
    inputRange: [range * 0.5, range],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const openBehindOpacity = y.interpolate({
    inputRange: [0, range * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const peekOpacity = y.interpolate({
    inputRange: [range * 0.55, range],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const revealedOpacity = y.interpolate({
    inputRange: [range * 0.3, range * 0.65],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const colorOpacity = y.interpolate({
    inputRange: [range * 0.35, range * 0.75],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: closedBehindOpacity }]}>
        {closedBehind}
      </Animated.View>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: openBehindOpacity }]}>
        {openBehind}
      </Animated.View>

      <Animated.View
        {...pan.panHandlers}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Panel s tajnou kartou. Potiahni nahor a drž."
        accessibilityActions={[{ name: 'activate' }]}
        onAccessibilityAction={() => {
          // Čítačka obrazovky: panel sa na chvíľu otvorí a sám zase spadne.
          lift();
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(drop, 6000);
        }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: sheetHeight,
          transform: [{ translateY: y }],
          backgroundColor: colors.white,
          borderTopLeftRadius: 44,
          borderTopRightRadius: 44,
          borderTopWidth: 8,
          borderColor: edgeColor,
          overflow: 'hidden',
        }}
      >
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: revealColor, opacity: colorOpacity }]} />
        <Animated.View pointerEvents={peekInteractive ? 'box-none' : 'none'} style={[StyleSheet.absoluteFill, { opacity: peekOpacity }]}>
          {peek}
        </Animated.View>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: revealedOpacity }]}>
          {revealed}
        </Animated.View>
      </Animated.View>
    </View>
  );
}
