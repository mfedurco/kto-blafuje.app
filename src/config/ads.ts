/**
 * Nastavenie reklám.
 *
 * - 'off'         – reklamy sa nezobrazujú a nezaberajú žiadne miesto (predvolené, aktuálne vydanie)
 * - 'placeholder' – ukáže sa len prázdny rámik na kontrolu rozloženia, bez reklamy a bez siete
 *
 * Skutočné reklamy Google AdMob sú ďalší krok, postup je v `docs/ads.md`.
 * Reklamy sa nikdy nesmú zobraziť na obrazovkách odhalenia slova, kola ani hlasovania.
 */
export type AdMode = 'off' | 'placeholder';

export const ADS: { mode: AdMode; bannerHeight: number } = {
  mode: 'off',
  bannerHeight: 60,
};
