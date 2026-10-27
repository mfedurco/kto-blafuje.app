import { useRouter } from 'expo-router';
import { Redirect } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Vibration, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { BigButton, IconButton } from '@/components/Button';
import { ArrowRight, CloseIcon, Face, PauseIcon, PlayIcon, SpeechIcon } from '@/components/Icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/T';
import { sk } from '@/constants/sk';
import { colors } from '@/constants/theme';
import { useExitGuard } from '@/lib/useExitGuard';
import { useGame } from '@/store/useGame';

const TOTAL_SECONDS = 90;
const RING = 190;
const RADIUS = 80;
const CIRC = 2 * Math.PI * RADIUS;

function format(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export default function Round() {
  const router = useRouter();
  const game = useGame((s) => s.game);
  const confirmExit = useExitGuard();
  const [left, setLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);
  const leftRef = useRef(TOTAL_SECONDS);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      leftRef.current = Math.max(0, leftRef.current - 1);
      setLeft(leftRef.current);
      if (leftRef.current === 0) {
        setRunning(false);
        Vibration.vibrate(500);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  if (!game) return <Redirect href="/" />;

  const alive = game.players.filter((p) => !p.out);
  const startIdx = Math.max(0, alive.findIndex((p) => p.id === game.starterId));
  const order = [...alive.slice(startIdx), ...alive.slice(0, startIdx)];
  const starter = order[0];

  const finished = left === 0;
  const progress = left / TOTAL_SECONDS;

  const toggle = () => {
    if (finished) {
      leftRef.current = TOTAL_SECONDS;
      setLeft(TOTAL_SECONDS);
      setRunning(true);
      return;
    }
    setRunning((r) => !r);
  };

  const reset = () => {
    setRunning(false);
    leftRef.current = TOTAL_SECONDS;
    setLeft(TOTAL_SECONDS);
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
        <T size={24} w="bold">
          {sk.round.roundN(game.round)}
        </T>
        <IconButton label={sk.exit.title} onPress={confirmExit} size={48} radius={24}>
          <CloseIcon />
        </IconButton>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 10, backgroundColor: colors.yellow, borderRadius: 28, paddingVertical: 14, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <SpeechIcon />
          <T size={24} w="semi" lh={29} style={{ flex: 1 }}>
            {sk.round.tip}
          </T>
        </View>

        <View style={{ marginTop: 14, backgroundColor: colors.purple, borderRadius: 32, paddingVertical: 14, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', gap: 18 }}>
          <Face size={84} color={starter.color} ring />
          <View style={{ flex: 1 }}>
            <T size={24} w="medium" color={colors.white} lh={28}>
              {sk.round.starts}
            </T>
            <T size={56} w="bold" color={colors.white} lh={62} numberOfLines={1} adjustsFontSizeToFit>
              {starter.name}
            </T>
          </View>
        </View>

        <View style={{ alignItems: 'center', marginTop: 14 }}>
          <View style={{ width: RING, height: RING }}>
            <Svg width={RING} height={RING} viewBox={`0 0 ${RING} ${RING}`}>
              <Circle cx={RING / 2} cy={RING / 2} r={RADIUS} fill={colors.white} stroke={colors.border} strokeWidth={16} />
              <Circle
                cx={RING / 2}
                cy={RING / 2}
                r={RADIUS}
                fill="none"
                stroke={finished ? colors.pink : colors.teal}
                strokeWidth={16}
                strokeLinecap="round"
                strokeDasharray={`${Math.max(0.001, progress * CIRC)} ${CIRC}`}
                rotation={-90}
                origin={`${RING / 2}, ${RING / 2}`}
              />
            </Svg>
            <View style={{ position: 'absolute', left: 0, top: 0, width: RING, height: RING, alignItems: 'center', justifyContent: 'center' }} accessibilityLiveRegion="polite">
              <T size={56} w="bold" lh={60}>
                {format(left)}
              </T>
              <T size={18} w="medium" lh={22}>
                {sk.round.remaining}
              </T>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12, width: '100%' }}>
            <View style={{ flex: 2 }}>
              <BigButton
                label={running ? sk.round.pause : sk.round.start}
                onPress={toggle}
                variant="white"
                height={60}
                fontSize={26}
                radius={24}
                icon={running ? <PauseIcon /> : <PlayIcon size={26} color={colors.ink} />}
              />
            </View>
            <View style={{ flex: 1 }}>
              <BigButton label={sk.round.reset} onPress={reset} variant="white" height={60} fontSize={22} radius={24} />
            </View>
          </View>
        </View>

        <T size={22} w="semi" lh={26} style={{ marginTop: 14 }}>
          {sk.round.order}
        </T>
        <View style={{ marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {order.map((p, i) => (
            <View
              key={p.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                height: 48,
                paddingLeft: 6,
                paddingRight: 16,
                borderRadius: 24,
                backgroundColor: i === 0 ? colors.purple : colors.white,
                borderWidth: i === 0 ? 0 : 3,
                borderColor: colors.border,
              }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: p.color, alignItems: 'center', justifyContent: 'center' }}>
                <T size={20} w="bold" lh={24}>
                  {i + 1}
                </T>
              </View>
              <T size={22} w={i === 0 ? 'bold' : 'semi'} color={i === 0 ? colors.white : colors.ink} lh={26}>
                {p.name}
              </T>
            </View>
          ))}
        </View>
      </ScrollView>

      <BigButton label={sk.round.vote} onPress={() => router.replace('/vote')} iconAfter={<ArrowRight />} />
    </Screen>
  );
}
