import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';

import { BigButton, ChoiceButton, IconButton } from '@/components/Button';
import { ArrowRight, DiceIcon, Face } from '@/components/Icons';
import { Screen, StepHeader } from '@/components/Screen';
import { T } from '@/components/T';
import { sk } from '@/constants/sk';
import { avatarColors, colors, font } from '@/constants/theme';
import { MAX_PLAYERS, MIN_PLAYERS } from '@/lib/game';
import { useGame } from '@/store/useGame';

const COUNTS = Array.from({ length: MAX_PLAYERS - MIN_PLAYERS + 1 }, (_, i) => MIN_PLAYERS + i);

export default function Players() {
  const router = useRouter();
  const { quick } = useLocalSearchParams<{ quick?: string }>();
  const startGame = useGame((s) => s.startGame);
  const playerCount = useGame((s) => s.playerCount);
  const names = useGame((s) => s.names);
  const setPlayerCount = useGame((s) => s.setPlayerCount);
  const setName = useGame((s) => s.setName);
  const randomName = useGame((s) => s.randomName);
  const [focused, setFocused] = useState<number | null>(null);

  const rows = [COUNTS.slice(0, 4), COUNTS.slice(4)];

  return (
    <Screen>
      <StepHeader onBack={() => router.back()} step={1} label={sk.players.stepLabel} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 12 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <T size={44} w="bold" lh={50} style={{ marginTop: 14 }}>
            {sk.players.title}
          </T>

          <T size={22} w="semi" lh={26} style={{ marginTop: 14 }}>
            {sk.players.howMany}
          </T>
          <View style={{ marginTop: 8, gap: 10 }}>
            {rows.map((row, ri) => (
              <View key={ri} style={{ flexDirection: 'row', gap: 10 }}>
                {row.map((n) => (
                  <ChoiceButton key={n} label={String(n)} selected={n === playerCount} onPress={() => setPlayerCount(n)} height={68} fontSize={36} />
                ))}
              </View>
            ))}
          </View>

          <T size={22} w="semi" lh={26} style={{ marginTop: 16 }}>
            {sk.players.names}
          </T>
          <View style={{ marginTop: 8, gap: 10 }}>
            {Array.from({ length: playerCount }, (_, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Face size={56} color={avatarColors[i % avatarColors.length]} />
                <TextInput
                  value={names[i]}
                  onChangeText={(text) => setName(i, text)}
                  onFocus={() => setFocused(i)}
                  onBlur={() => setFocused((f) => (f === i ? null : f))}
                  placeholder={sk.players.placeholder(i + 1)}
                  placeholderTextColor="#6B6490"
                  maxLength={12}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType={i === playerCount - 1 ? 'done' : 'next'}
                  accessibilityLabel={sk.players.placeholder(i + 1)}
                  selectionColor={colors.purple}
                  style={{
                    flex: 1,
                    height: 56,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: focused === i ? colors.purple : colors.border,
                    backgroundColor: colors.white,
                    paddingHorizontal: 18,
                    paddingVertical: 0,
                    fontFamily: font.semi,
                    fontSize: 26,
                    color: colors.ink,
                  }}
                />
                <IconButton label={sk.players.randomName} onPress={() => randomName(i)}>
                  <DiceIcon />
                </IconButton>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BigButton
        label={quick === '1' ? sk.categories.start : sk.common.next}
        onPress={() => {
          // Rýchla voľba balíka: kategórie sa preskočia, hra sa spustí hneď.
          if (quick === '1') {
            if (startGame()) router.replace('/reveal');
            return;
          }
          router.push('/categories');
        }}
        iconAfter={<ArrowRight />}
      />
    </Screen>
  );
}
