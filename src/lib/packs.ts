import { FETCH_TIMEOUT_MS, MANIFEST_FILE, MAX_BYTES, PACKS_BASE_URL } from '@/config/packs';
import type { Category, WordItem } from '@/data/words';

import { hintContainsWord, norm } from './game';

export type PackMeta = {
  id: string;
  name: string;
  title: string;
  text: string;
  emoji: string;
  color: string;
  file: string;
  version: number;
  /** Dátum (YYYY-MM-DD), po ktorom sa už balík na úvodnej obrazovke neponúka. */
  until: string | null;
  imageUrl: string | null;
};

export type Manifest = { latest: string; packs: PackMeta[] };

const ID = /^[a-z0-9-]{1,40}$/;
const FILE = /^[a-z0-9-]{1,60}\.json$/;
const COLOR = /^#[0-9a-fA-F]{6}$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

const str = (v: unknown, max: number): string | null =>
  typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max ? v.trim() : null;

async function getJson(url: string): Promise<unknown> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (text.length > MAX_BYTES) throw new Error('Súbor je príliš veľký');
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

function parseMeta(raw: unknown): PackMeta | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const id = str(r.id, 40);
  const file = str(r.file, 64);
  const name = str(r.name, 30);
  const title = str(r.title, 60);
  const text = str(r.text, 120);
  const emoji = str(r.emoji, 8);
  const color = str(r.color, 7);
  const version = typeof r.version === 'number' && Number.isInteger(r.version) && r.version > 0 ? r.version : null;
  if (!id || !ID.test(id) || !file || !FILE.test(file) || !name || !title || !text || !emoji || !color || !COLOR.test(color) || !version) return null;
  const until = typeof r.until === 'string' && DAY.test(r.until) ? r.until : null;
  const image = typeof r.imageUrl === 'string' && r.imageUrl.startsWith(PACKS_BASE_URL) && r.imageUrl.length < 200 ? r.imageUrl : null;
  return { id, file, name, title, text, emoji, color, version, until, imageUrl: image };
}

/** Stiahne zoznam balíkov. Pri chybe alebo bez internetu hodí výnimku. */
export async function fetchManifest(): Promise<Manifest> {
  const raw = (await getJson(PACKS_BASE_URL + MANIFEST_FILE)) as Record<string, unknown>;
  if (!raw || raw.version !== 1 || typeof raw.latest !== 'string' || !Array.isArray(raw.packs)) throw new Error('Neplatný zoznam balíkov');
  const packs = raw.packs.slice(0, 30).map(parseMeta).filter((p): p is PackMeta => p !== null);
  return { latest: raw.latest, packs };
}

/** Balík, ktorý sa má ponúknuť na úvodnej obrazovke (najnovší a nie po termíne). */
export function pickLatest(m: Manifest, today = new Date()): PackMeta | null {
  const meta = m.packs.find((p) => p.id === m.latest);
  if (!meta) return null;
  if (meta.until) {
    const end = new Date(`${meta.until}T23:59:59`);
    if (today.getTime() > end.getTime()) return null;
  }
  return meta;
}

/** Stiahne a skontroluje balík slov. Neplatný balík sa odmietne celý. */
export async function downloadPack(meta: PackMeta): Promise<Category> {
  const raw = (await getJson(PACKS_BASE_URL + meta.file)) as Record<string, unknown>;
  if (!raw || raw.id !== meta.id || !Array.isArray(raw.words)) throw new Error('Neplatný balík');
  const seen = new Set<string>();
  const words: WordItem[] = [];
  for (const item of raw.words.slice(0, 300)) {
    if (typeof item !== 'object' || item === null) continue;
    const it = item as Record<string, unknown>;
    const word = str(it.word, 30);
    if (!word || seen.has(norm(word)) || !Array.isArray(it.hints)) continue;
    const hints = it.hints
      .map((h) => str(h, 24))
      .filter((h): h is string => h !== null && !hintContainsWord(h, word))
      .slice(0, 4);
    if (hints.length === 0) continue;
    seen.add(norm(word));
    words.push({ word, hints });
  }
  if (words.length < 8) throw new Error('Balík má málo slov');
  return {
    id: `pack:${meta.id}`,
    name: meta.name,
    icon: 'star',
    color: meta.color,
    words,
    isPack: true,
    emoji: meta.emoji,
    version: meta.version,
  };
}
