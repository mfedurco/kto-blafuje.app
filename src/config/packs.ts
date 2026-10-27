/**
 * Tematické balíky slov (Halloween, Vianoce, Valentín ...), ktoré sa dajú stiahnuť z internetu.
 * Balíky sú obyčajné JSON súbory v priečinku `packs/` v repozitári na GitHube.
 * Nový balík = pridať súbor a zapísať ho do `index.json`. Appku netreba aktualizovať.
 */
export const PACKS_BASE_URL = 'https://raw.githubusercontent.com/mfedurco/kto-blafuje.app/main/packs/';
export const MANIFEST_FILE = 'index.json';
export const FETCH_TIMEOUT_MS = 8000;
export const MAX_BYTES = 300_000;
