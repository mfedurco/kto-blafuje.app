/** Odhad šírky bežného znaku písma Baloo 2 (Bold) ako násobok veľkosti písma. */
const CHAR = 0.56;

/** Koľko riadkov zaberie text, ak sa zalamuje po slovách a každý znak má odhadnutú šírku. */
function linesNeeded(words: string[], width: number, size: number): number {
  const perChar = size * CHAR;
  let lines = 1;
  let used = 0;
  for (const word of words) {
    const w = word.length * perChar;
    const gap = used === 0 ? 0 : perChar;
    if (used > 0 && used + gap + w > width) {
      lines += 1;
      used = w;
    } else {
      used += gap + w;
    }
  }
  return lines;
}

/**
 * Vyberie veľkosť písma tak, aby sa text zmestil do `maxLines` riadkov a pritom sa žiadne slovo
 * nezalomilo uprostred (nezostane jedno písmeno na druhom riadku).
 * Namiesto zalamovania slova sa radšej mierne zmenší písmo.
 */
export function fitSize(text: string, width: number, base: number, min = 20, maxLines = 2): number {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0 || width <= 0) return base;
  const longest = Math.max(...words.map((x) => x.length));
  let size = Math.min(base, width / (longest * CHAR));
  while (size > min && linesNeeded(words, width, size) > maxLines) size -= 1;
  return Math.max(min, Math.floor(size));
}
