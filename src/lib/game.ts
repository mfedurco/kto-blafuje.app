import { avatarColors } from '@/constants/theme';
import type { Category } from '@/data/words';

export type Role = 'innocent' | 'impostor';

export type GamePlayer = {
  id: number;
  name: string;
  role: Role;
  /** Nápoveda podvodníka. null = bez nápovedy (zobrazí sa názov kategórie). */
  hint: string | null;
  color: string;
  out: boolean;
};

export type Outcome = 'continue' | 'innocentsWin' | 'impostorsWin';

export type Elimination = {
  playerId: number;
  wasImpostor: boolean;
  guess: 'none' | 'pending' | 'right' | 'wrong' | 'skipped';
  outcome: Outcome | null;
};

export type Game = {
  word: string;
  categoryId: string;
  categoryName: string;
  players: GamePlayer[];
  /** Index hráča, ktorý práve preberá telefón pri rozdávaní kariet. */
  revealIndex: number;
  starterId: number;
  round: number;
  elimination: Elimination | null;
  /** Možnosti pre ľahké hádanie (správne slovo + 3 pomýlenia). */
};

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;

export function maxImpostors(playerCount: number): number {
  return Math.max(1, Math.min(2, Math.floor(playerCount / 2)));
}

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Malé písmená, bez diakritiky, bez zbytočných medzier. */
export function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function hintContainsWord(hint: string, word: string): boolean {
  const h = norm(hint);
  const w = norm(word);
  if (!w) return false;
  // Obsahuje celé slovo alebo jeho kmeň (prvých 5 znakov dlhšieho slova).
  if (h.includes(w)) return true;
  const stem = w.length >= 6 ? w.slice(0, 5) : null;
  return stem !== null && h.includes(stem);
}

export function isRightGuess(input: string, word: string): boolean {
  return norm(input) === norm(word);
}

export function uniqueNames(raw: string[]): string[] {
  const seen = new Map<string, number>();
  return raw.map((name, i) => {
    const base = name.trim() || `Hráč ${i + 1}`;
    const key = norm(base);
    const count = (seen.get(key) ?? 0) + 1;
    seen.set(key, count);
    return count === 1 ? base : `${base} ${count}`;
  });
}

type PoolItem = { key: string; category: Category; word: string; hints: string[] };

function buildPool(categories: Category[]): PoolItem[] {
  const pool: PoolItem[] = [];
  for (const category of categories) {
    for (const item of category.words) {
      pool.push({ key: `${category.id}:${item.word}`, category, word: item.word, hints: item.hints });
    }
  }
  return pool;
}

export function evaluate(players: GamePlayer[]): Outcome {
  const impostors = players.filter((p) => p.role === 'impostor' && !p.out).length;
  const innocents = players.filter((p) => p.role === 'innocent' && !p.out).length;
  if (impostors === 0) return 'innocentsWin';
  if (impostors >= innocents) return 'impostorsWin';
  return 'continue';
}

type CreateArgs = {
  names: string[];
  categories: Category[];
  impostors: number;
  usedKeys: string[];
};

/**
 * Z vybraných kategórií vylosuje jedno náhodné slovo a k nemu náhodné nápovedy.
 * Slová sa neopakujú, kým sa celý výber nevyčerpá.
 */
export function createGame({ names, categories, impostors, usedKeys }: CreateArgs): {
  game: Game;
  usedKeys: string[];
} {
  const pool = buildPool(categories);
  let used = new Set(usedKeys);
  let free = pool.filter((p) => !used.has(p.key));
  if (free.length === 0) {
    const poolKeys = new Set(pool.map((p) => p.key));
    used = new Set([...used].filter((k) => !poolKeys.has(k)));
    free = pool;
  }
  const chosen = pick(free);
  used.add(chosen.key);

  const count = names.length;
  const impostorCount = Math.min(impostors, maxImpostors(count));
  const impostorIds = new Set(shuffle(Array.from({ length: count }, (_, i) => i)).slice(0, impostorCount));

  // Každý podvodník dostane inú nápovedu, ak je na výber viac nápoved.
  const hints = shuffle(chosen.hints);
  let hintCursor = 0;

  const colors = shuffle(avatarColors);
  const players: GamePlayer[] = names.map((name, i) => {
    const isImpostor = impostorIds.has(i);
    let hint: string | null = null;
    if (isImpostor && hints.length > 0) {
      hint = hints[hintCursor % hints.length];
      hintCursor += 1;
    }
    return { id: i, name, role: isImpostor ? 'impostor' : 'innocent', hint, color: colors[i % colors.length], out: false };
  });

  const game: Game = {
    word: chosen.word,
    categoryId: chosen.category.id,
    categoryName: chosen.category.name,
    players,
    revealIndex: 0,
    starterId: pick(players).id,
    round: 1,
    elimination: null,
  };
  return { game, usedKeys: [...used] };
}
