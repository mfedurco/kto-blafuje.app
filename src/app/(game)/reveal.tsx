import { Redirect, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BigButton } from '@/components/Button';
import { Blob, Screen } from '@/components/Screen';
import { CategoryIcon, ChevronsUp, EyeOffIcon, Face, MaskIcon } from '@/components/Icons';
import { SwipeReveal } from '@/components/SwipeReveal';
import { T } from '@/components/T';
import { sk } from '@/constants/sk';
import { colors } from '@/constants/theme';
import { CATEGORIES } from '@/data/words';
import { fitSize } from '@/lib/fit';
import { useExitGuard } from '@/lib/useExitGuard';
import { allCategories, useGame } from '@/store/useGame';

/** Tmavá malinová - na mätovom podklade dobre čitateľná, líši sa od tmavofialovej. */
const IMPOSTOR_TEXT = '#B3123F';

export default function Reveal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const game = useGame((s) => s.game);
  const customCategories = useGame((s) => s.customCategories);
  const packs = useGame((s) => s.packs);
  const advanceReveal = useGame((s) => s.advanceReveal);
  const [h, setH] = useState(0);
  const [seenFor, setSeenFor] = useState<number | null>(null);
  const handedOff = useRef<number | null>(null);
  useExitGuard();

  if (!game) return <Redirect href="/" />;
  if (game.revealIndex >= game.players.length) return null;

  const player = game.players[game.revealIndex];
  const next = game.players[game.revealIndex + 1];
  const isImpostor = player.role === 'impostor';
  const category = allCategories(customCategories, packs).find((c) => c.id === game.categoryId) ?? CATEGORIES[0];

  const openTop = Math.max(128, insets.top + 100);
  const sheetHeight = Math.max(0, h - openTop);
  const peekHeight = Math.min(360, Math.max(300, h * 0.4)) + insets.bottom;
  const small = h > 0 && h < 720;
  const avatar = small ? 110 : 150;

  const seen = seenFor === player.id;

  // Dlhé slová radšej zmenšíme, než by sa zalomili uprostred slova.
  const wordSize = fitSize(game.word, screenW - 40, small ? 80 : 96, 28);
  const hintText = player.hint ?? game.categoryName;
  const hintSize = fitSize(hintText, screenW - 40 - 24 - 6, 58, 24);

  // Farba obrazovky je pre všetkých rovnaká (odrazy v okuliaroch by inak prezradili rolu).
  // Líši sa iba farba písma.
  const textColor = isImpostor ? IMPOSTOR_TEXT : colors.ink;

  const handOff = () => {
    if (handedOff.current === player.id) return;
    handedOff.current = player.id;
    if (advanceReveal()) router.replace('/round');
  };

  const closedBehind = (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: insets.top + 28, paddingHorizontal: 28 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} accessibilityLabel={sk.reveal.playerOf(game.revealIndex + 1, game.players.length)}>
        {game.players.map((p, i) => (
          <View
            key={p.id}
            style={{
              width: i === game.revealIndex ? 34 : 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: i < game.revealIndex ? colors.white : i === game.revealIndex ? colors.yellow : colors.purpleSoft,
            }}
          />
        ))}
      </View>
      <View style={{ marginTop: small ? 18 : 34 }}>
        <Face size={avatar} color={player.color} ring />
      </View>
      <T size={30} w="medium" color={colors.white} style={{ marginTop: 18 }}>
        {sk.reveal.handOver}
      </T>
      <T size={small ? 64 : 80} w="bold" color={colors.white} lh={small ? 72 : 88} numberOfLines={1} adjustsFontSizeToFit style={{ width: '100%' }} center>
        {player.name}
      </T>
      <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.purpleDark, borderRadius: 999, paddingHorizontal: 22, paddingVertical: 10 }}>
        <EyeOffIcon />
        <T size={22} w="semi" color={colors.white} lh={28}>
          {sk.reveal.dontLook}
        </T>
      </View>
    </View>
  );

  const openBehind = (
    <View style={{ flex: 1 }}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.purple }]} />
      <View style={{ alignItems: 'center', paddingTop: insets.top + 12, paddingHorizontal: 28 }}>
        <T size={22} w="medium" color={colors.white} lh={28}>
          {sk.reveal.yourSecretWord}
        </T>
        <T size={48} w="bold" color={colors.white} lh={54} numberOfLines={1} adjustsFontSizeToFit style={{ width: '100%' }} center>
          {player.name}
        </T>
      </View>
    </View>
  );

  const peek = (
    <View style={{ height: peekHeight, alignItems: 'center', paddingTop: 14, paddingHorizontal: 20, paddingBottom: insets.bottom + 18 }} pointerEvents="box-none">
      <View style={{ width: 56, height: 6, borderRadius: 3, backgroundColor: colors.borderDark }} />
      {seen ? (
        <>
          <T size={22} w="medium" lh={28} center style={{ marginTop: 14 }}>
            {sk.reveal.again}
          </T>
          <View style={{ flex: 1, minHeight: 12 }} />
          <View style={{ width: '100%' }}>
            <BigButton
              label={next ? sk.reveal.nextPlayer(next.name) : sk.reveal.startGame}
              onPress={handOff}
              variant={next ? 'teal' : 'yellow'}
              height={84}
              fontSize={30}
              radius={30}
            />
          </View>
        </>
      ) : (
        <>
          <View style={{ marginTop: 22 }}>
            <ChevronsUp />
          </View>
          <T size={38} w="bold" lh={44} style={{ marginTop: 10 }}>
            {sk.reveal.swipeUp}
          </T>
          <T size={24} w="medium" lh={30} center>
            {sk.reveal.swipeUpSub}
          </T>
        </>
      )}
    </View>
  );

  const releaseHint = (
    <T size={22} w="semi" color={textColor} lh={28} center>
      {sk.reveal.releaseHint}
    </T>
  );

  const revealed = (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: 14, paddingHorizontal: 20, paddingBottom: insets.bottom + 22 }}>
      <View style={{ width: 56, height: 6, borderRadius: 3, backgroundColor: colors.mintDark }} />
      {isImpostor ? (
        <>
          <View style={{ marginTop: small ? 10 : 20 }}>
            <MaskIcon width={small ? 100 : 130} />
          </View>
          <T size={40} w="bold" color={textColor} lh={46} numberOfLines={1} adjustsFontSizeToFit style={{ marginTop: 10, width: '100%' }} center>
            {sk.reveal.youAreImpostor}
          </T>
          <T size={24} w="medium" color={textColor} lh={30} style={{ marginTop: small ? 10 : 22 }}>
            {player.hint ? sk.reveal.yourHint : sk.reveal.yourHintNone}
          </T>
          <View style={{ marginTop: 8, width: '100%', backgroundColor: colors.white, borderWidth: 3, borderColor: colors.mintDark, borderRadius: 28, paddingVertical: 20, paddingHorizontal: 12 }}>
            <T size={hintSize} w="bold" color={textColor} lh={Math.round(hintSize * 1.1)} center numberOfLines={2} adjustsFontSizeToFit>
              {hintText}
            </T>
          </View>
          <T size={24} w="medium" color={textColor} lh={30} center style={{ marginTop: 18 }}>
            {sk.reveal.impostorTip}
          </T>
        </>
      ) : (
        <>
          <View style={{ marginTop: small ? 10 : 22, width: small ? 84 : 112, height: small ? 84 : 112, borderRadius: 56, backgroundColor: category.color, borderWidth: 4, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
            <CategoryIcon name={category.icon} size={small ? 48 : 64} />
          </View>
          <View style={{ marginTop: 14, backgroundColor: category.color, borderRadius: 999, paddingHorizontal: 22, paddingVertical: 6 }}>
            <T size={24} w="semi" lh={30}>
              {game.categoryName}
            </T>
          </View>
          <T size={wordSize} w="bold" color={textColor} lh={Math.round(wordSize * 1.1)} center numberOfLines={2} adjustsFontSizeToFit style={{ marginTop: small ? 10 : 22, width: '100%' }}>
            {game.word}
          </T>
          <T size={24} w="medium" lh={30} center style={{ marginTop: 14 }}>
            {sk.reveal.rememberIt}
          </T>
        </>
      )}
      <View style={{ flex: 1, minHeight: 12 }} />
      {releaseHint}
    </View>
  );

  return (
    <Screen bg={colors.purple} dark bare>
      <Blob size={220} color={colors.purpleMid} style={{ top: -80, right: -70 }} />
      <Blob size={200} color={colors.purpleDeep} style={{ top: 300, left: -90 }} />
      <View style={{ flex: 1 }} onLayout={(e) => setH(e.nativeEvent.layout.height)}>
        {h > 0 ? (
          <SwipeReveal
            key={player.id}
            sheetHeight={sheetHeight}
            peekHeight={peekHeight}
            closedBehind={closedBehind}
            openBehind={openBehind}
            peek={peek}
            revealed={revealed}
            revealColor={colors.mint}
            edgeColor={colors.purpleDark}
            peekInteractive={seen}
            onRevealed={() => setSeenFor(player.id)}
          />
        ) : null}
      </View>
    </Screen>
  );
}
