import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BigButton, IconButton } from '@/components/Button';
import { CloseIcon, Face } from '@/components/Icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/T';
import { sk } from '@/constants/sk';
import { colors } from '@/constants/theme';
import { useExitGuard } from '@/lib/useExitGuard';
import { useGame } from '@/store/useGame';

export default function Vote() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const game = useGame((s) => s.game);
  const eliminate = useGame((s) => s.eliminate);
  const confirmExit = useExitGuard();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (!game) return <Redirect href="/" />;

  const alive = game.players.filter((p) => !p.out);
  const selected = alive.find((p) => p.id === selectedId) ?? null;
  const tileWidth = (width - 40 - 12) / 2;

  const confirm = () => {
    if (!selected) return;
    eliminate(selected.id);
    setSelectedId(null);
    router.replace('/result');
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
        <View />
        <IconButton label={sk.exit.title} onPress={confirmExit} size={48} radius={24}>
          <CloseIcon />
        </IconButton>
      </View>

      <T size={42} w="bold" lh={48} style={{ marginTop: 4 }}>
        {sk.vote.title}
      </T>
      <T size={22} w="medium" lh={28} style={{ marginTop: 4 }}>
        {sk.vote.subtitle}
      </T>

      <ScrollView style={{ flex: 1, marginTop: 14 }} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {alive.map((p) => {
            const isSel = p.id === selectedId;
            return (
              <Pressable
                key={p.id}
                onPress={() => setSelectedId(p.id)}
                accessibilityRole="button"
                accessibilityLabel={p.name}
                accessibilityState={{ selected: isSel }}
                style={({ pressed }) => ({
                  width: tileWidth,
                  height: 120,
                  borderRadius: 28,
                  borderWidth: 4,
                  borderColor: isSel ? colors.pink : colors.border,
                  backgroundColor: isSel ? colors.pinkBg : colors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                })}
              >
                <Face size={56} color={p.color} />
                <T size={26} w="bold" lh={30} numberOfLines={1} adjustsFontSizeToFit style={{ maxWidth: tileWidth - 24 }}>
                  {p.name}
                </T>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={selected !== null} transparent animationType="slide" onRequestClose={() => setSelectedId(null)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(42,33,80,0.6)' }}>
          <View style={{ backgroundColor: colors.white, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 14, paddingHorizontal: 24, paddingBottom: insets.bottom + 24, alignItems: 'center' }}>
            <View style={{ width: 56, height: 6, borderRadius: 3, backgroundColor: colors.borderDark }} />
            {selected ? (
              <>
                <View style={{ marginTop: 16 }}>
                  <Face size={84} color={selected.color} />
                </View>
                <T size={32} w="bold" lh={38} center style={{ marginTop: 12 }}>
                  {sk.vote.confirm(selected.name)}
                </T>
              </>
            ) : null}
            <View style={{ marginTop: 20, width: '100%', flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <BigButton label={sk.common.no} onPress={() => setSelectedId(null)} variant="white" height={72} fontSize={32} radius={24} />
              </View>
              <View style={{ flex: 1 }}>
                <BigButton label={sk.common.yes} onPress={confirm} height={72} fontSize={32} radius={24} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
