# Reklamy (Google AdMob)

Teraz je v aplikácii len **vyhradené miesto**: komponent `AdSlot` (`src/components/AdSlot.tsx`) a prepínač v `src/config/ads.ts`.

- `mode: 'off'` (predvolené): reklamy ani prázdne miesto sa nezobrazujú.
- `mode: 'placeholder'`: ukáže sa prázdny rámik 60 px, aby si videl, kde banner bude.

## Kde je miesto
- úvodná obrazovka (nad pätičkou),
- výsledok na konci hry (pod zoznamom, kto bol kto, mimo tlačidiel).

Nikdy nie na obrazovke odhalenia slova, kola (časovač) ani hlasovania: rozptyľovalo by to a deti by mohli omylom klepnúť na reklamu pri tajnej karte.

## Čo treba na skutočné reklamy
1. Účet AdMob (admob.google.com), v ňom vytvoriť aplikáciu (Android) a banner reklamnú jednotku. Dostaneš **App ID** (`ca-app-pub-…~…`) a **ID jednotky** (`ca-app-pub-…/…`).
2. Knižnica `react-native-google-mobile-ads` (`npx expo install react-native-google-mobile-ads`) a v `app.json` plugin s App ID:
   ```json
   ["react-native-google-mobile-ads", { "androidAppId": "ca-app-pub-XXXX~YYYY" }]
   ```
   Je to natívny kód, takže treba nový build (dev build alebo EAS).
3. Do `AdSlot` doplniť `BannerAd` s tvojím ID jednotky; počas vývoja používať **testovacie ID** (`TestIds.BANNER`), nikdy neklikať na vlastné ostré reklamy.
4. Pred zobrazením reklamy inicializovať SDK a vyžiadať súhlas (**UMP / GDPR**) pre používateľov v EÚ vrátane Slovenska.
5. Aktualizovať zásady ochrany súkromia, formulár Bezpečnosť údajov v Play Console a vyznačiť, že aplikácia obsahuje reklamy.
6. Pre rodiny/deti (ak cieľová skupina zahŕňa deti do 13 rokov, Families Policy):
   - `tagForChildDirectedTreatment: true`, `maxAdContentRating: 'G'`, nepersonalizované reklamy,
   - používať len certifikované reklamné SDK (AdMob v tomto režime spĺňa podmienky),
   - žiadne zberanie reklamného ID z detských zariadení.
7. Oprávnenie `INTERNET` nechaj povolené (reklamy ho potrebujú); v `blockedPermissions` v `app.json` ho neblokuj.

## Poznámka
Až po úspešnom prvom builde bez reklám pridávaj natívny SDK, nech sa chyby buildu nemiešajú.
