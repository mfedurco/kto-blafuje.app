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
