import { useRouter } from 'expo-router';
import { Component, useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Image, Pressable, View } from 'react-native';

import { sk } from '@/constants/sk';
import { colors } from '@/constants/theme';
import { downloadPack, fetchManifest, pickLatest, type PackMeta } from '@/lib/packs';
import { useGame } from '@/store/useGame';

import { T } from './T';

/** Najnovší balík z internetu sa zisťuje raz za beh appky. Bez internetu sa banner jednoducho nezobrazí. */
let latestPromise: Promise<PackMeta | null> | null = null;
const loadLatest = () => {
  latestPromise ??= fetchManifest()
    .then((m) => pickLatest(m))
    .catch(() => {
      latestPromise = null;
      return null;
    });
  return latestPromise;
};

/** Banner nesmie nikdy zhodiť appku: pri chybe sa jednoducho nezobrazí. */
class Safe extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Banner na úvodnej obrazovke: nový tematický balík slov na stiahnutie. */
export function PackBanner() {
  return (
    <Safe>
      <PackBannerInner />
    </Safe>
  );
}

function PackBannerInner() {
  const router = useRouter();
  const packs = useGame((s) => s.packs);
  const installPack = useGame((s) => s.installPack);
  const setCategories = useGame((s) => s.setCategories);
  const [meta, setMeta] = useState<PackMeta | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  useEffect(() => {
    let alive = true;
    loadLatest().then((m) => alive && setMeta(m));
    return () => {
      alive = false;
    };
  }, []);

  if (!meta) return null;

  const installed = packs.find((p) => p?.id === `pack:${meta.id}`);
  const installedId = installed?.id ?? null;
  const upToDate = installed != null && (installed.version ?? 0) >= meta.version;

  const onPress = async () => {
    if (status === 'loading') return;
    setStatus('loading');
    try {
      installPack(await downloadPack(meta));
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };

  const playQuick = () => {
    if (!installedId) return;
    setCategories([installedId]);
    router.push({ pathname: '/players', params: { quick: '1' } });
  };

  const action = upToDate ? sk.packs.ready : installed ? sk.packs.update : sk.packs.download;

  // Po stiahnutí banner zmizne a ostane len rýchla voľba na hranie s týmto balíkom.
  if (upToDate) {
    return (
      <View style={{ width: '100%', marginTop: 16 }}>
        <Pressable
          onPress={playQuick}
          accessibilityRole="button"
          style={({ pressed }) => ({
            height: 64,
            borderRadius: 24,
            borderWidth: 3,
            borderColor: colors.ink,
            backgroundColor: meta.color,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingHorizontal: 14,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <T size={30} lh={36}>
            {meta.emoji}
          </T>
          <T size={22} w="bold" lh={26} numberOfLines={1} adjustsFontSizeToFit style={{ flexShrink: 1 }}>
            {sk.packs.playWith(meta.name)}
          </T>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ width: '100%', marginTop: 16 }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${meta.title}. ${action}`}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          borderRadius: 28,
          borderWidth: 3,
          borderColor: colors.ink,
          backgroundColor: meta.color,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <View style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {meta.imageUrl ? (
            <Image source={{ uri: meta.imageUrl }} style={{ width: 68, height: 68 }} resizeMode="cover" />
          ) : (
            <T size={38} lh={46}>
              {meta.emoji}
            </T>
          )}
        </View>
        <View style={{ flex: 1 }}>
          {!upToDate ? (
            <View style={{ alignSelf: 'flex-start', backgroundColor: colors.pink, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 0, marginBottom: 2 }}>
              <T size={14} w="bold" color={colors.white} lh={20}>
                {sk.packs.badge}
              </T>
            </View>
          ) : null}
          <T size={20} w="bold" lh={23} numberOfLines={2}>
            {meta.title}
          </T>
          <T size={15} w="medium" lh={18} numberOfLines={2}>
            {status === 'error' ? sk.packs.error : upToDate ? sk.packs.installedHint : meta.text}
          </T>
        </View>
        <View style={{ minWidth: 92, height: 48, borderRadius: 24, backgroundColor: upToDate ? colors.white : colors.teal, borderWidth: upToDate ? 3 : 0, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 }}>
          {status === 'loading' ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <T size={17} w="bold" color={upToDate ? colors.ink : colors.white} lh={22} numberOfLines={1}>
              {action}
            </T>
          )}
        </View>
      </Pressable>
    </View>
  );
}
