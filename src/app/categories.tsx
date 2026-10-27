import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Switch, View, useWindowDimensions } from 'react-native';

import { BigButton, ChoiceButton } from '@/components/Button';
import { CategoryIcon, CheckBadge, PlayIcon } from '@/components/Icons';
import { Screen, StepHeader } from '@/components/Screen';
import { T } from '@/components/T';
import { sk } from '@/constants/sk';
import { colors } from '@/constants/theme';
import { maxImpostors } from '@/lib/game';
import { allCategories, useGame } from '@/store/useGame';

export default function Categories() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const playerCount = useGame((s) => s.playerCount);
  const impostorCount = useGame((s) => s.impostorCount);
  const categoryIds = useGame((s) => s.categoryIds);
  const customCategories = useGame((s) => s.customCategories);
  const packs = useGame((s) => s.packs);
  const toggleCategory = useGame((s) => s.toggleCategory);
  const setCategories = useGame((s) => s.setCategories);
  const setImpostorCount = useGame((s) => s.setImpostorCount);
  const startGame = useGame((s) => s.startGame);

  const categories = allCategories(customCategories, packs);
  const playable = categories.filter((c) => c.words.length > 0);
  const selectedPlayable = playable.filter((c) => categoryIds.includes(c.id));
  const tileWidth = (width - 40 - 12) / 2;
  const canTwo = maxImpostors(playerCount) >= 2;

  const start = () => {
    if (startGame()) router.replace('/reveal');
  };

  return (
    <Screen>
      <StepHeader onBack={() => router.back()} step={2} label={sk.categories.stepLabel} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
        <T size={40} w="bold" lh={46} style={{ marginTop: 14 }}>
          {sk.categories.title}
        </T>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <Pressable
            onPress={() => setCategories(playable.map((c) => c.id))}
            accessibilityRole="button"
            style={{ minHeight: 48, justifyContent: 'center', paddingHorizontal: 20, borderRadius: 24, backgroundColor: colors.white, borderWidth: 3, borderColor: colors.border }}
          >
            <T size={20} w="semi">
              {sk.categories.all}
            </T>
          </Pressable>
          <Pressable
            onPress={() => setCategories([])}
            accessibilityRole="button"
            style={{ minHeight: 48, justifyContent: 'center', paddingHorizontal: 20, borderRadius: 24, backgroundColor: colors.white, borderWidth: 3, borderColor: colors.border }}
          >
            <T size={20} w="semi">
              {sk.categories.none}
            </T>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 14 }}>
          {playable.map((c) => {
            const selected = categoryIds.includes(c.id);
            return (
              <Pressable
                key={c.id}
                onPress={() => toggleCategory(c.id)}
                accessibilityRole="button"
                accessibilityLabel={`${c.name}, ${sk.categories.words(c.words.length)}`}
                accessibilityState={{ selected }}
                style={({ pressed }) => ({
                  width: tileWidth,
                  height: 124,
                  borderRadius: 28,
                  borderWidth: 4,
                  borderColor: selected ? colors.purple : colors.border,
                  backgroundColor: selected ? c.color : colors.white,
                  padding: 12,
                  justifyContent: 'space-between',
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                })}
              >
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: selected ? colors.white : c.color, alignItems: 'center', justifyContent: 'center' }}>
                  {c.emoji ? (
                    <T size={30} lh={36}>
                      {c.emoji}
                    </T>
                  ) : (
                    <CategoryIcon name={c.icon} size={32} />
                  )}
                </View>
                <View>
                  <T size={24} w="bold" lh={26} numberOfLines={1} adjustsFontSizeToFit>
                    {c.name}
                  </T>
                  <T size={16} w="medium" lh={18}>
                    {sk.categories.words(c.words.length)}
                  </T>
                </View>
                {selected ? (
                  <View style={{ position: 'absolute', top: 8, right: 8 }}>
                    <CheckBadge size={30} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <T size={22} w="semi" lh={26} style={{ marginTop: 18 }}>
          {sk.categories.impostors}
        </T>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <ChoiceButton label={sk.categories.one} selected={impostorCount === 1} onPress={() => setImpostorCount(1)} fontSize={26} />
          <ChoiceButton
            label={sk.categories.two}
            selected={impostorCount === 2 && canTwo}
            onPress={() => canTwo && setImpostorCount(2)}
            fontSize={26}
            style={{ opacity: canTwo ? 1 : 0.4 }}
          />
        </View>
      </ScrollView>

      <BigButton
        label={selectedPlayable.length === 0 ? sk.categories.pickOne : sk.categories.start}
        onPress={start}
        variant="yellow"
        height={76}
        fontSize={selectedPlayable.length === 0 ? 24 : 34}
        disabled={selectedPlayable.length === 0}
        icon={selectedPlayable.length === 0 ? undefined : <PlayIcon size={30} color={colors.ink} />}
      />
    </Screen>
  );
}
