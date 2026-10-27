import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'fade',
        contentStyle: { backgroundColor: colors.cream },
      }}
    />
  );
}
