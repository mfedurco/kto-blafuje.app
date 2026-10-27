# Kto Blafuje?

Slovenská offline párty hra na jednom mobile: všetci okrem podvodníka poznajú tajné slovo, podvodník dostane len širokú nápovedu a blafuje. Android, Expo / React Native.

## Spustenie
- `npm install` a `npx expo start`
- APK pre Windows: dvojklik na `build-apk.bat` (potrebuje Android SDK, JDK 17, CMake 3.31 a zapnuté dlhé cesty); výsledok `KtoBlafuje.apk`

## Štruktúra
- `src/app` – obrazovky (expo-router)
- `src/components` – ovládacie prvky, ikony, `SwipeReveal`
- `src/data` – slová a nápovedy (`words.ts`, `more.ts`)
- `src/lib`, `src/store` – herná logika a stav

## Vydanie
- `store/` – texty a grafika pre Google Play, postup v `store/RELEASE.md`
- `docs/privacy.html` – zásady ochrany súkromia
- `docs/ads.md` – miesto pre reklamy a ako zapnúť AdMob

## Tematické balíky slov
Priečinok `packs/` obsahuje JSON balíky (Halloween, Vianoce ...). Nový balík: pridaj `packs/<id>.json` (`{id, words:[{word, hints[]}]}`), zapíš ho do `packs/index.json` a nastav `latest`. Appka ho ponúkne bannerom na úvodnej obrazovke, bez aktualizácie v obchode. Nápovedy max. 24 znakov, 1–4 na slovo, bez samotného slova.
