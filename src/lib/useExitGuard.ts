import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, BackHandler } from 'react-native';

import { sk } from '@/constants/sk';
import { useGame } from '@/store/useGame';

/**
 * Počas hry nesmie tlačidlo späť omylom vyhodiť hráčov z rozohratej hry.
 * Namiesto toho sa opýta, či ju chcú ukončiť. Vráti funkciu na ručné ukončenie.
 */
export function useExitGuard(): () => void {
  const router = useRouter();
  const clearGame = useGame((s) => s.clearGame);

  const confirmExit = useCallback(() => {
    Alert.alert(sk.exit.title, sk.exit.message, [
      { text: sk.exit.no, style: 'cancel' },
      {
        text: sk.exit.yes,
        style: 'destructive',
        onPress: () => {
          clearGame();
          router.dismissTo('/');
        },
      },
    ]);
  }, [clearGame, router]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        confirmExit();
        return true;
      });
      return () => sub.remove();
    }, [confirmExit]),
  );

  return confirmExit;
}
