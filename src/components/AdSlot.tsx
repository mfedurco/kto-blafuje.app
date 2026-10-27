import { View } from 'react-native';

import { ADS } from '@/config/ads';
import { colors } from '@/constants/theme';

import { T } from './T';

/**
 * Vyhradené miesto pre banner. Pri `ADS.mode === 'off'` nezobrazí nič (ani medzeru).
 * Umiestňuje sa len na úvodnú obrazovku a na koniec hry, nikdy do priebehu hry.
 */
export function AdSlot({ marginTop = 20 }: { marginTop?: number }) {
  if (ADS.mode === 'off') return null;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        marginTop,
        width: '100%',
        height: ADS.bannerHeight,
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: colors.borderDark,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <T size={16} w="medium" lh={20}>
        Priestor pre reklamu
      </T>
    </View>
  );
}
