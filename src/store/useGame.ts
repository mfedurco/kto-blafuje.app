import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CATEGORIES, CUSTOM_COLOR, CUSTOM_ICON, RANDOM_NAMES, type Category } from '@/data/words';
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  createGame,
  evaluate,
  hintContainsWord,
  isRightGuess,
  maxImpostors,
  norm,
  pick,
  uniqueNames,
  type Game,
} from '@/lib/game';

type LastParty = {
  names: string[];
  categoryIds: string[];
  impostors: number;
};

type Persisted = {
  playerCount: number;
  /** Vždy MAX_PLAYERS položiek; prázdny reťazec = predvolené meno "Hráč N". */
  names: string[];
  impostorCount: number;
  categoryIds: string[];
  customCategories: Category[];
  /** Stiahnuté tematické balíky slov. */
  packs: Category[];
  usedKeys: string[];
  lastParty: LastParty | null;
};

type Actions = {
  setPlayerCount: (n: number) => void;
  setName: (index: number, name: string) => void;
  randomName: (index: number) => void;
  setImpostorCount: (n: number) => void;
  toggleCategory: (id: string) => void;
  setCategories: (ids: string[]) => void;

  /** Rozohrá novú hru z aktuálneho nastavenia. Vráti false, ak nie je vybraná žiadna kategória. */
  startGame: () => boolean;
  /** Nová hra s tými istými hráčmi a nastavením z poslednej hry. */
  startFromLast: () => boolean;
  /** Posunie rozdávanie kariet na ďalšieho hráča. Vráti true, ak už videli všetci. */
  advanceReveal: () => boolean;
  eliminate: (playerId: number) => void;
  resolveGuess: (correct: boolean) => void;
  guessWord: (input: string) => void;
  nextRound: () => void;
  clearGame: () => void;

  addCustomCategory: (name: string) => string | null;
  removeCustomCategory: (id: string) => void;
  addCustomWord: (categoryId: string, word: string, hint: string) => 'ok' | 'empty' | 'hintHasWord';
  removeCustomWord: (categoryId: string, word: string) => void;
  /** Uloží stiahnutý balík (alebo ho aktualizuje) a rovno ho vyberie do hry. */
  installPack: (pack: Category) => void;
  removePack: (id: string) => void;
};

type State = Persisted & Actions & { game: Game | null };

const emptyNames = () => Array.from({ length: MAX_PLAYERS }, () => '');

export const allCategories = (custom: Category[], packs: Category[] = []): Category[] => [...CATEGORIES, ...packs, ...custom];

export const useGame = create<State>()(
  persist(
    (set, get) => ({
      playerCount: 4,
      names: emptyNames(),
      impostorCount: 1,
      categoryIds: ['animals', 'food', 'fairytales', 'home'],
      customCategories: [],
      packs: [],
      usedKeys: [],
      lastParty: null,
      game: null,

      setPlayerCount: (n) => {
        const playerCount = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, n));
        set((s) => ({ playerCount, impostorCount: Math.min(s.impostorCount, maxImpostors(playerCount)) }));
      },
      setName: (index, name) =>
        set((s) => {
          const names = [...s.names];
          names[index] = name;
          return { names };
        }),
      randomName: (index) =>
        set((s) => {
          const taken = new Set(s.names.slice(0, s.playerCount).map(norm));
          const free = RANDOM_NAMES.filter((n) => !taken.has(norm(n)));
          const names = [...s.names];
          names[index] = pick(free.length > 0 ? free : RANDOM_NAMES);
          return { names };
        }),
      setImpostorCount: (n) => set((s) => ({ impostorCount: Math.max(1, Math.min(n, maxImpostors(s.playerCount))) })),
      toggleCategory: (id) =>
        set((s) => ({
          categoryIds: s.categoryIds.includes(id) ? s.categoryIds.filter((x) => x !== id) : [...s.categoryIds, id],
        })),
      setCategories: (ids) => set({ categoryIds: ids }),

      startGame: () => {
        const s = get();
        const selected = allCategories(s.customCategories, s.packs).filter(
          (c) => s.categoryIds.includes(c.id) && c.words.length > 0,
        );
        if (selected.length === 0) return false;
        const names = uniqueNames(s.names.slice(0, s.playerCount));
        const impostors = Math.min(s.impostorCount, maxImpostors(names.length));
        const { game, usedKeys } = createGame({ names, categories: selected, impostors, usedKeys: s.usedKeys });
        set({
          game,
          usedKeys,
          lastParty: { names, categoryIds: s.categoryIds, impostors },
        });
        return true;
      },
      startFromLast: () => {
        const s = get();
        const last = s.lastParty;
        if (!last) return false;
        const selected = allCategories(s.customCategories, s.packs).filter(
          (c) => last.categoryIds.includes(c.id) && c.words.length > 0,
        );
        if (selected.length === 0) return false;
        const impostors = Math.min(last.impostors, maxImpostors(last.names.length));
        const { game, usedKeys } = createGame({ names: last.names, categories: selected, impostors, usedKeys: s.usedKeys });
        set({ game, usedKeys });
        return true;
      },
      advanceReveal: () => {
        const g = get().game;
        if (!g) return true;
        const revealIndex = g.revealIndex + 1;
        set({ game: { ...g, revealIndex } });
        return revealIndex >= g.players.length;
      },
      eliminate: (playerId) => {
        const g = get().game;
        if (!g) return;
        const players = g.players.map((p) => (p.id === playerId ? { ...p, out: true } : p));
        const target = players.find((p) => p.id === playerId);
        if (!target) return;
        const wasImpostor = target.role === 'impostor';
        set({
          game: {
            ...g,
            players,
            elimination: {
              playerId,
              wasImpostor,
              guess: wasImpostor ? 'pending' : 'none',
              outcome: wasImpostor ? null : evaluate(players),
            },
          },
        });
      },
      resolveGuess: (correct) => {
        const g = get().game;
        if (!g?.elimination) return;
        set({
          game: {
            ...g,
            elimination: {
              ...g.elimination,
              guess: correct ? 'right' : 'wrong',
              outcome: correct ? 'impostorsWin' : evaluate(g.players),
            },
          },
        });
      },
      guessWord: (input) => {
        const g = get().game;
        if (!g) return;
        get().resolveGuess(isRightGuess(input, g.word));
      },
      nextRound: () => {
        const g = get().game;
        if (!g) return;
        const alive = g.players.filter((p) => !p.out);
        set({ game: { ...g, round: g.round + 1, elimination: null, starterId: pick(alive).id } });
      },
      clearGame: () => set({ game: null }),

      addCustomCategory: (name) => {
        const clean = name.trim();
        if (!clean) return null;
        const id = `custom-${Date.now().toString(36)}`;
        const category: Category = { id, name: clean, icon: CUSTOM_ICON, color: CUSTOM_COLOR, words: [], isCustom: true };
        set((s) => ({ customCategories: [...s.customCategories, category], categoryIds: [...s.categoryIds, id] }));
        return id;
      },
      removeCustomCategory: (id) =>
        set((s) => ({
          customCategories: s.customCategories.filter((c) => c.id !== id),
          categoryIds: s.categoryIds.filter((x) => x !== id),
        })),
      addCustomWord: (categoryId, word, hint) => {
        const cleanWord = word.trim();
        const cleanHint = hint.trim();
        if (!cleanWord) return 'empty';
        if (cleanHint && hintContainsWord(cleanHint, cleanWord)) return 'hintHasWord';
        set((s) => ({
          customCategories: s.customCategories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  words: [
                    ...c.words.filter((x) => norm(x.word) !== norm(cleanWord)),
                    { word: cleanWord, hints: cleanHint ? [cleanHint] : [] },
                  ],
                }
              : c,
          ),
        }));
        return 'ok';
      },
      removeCustomWord: (categoryId, word) =>
        set((s) => ({
          customCategories: s.customCategories.map((c) =>
            c.id === categoryId ? { ...c, words: c.words.filter((x) => x.word !== word) } : c,
          ),
        })),
      installPack: (pack) =>
        set((s) => ({
          packs: [...s.packs.filter((p) => p.id !== pack.id), pack],
          categoryIds: s.categoryIds.includes(pack.id) ? s.categoryIds : [...s.categoryIds, pack.id],
        })),
      removePack: (id) =>
        set((s) => ({ packs: s.packs.filter((p) => p.id !== id), categoryIds: s.categoryIds.filter((x) => x !== id) })),
    }),
    {
      name: 'kto-blafuje-v1',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s): Persisted => ({
        playerCount: s.playerCount,
        names: s.names,
        impostorCount: s.impostorCount,
        categoryIds: s.categoryIds,
        customCategories: s.customCategories,
        packs: s.packs,
        usedKeys: s.usedKeys,
        lastParty: s.lastParty,
      }),
    },
  ),
);

/** true, keď sa uložené nastavenia načítali z AsyncStorage. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(useGame.persist.hasHydrated());
  useEffect(() => {
    if (useGame.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useGame.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  return hydrated;
}
