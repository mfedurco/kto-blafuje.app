export const colors = {
  cream: '#FFF3D1',
  ink: '#2A2150',
  white: '#FFFFFF',
  purple: '#5B3FD6',
  purpleDark: '#3B27A0',
  purpleMid: '#7B5CFA',
  purpleDeep: '#4B2FC0',
  purpleSoft: '#9A84F0',
  purpleTint: '#E6DFFF',
  yellow: '#FFC93C',
  yellowDark: '#D69E00',
  yellowSoft: '#FFF0A8',
  coral: '#FF7A59',
  teal: '#11A38F',
  tealDark: '#0B7C6C',
  pink: '#FF5C8A',
  pinkSoft: '#FFB3C8',
  pinkBg: '#FFE0E9',
  pinkLight: '#FF8FB0',
  pinkLightDark: '#C85A80',
  blue: '#9CC4FF',
  mint: '#CFEFE8',
  mintDark: '#8FCFC3',
  border: '#E4D9B5',
  borderDark: '#D9CB9A',
  night: '#231634',
  nightCard: '#2F1F47',
  nightSoft: '#3A2759',
  nightLine: '#6A4F96',
} as const;

/** Farby avatarov pre až 10 hráčov. */
export const avatarColors = [
  '#FF7A59',
  '#11A38F',
  '#FFC93C',
  '#FFB3C8',
  '#9CC4FF',
  '#7FD6C8',
  '#B9A8FF',
  '#FFB066',
  '#A8E06C',
  '#FF9EC4',
];

export const font = {
  regular: 'Baloo2_400Regular',
  medium: 'Baloo2_500Medium',
  semi: 'Baloo2_600SemiBold',
  bold: 'Baloo2_700Bold',
} as const;

export type Weight = keyof typeof font;
