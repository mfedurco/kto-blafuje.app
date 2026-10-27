import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View, useWindowDimensions } from 'react-native';

import { AdSlot } from '@/components/AdSlot';
import { BigButton } from '@/components/Button';
import { Confetti, Face } from '@/components/Icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/T';
import { sk } from '@/constants/sk';
import { colors, font } from '@/constants/theme';
import { fitSize } from '@/lib/fit';
import { useExitGuard } from '@/lib/useExitGuard';
import { useGame } from '@/store/useGame';

export default function Result() {
  const router = useRouter();
  const { width: screenW } = useWindowDimensions();
  const game = useGame((s) => s.game);
  const guessWord = useGame((s) => s.guessWord);
  const resolveGuess = useGame((s) => s.resolveGuess);
  const nextRound = useGame((s) => s.nextRound);
  const startFromLast = useGame((s) => s.startFromLast);
  const clearGame = useGame((s) => s.clearGame);
  const [text, setText] = useState('');
  useExitGuard();

  if (!game) return <Redirect href="/" />;
  const elim = game.elimination;
  if (!elim) return null;
  const player = game.players.find((p) => p.id === elim.playerId);
  if (!player) return <Redirect href="/round" />;

  const pending = elim.guess === 'pending';
  const outcome = elim.outcome;
  const won = outcome === 'innocentsWin' || outcome === 'impostorsWin';

  const header = (
    <View style={{ alignItems: 'center', marginTop: 8 }}>
      <Face size={112} color={player.color} ring />
      <T size={36} w="bold" lh={42} style={{ marginTop: 10 }}>
        {sk.result.was(player.name)}
      </T>
      <View
        style={{
          marginTop: 2,
          backgroundColor: elim.wasImpostor ? colors.pinkSoft : colors.mint,
          borderRadius: 20,
          paddingHorizontal: 22,
          paddingVertical: 2,
          transform: [{ rotate: '-2deg' }],
          maxWidth: '100%',
        }}
      >
        <T size={44} w="bold" lh={54} numberOfLines={1} adjustsFontSizeToFit>
          {elim.wasImpostor ? sk.result.impostor : sk.result.innocent}
        </T>
      </View>
    </View>
  );

  const playAgain = () => {
    if (startFromLast()) router.replace('/reveal');
  };
  const goHome = () => {
    clearGame();
    router.dismissTo('/');
  };
  const continueRound = () => {
    nextRound();
    router.replace('/round');
  };

  const submitText = () => {
    if (text.trim()) guessWord(text);
  };

  return (
    <Screen>
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <Confetti />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 12 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {header}

          {pending ? (
            <View style={{ marginTop: 20, backgroundColor: colors.white, borderWidth: 4, borderColor: colors.ink, borderRadius: 36, padding: 18, alignItems: 'center' }}>
              <T size={30} w="bold" lh={36} center>
                {sk.result.chanceTitle}
              </T>
              <View style={{ marginTop: 8, backgroundColor: colors.yellowSoft, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 4 }}>
                <T size={20} w="semi" lh={26} center>
                  {player.hint ? sk.result.hintWas(player.hint) : sk.result.hintWasCategory(game.categoryName)}
                </T>
              </View>

                <View style={{ marginTop: 16, width: '100%', gap: 12 }}>
                  <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder={sk.result.guessPlaceholder}
                    placeholderTextColor="#6B6490"
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={submitText}
                    accessibilityLabel={sk.result.guessPlaceholder}
                    selectionColor={colors.purple}
                    style={{
                      height: 68,
                      borderRadius: 24,
                      borderWidth: 3,
                      borderColor: colors.border,
                      backgroundColor: colors.white,
                      paddingHorizontal: 18,
                      paddingVertical: 0,
                      fontFamily: font.bold,
                      fontSize: 30,
                      color: colors.ink,
                      textAlign: 'center',
                    }}
                  />
                  <BigButton label={sk.result.guessSubmit} onPress={submitText} disabled={!text.trim()} height={68} fontSize={30} radius={24} />
                  <BigButton label={sk.result.guessSkip} onPress={() => resolveGuess(false, true)} variant="white" height={56} fontSize={22} radius={22} />
                </View>
            </View>
          ) : (
            <View style={{ marginTop: 20, gap: 14 }}>
              {elim.wasImpostor && elim.guess !== 'skipped' ? (
                <View style={{ alignItems: 'center' }}>
                  <T size={26} w="semi" lh={32} center>
                    {elim.guess === 'right' ? sk.result.guessedRight(player.name) : sk.result.guessedWrong(player.name)}
                  </T>
                </View>
              ) : null}

              {won ? (
                <>
                  <View
                    style={{
                      backgroundColor: outcome === 'innocentsWin' ? colors.teal : colors.purple,
                      borderRadius: 32,
                      paddingVertical: 18,
                      paddingHorizontal: 16,
                      alignItems: 'center',
                    }}
                  >
                    <T size={38} w="bold" color={colors.white} lh={44} center numberOfLines={1} adjustsFontSizeToFit>
                      {outcome === 'innocentsWin' ? sk.result.innocentsWin : sk.result.impostorsWin}
                    </T>
                  </View>

                  <View style={{ backgroundColor: colors.white, borderWidth: 3, borderColor: colors.border, borderRadius: 28, padding: 16, alignItems: 'center' }}>
                    <T size={20} w="medium" lh={24}>
                      {sk.result.secretWordWas}
                    </T>
                    <T size={fitSize(game.word, screenW - 40 - 38, 46, 22)} w="bold" lh={52} center numberOfLines={2} adjustsFontSizeToFit>
                      {game.word}
                    </T>
                  </View>

                  <T size={22} w="semi" lh={26}>
                    {sk.result.whoWasWho}
                  </T>
                  <View style={{ gap: 8 }}>
                    {game.players.map((p) => (
                      <View
                        key={p.id}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 12,
                          backgroundColor: p.role === 'impostor' ? colors.pinkBg : colors.white,
                          borderWidth: 3,
                          borderColor: p.role === 'impostor' ? colors.pink : colors.border,
                          borderRadius: 24,
                          padding: 8,
                        }}
                      >
                        <Face size={44} color={p.color} />
                        <View style={{ flex: 1 }}>
                          <T size={22} w="bold" lh={26} numberOfLines={1}>
                            {p.name}
                          </T>
                          {p.role === 'impostor' ? (
                            <T size={16} w="medium" lh={20} numberOfLines={1}>
                              {p.hint ? sk.result.impostorHint(p.hint) : game.categoryName}
                            </T>
                          ) : null}
                        </View>
                        {p.role === 'impostor' ? (
                          <View style={{ backgroundColor: colors.pinkSoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 2 }}>
                            <T size={16} w="bold" lh={22}>
                              {sk.result.impostor}
                            </T>
                          </View>
                        ) : null}
                      </View>
                    ))}
                  </View>
                  <AdSlot marginTop={12} />
                </>
              ) : (
                <View style={{ backgroundColor: colors.white, borderWidth: 3, borderColor: colors.border, borderRadius: 28, padding: 18, alignItems: 'center' }}>
                  <T size={30} w="bold" lh={36} center>
                    {sk.result.stillImpostors}
                  </T>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {pending ? (
        <T size={22} w="medium" lh={28} center style={{ marginTop: 6 }}>
          {sk.result.ifRightWin}
        </T>
      ) : won ? (
        <View style={{ gap: 12 }}>
          <BigButton label={sk.result.playAgain} onPress={playAgain} variant="yellow" height={72} fontSize={32} />
          <BigButton label={sk.result.home} onPress={goHome} variant="white" height={64} fontSize={26} radius={24} />
        </View>
      ) : (
        <BigButton label={sk.result.continueRound} onPress={continueRound} height={72} fontSize={28} />
      )}
    </Screen>
  );
}
