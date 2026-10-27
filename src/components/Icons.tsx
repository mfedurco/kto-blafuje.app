import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import { colors } from '@/constants/theme';
import type { IconName } from '@/data/words';

const ink = colors.ink;

/** Okrúhly avatar s jednoduchou tvárou. */
export function Face({ size = 56, color, ring }: { size?: number; color: string; ring?: boolean }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: ring ? Math.max(3, size * 0.04) : 0,
        borderColor: colors.white,
      }}
    >
      <Svg width={size * 0.68} height={size * 0.68} viewBox="0 0 40 40">
        <Circle cx={14} cy={17} r={3.4} fill={ink} />
        <Circle cx={26} cy={17} r={3.4} fill={ink} />
        <Path d="M12 25 Q20 32 28 25" stroke={ink} strokeWidth={3.4} fill="none" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

export function CategoryIcon({ name, size = 32 }: { name: IconName; size?: number }) {
  const common = { stroke: ink, strokeWidth: 2.5, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      {name === 'paw' && (
        <G fill={ink}>
          <Ellipse cx={16} cy={21} rx={8} ry={6.5} />
          <Circle cx={6.5} cy={13} r={3} />
          <Circle cx={12} cy={8} r={3} />
          <Circle cx={20} cy={8} r={3} />
          <Circle cx={25.5} cy={13} r={3} />
        </G>
      )}
      {name === 'pizza' && (
        <G>
          <Path d="M16 28 L4 8 Q16 2 28 8 Z" fill={colors.yellow} {...common} />
          <Circle cx={12} cy={12} r={2.6} fill={colors.coral} />
          <Circle cx={19.5} cy={12.5} r={2.6} fill={colors.coral} />
          <Circle cx={16} cy={19} r={2.6} fill={colors.coral} />
        </G>
      )}
      {name === 'castle' && (
        <G>
          <Path d="M5 28 V11 h5 v3 h4 v-3 h4 v3 h4 v-3 h5 V28 Z" fill="#B9A8FF" {...common} />
          <Path d="M13 28 v-6 a3 3 0 0 1 6 0 v6 Z" fill={ink} />
        </G>
      )}
      {name === 'house' && (
        <G>
          <Path d="M4 15 L16 5 L28 15 V27 H4 Z" fill="#7FD6C8" {...common} />
          <Rect x={13} y={18} width={6} height={9} rx={1} fill={ink} />
        </G>
      )}
      {name === 'hardhat' && (
        <G>
          <Path d="M6 21 a10 10 0 0 1 20 0 Z" fill={colors.yellow} {...common} />
          <Rect x={3.5} y={21} width={25} height={5} rx={2.5} fill={colors.yellow} stroke={ink} strokeWidth={2.5} />
          <Path d="M16 11 V21" stroke={ink} strokeWidth={2.5} strokeLinecap="round" />
        </G>
      )}
      {name === 'ball' && (
        <G>
          <Circle cx={16} cy={16} r={12} fill={colors.white} stroke={ink} strokeWidth={2.5} />
          <Path d="M16 10 L21 14 L19 20 H13 L11 14 Z" fill={ink} />
          <Path d="M16 10 V4 M21 14 L27 12 M19 20 L23 25 M13 20 L9 25 M11 14 L5 12" stroke={ink} strokeWidth={2} strokeLinecap="round" />
        </G>
      )}
      {name === 'pin' && (
        <G>
          <Path d="M16 29 C9 20 6 16 6 12 a10 10 0 0 1 20 0 c0 4 -3 8 -10 17 Z" fill={colors.coral} {...common} />
          <Circle cx={16} cy={12} r={3.5} fill={colors.white} stroke={ink} strokeWidth={2} />
        </G>
      )}
      {name === 'car' && (
        <G>
          <Path d="M3 20 L6 12 Q7 10 9 10 H23 Q25 10 26 12 L29 20 V24 H3 Z" fill={colors.yellow} {...common} />
          <Path d="M9 12.5 H23 L24.6 18 H7.4 Z" fill={colors.blue} />
          <Circle cx={9} cy={25} r={3.5} fill={ink} />
          <Circle cx={23} cy={25} r={3.5} fill={ink} />
        </G>
      )}
      {name === 'leaf' && (
        <G>
          <Path d="M6 26 C6 12 14 6 27 5 C27 18 21 26 8 27 Z" fill="#7FD6A0" {...common} />
          <Path d="M6 27 C12 20 16 16 22 11" stroke={ink} strokeWidth={2} fill="none" strokeLinecap="round" />
        </G>
      )}
      {name === 'shirt' && (
        <Path d="M11 5 L5 9 L8 14 L11 12 V27 H21 V12 L24 14 L27 9 L21 5 Q16 9 11 5 Z" fill="#B9A8FF" {...common} />
      )}
      {name === 'book' && (
        <G>
          <Path d="M4 7 Q10 5 16 8 V26 Q10 23 4 25 Z" fill={colors.yellow} {...common} />
          <Path d="M28 7 Q22 5 16 8 V26 Q22 23 28 25 Z" fill="#FFE3B3" {...common} />
        </G>
      )}
      {name === 'apple' && (
        <G>
          <Path d="M16 10 C10 6 4 10 5 17 C6 24 11 28 16 26 C21 28 26 24 27 17 C28 10 22 6 16 10 Z" fill={colors.coral} {...common} />
          <Path d="M16 10 Q16 6 19 4" stroke={ink} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Path d="M19 5 Q23 3 24 7 Q20 8 19 5 Z" fill="#7FD6A0" />
        </G>
      )}
      {name === 'note' && (
        <G>
          <Path d="M12 24 V8 L25 5 V21" stroke={ink} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx={9} cy={24} r={4} fill={ink} />
          <Circle cx={22} cy={21} r={4} fill={ink} />
        </G>
      )}
      {name === 'gift' && (
        <G>
          <Rect x={5} y={13} width={22} height={14} rx={2} fill={colors.pink} stroke={ink} strokeWidth={2.5} />
          <Rect x={4} y={9} width={24} height={5} rx={2} fill={colors.pinkSoft} stroke={ink} strokeWidth={2.5} />
          <Path d="M16 9 V27" stroke={ink} strokeWidth={2.5} />
          <Path d="M16 9 Q10 3 9 7 Q9 10 16 9 Q23 10 23 7 Q22 3 16 9 Z" fill="none" stroke={ink} strokeWidth={2} />
        </G>
      )}
      {name === 'star' && (
        <Path d="M16 4 L19.5 12 L28 13 L21.5 19 L23.5 28 L16 23.5 L8.5 28 L10.5 19 L4 13 L12.5 12 Z" fill={colors.yellow} {...common} />
      )}
    </Svg>
  );
}

/** Tri šípky smerom nahor (pozvánka potiahnuť panel). */
export function ChevronsUp({ color = colors.purple, width = 72 }: { color?: string; width?: number }) {
  const h = (width * 84) / 72;
  const p = { fill: 'none' as const, stroke: color, strokeWidth: 8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={width} height={h} viewBox="0 0 72 84">
      <Path d="M12 28 L36 8 L60 28" {...p} opacity={0.3} />
      <Path d="M12 48 L36 28 L60 48" {...p} opacity={0.6} />
      <Path d="M12 68 L36 48 L60 68" {...p} />
    </Svg>
  );
}

export function ChevronsDown({ color = colors.teal, width = 72 }: { color?: string; width?: number }) {
  const h = (width * 60) / 72;
  const p = { fill: 'none' as const, stroke: color, strokeWidth: 8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={width} height={h} viewBox="0 0 72 60">
      <Path d="M12 8 L36 28 L60 8" {...p} opacity={0.35} />
      <Path d="M12 28 L36 48 L60 28" {...p} />
    </Svg>
  );
}

export function BackChevron({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28">
      <Path d="M17 5 L8 14 L17 23" fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CloseIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M5 5 L19 19 M19 5 L5 19" stroke={ink} strokeWidth={3.5} strokeLinecap="round" />
    </Svg>
  );
}

export function CheckBadge({ size = 30 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 18 18">
        <Path d="M3.5 9.5 L7.5 13.5 L14.5 5" fill="none" stroke={colors.white} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

export function PlayIcon({ size = 34, color = colors.yellow }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      <Path d="M10 6 L30 18 L10 30 Z" fill={color} stroke={color} strokeWidth={4} strokeLinejoin="round" />
    </Svg>
  );
}

export function ArrowRight({ size = 30, color = colors.yellow }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30">
      <Path d="M7 15 H22 M15 7 L23 15 L15 23" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function PauseIcon({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26">
      <Rect x={5} y={4} width={5.5} height={18} rx={2} fill={ink} />
      <Rect x={15.5} y={4} width={5.5} height={18} rx={2} fill={ink} />
    </Svg>
  );
}

export function DiceIcon({ size = 30 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 30 30">
      <Rect x={4} y={4} width={22} height={22} rx={6} fill={colors.yellow} stroke={ink} strokeWidth={2.5} />
      <Circle cx={10.5} cy={10.5} r={2} fill={ink} />
      <Circle cx={15} cy={15} r={2} fill={ink} />
      <Circle cx={19.5} cy={19.5} r={2} fill={ink} />
    </Svg>
  );
}

export function PencilIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 20 L5 15 L16 4 L20 8 L9 19 Z" fill={colors.yellow} stroke={ink} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

export function QuestionIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9.5} fill="#7FD6C8" stroke={ink} strokeWidth={2} />
      <Path d="M9 9.5 a3 3 0 1 1 4.5 2.6 c-1 .6 -1.5 1 -1.5 2.2" fill="none" stroke={ink} strokeWidth={2} strokeLinecap="round" />
      <Circle cx={12} cy={17.2} r={1.2} fill={ink} />
    </Svg>
  );
}

export function EyeOffIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28">
      <Path d="M3 14 C7 8 11 6 14 6 C17 6 21 8 25 14 C21 20 17 22 14 22 C11 22 7 20 3 14 Z" fill="none" stroke={colors.white} strokeWidth={2.5} strokeLinejoin="round" />
      <Circle cx={14} cy={14} r={3.5} fill={colors.white} />
      <Path d="M5 24 L23 4" stroke={colors.yellow} strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}

export function SpeechIcon({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Path d="M5 8 H35 a3 3 0 0 1 3 3 V25 a3 3 0 0 1 -3 3 H20 L11 35 V28 H5 a3 3 0 0 1 -3 -3 V11 a3 3 0 0 1 3 -3 Z" fill={colors.white} stroke={ink} strokeWidth={2.5} strokeLinejoin="round" />
      <Circle cx={12} cy={18} r={2} fill={ink} />
      <Circle cx={20} cy={18} r={2} fill={ink} />
      <Circle cx={28} cy={18} r={2} fill={ink} />
    </Svg>
  );
}

export function MaskIcon({ width = 130 }: { width?: number }) {
  const h = (width * 78) / 130;
  return (
    <Svg width={width} height={h} viewBox="0 0 130 78">
      <Path d="M6 22 C30 6 54 14 65 24 C76 14 100 6 124 22 C128 44 114 70 90 70 C76 70 70 56 65 56 C60 56 54 70 40 70 C16 70 2 44 6 22 Z" fill={colors.pink} />
      <Ellipse cx={38} cy={38} rx={15} ry={11} fill={colors.nightCard} />
      <Ellipse cx={92} cy={38} rx={15} ry={11} fill={colors.nightCard} />
      <Circle cx={42} cy={36} r={4} fill={colors.white} />
      <Circle cx={96} cy={36} r={4} fill={colors.white} />
    </Svg>
  );
}

/** Fialový maskot z úvodnej obrazovky. */
export function Mascot({ size = 250 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 240 240">
      <Ellipse cx={120} cy={222} rx={72} ry={10} fill={ink} opacity={0.12} />
      <Path d="M40 130 C40 60 90 28 120 28 C150 28 200 60 200 130 C200 190 170 214 120 214 C70 214 40 190 40 130 Z" fill={colors.purple} />
      <Ellipse cx={98} cy={62} rx={26} ry={12} fill={colors.white} opacity={0.2} rotation={-20} origin="98, 62" />
      <Circle cx={92} cy={120} r={25} fill={colors.white} />
      <Circle cx={152} cy={120} r={25} fill={colors.white} />
      <Circle cx={101} cy={122} r={12} fill={ink} />
      <Circle cx={161} cy={122} r={12} fill={ink} />
      <Circle cx={105} cy={117} r={4} fill={colors.white} />
      <Circle cx={165} cy={117} r={4} fill={colors.white} />
      <Path d="M68 88 L112 94" stroke={ink} strokeWidth={6} strokeLinecap="round" />
      <Path d="M132 80 L176 68" stroke={ink} strokeWidth={6} strokeLinecap="round" />
      <Path d="M94 166 Q124 188 158 158" stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" />
      <SvgText x={188} y={54} fontSize={46} fontWeight="700" fill={colors.yellow} rotation={14} origin="188, 54">?</SvgText>
      <SvgText x={22} y={84} fontSize={38} fontWeight="700" fill={colors.coral} rotation={-16} origin="22, 84">?</SvgText>
    </Svg>
  );
}

export function Confetti({ width = 390 }: { width?: number }) {
  return (
    <Svg width={width} height={200} viewBox="0 0 390 200">
      <Rect x={26} y={40} width={14} height={14} rx={3} fill={colors.coral} rotation={20} origin="33, 47" />
      <Rect x={320} y={30} width={14} height={14} rx={3} fill={colors.teal} rotation={-25} origin="327, 37" />
      <Circle cx={70} cy={110} r={7} fill={colors.yellow} />
      <Circle cx={330} cy={120} r={8} fill={colors.pink} />
      <Path d="M356 70 l10 18 l-20 0 z" fill={colors.purple} />
      <Path d="M24 150 l10 18 l-20 0 z" fill={colors.teal} />
      <Rect x={290} y={170} width={12} height={12} rx={3} fill={colors.yellow} rotation={30} origin="296, 176" />
      <Circle cx={110} cy={30} r={6} fill={colors.blue} />
    </Svg>
  );
}
