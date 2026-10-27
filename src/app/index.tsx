import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';

import { BigButton } from '@/components/Button';
import { Blob, Screen } from '@/components/Screen';
import { Face, Mascot, PencilIcon, PlayIcon, QuestionIcon } from '@/components/Icons';
import { T } from '@/components/T';
import { sk } from '@/constants/sk';
import { avatarColors, colors } from '@/constants/theme';
import { useGame } from '@/store/useGame';

export default function Home() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const lastParty = useGame((s) => s.lastParty);
  const startFromLast = useGame((s) => s.startFromLast);
  const [rulesOpen, setRulesOpen] = useState(false);

  const mascotSize = Math.max(150, Math.min(250, height * 0.29));

  const playSame = () => {
    if (startFromLast()) router.push('/reveal');
  };

  return (
    <Screen>
      <Blob size={200} color={colors.yellow} opacity={0.55} style={{ top: -70, left: -60 }} />
      <Blob size={160} color="#7FD6C8" opacity={0.6} style={{ top: 210, right: -80 }} />
      <Blob size={190} color={colors.pinkSoft} opacity={0.6} style={{ bottom: -90, left: -60 }} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }} showsVerticalScrollIndicator={false}>
        <Mascot size={mascotSize} />
        <T size={60} w="bold" lh={64} style={{ marginTop: 2 }}>
          {sk.appName}
        </T>
        <View
          style={{
            marginTop: 10,
            backgroundColor: colors.purple,
            borderRadius: 999,
            paddingHorizontal: 24,
            paddingVertical: 6,
            transform: [{ rotate: '-3deg' }],
          }}
        >
          <T size={26} w="bold" color={colors.white} style={{ letterSpacing: 2 }}>
            {sk.appTag}
          </T>
        </View>

        <View style={{ width: '100%', marginTop: 34 }}>
          <BigButton
            label={sk.home.play}
            onPress={() => router.push('/players')}
            height={92}
            fontSize={42}
            radius={32}
            icon={<PlayIcon />}
          />
        </View>

        {lastParty ? (
          <Pressable
            onPress={playSame}
            accessibilityRole="button"
            accessibilityLabel={sk.home.samePartyTitle}
            style={{ width: '100%', marginTop: 16 }}
          >
            {({ pressed }) => (
              <View style={{ backgroundColor: colors.yellowDark, borderRadius: 28, paddingBottom: pressed ? 2 : 6, marginTop: pressed ? 4 : 0 }}>
                <View style={{ height: 80, borderRadius: 28, backgroundColor: colors.yellow, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 16 }}>
                  <View style={{ flexDirection: 'row' }}>
                    {lastParty.names.slice(0, 3).map((n, i) => (
                      <View key={`${n}-${i}`} style={{ marginLeft: i === 0 ? 0 : -12, borderRadius: 20, borderWidth: 3, borderColor: colors.yellow }}>
                        <Face size={38} color={avatarColors[(i * 2 + 1) % avatarColors.length]} />
                      </View>
                    ))}
                  </View>
                  <View style={{ flexShrink: 1 }}>
                    <T size={24} w="bold" lh={28}>
                      {sk.home.samePartyTitle}
                    </T>
                    <T size={17} w="medium" lh={20} numberOfLines={1}>
                      {sk.home.samePartyMore(lastParty.names.slice(0, 3).join(', '), lastParty.names.length - 3)}
                    </T>
                  </View>
                </View>
              </View>
            )}
          </Pressable>
        ) : null}

        <View style={{ width: '100%', marginTop: 16, flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <BigButton
              label={sk.home.customWords}
              onPress={() => router.push('/custom')}
              variant="white"
              height={64}
              fontSize={20}
              radius={24}
              icon={<PencilIcon />}
            />
          </View>
          <View style={{ flex: 1 }}>
            <BigButton
              label={sk.home.rules}
              onPress={() => setRulesOpen(true)}
              variant="white"
              height={64}
              fontSize={20}
              radius={24}
              icon={<QuestionIcon />}
            />
          </View>
        </View>

        <View style={{ flex: 1, minHeight: 16 }} />
        <T size={17} w="medium" center style={{ marginTop: 12 }}>
          {sk.home.footer}
        </T>
      </ScrollView>

      <Modal visible={rulesOpen} transparent animationType="slide" onRequestClose={() => setRulesOpen(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(42,33,80,0.6)' }}>
          <View style={{ maxHeight: '88%', backgroundColor: colors.white, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 24, paddingBottom: 28 }}>
            <T size={36} w="bold" lh={42}>
              {sk.rules.title}
            </T>
            <ScrollView style={{ marginTop: 12 }} showsVerticalScrollIndicator={false}>
              {sk.rules.items.map((item, i) => (
                <View key={item} style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' }}>
                    <T size={20} w="bold">
                      {i + 1}
                    </T>
                  </View>
                  <T size={21} w="medium" lh={27} style={{ flex: 1 }}>
                    {item}
                  </T>
                </View>
              ))}
            </ScrollView>
            <View style={{ marginTop: 8 }}>
              <BigButton label={sk.common.close} onPress={() => setRulesOpen(false)} height={64} fontSize={28} />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
