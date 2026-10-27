# Postup vydania na Google Play

Google Play vyžaduje balík **AAB** (nie APK), podpísaný vlastným kľúčom. Najjednoduchšie je cloudový build cez EAS, ktorý kľúč spravuje za teba a obchádza Windows limity ciest.

1. Účet na expo.dev (zadarmo). V priečinku projektu:
   ```
   npx eas-cli login
   npx eas-cli init
   ```
   `init` pridá `extra.eas.projectId` do `app.json`.
2. Build pre obchod:
   ```
   npx eas-cli build -p android --profile production
   ```
   Pri prvom builde nechaj EAS vygenerovať keystore. Stiahni si ho a **zálohuj** (`npx eas-cli credentials`). Bez neho sa appka nedá aktualizovať.
3. Stiahni výsledný `.aab` z expo.dev.
4. Play Console: Vytvoriť aplikáciu, vyplniť údaje podľa `store/listing-sk.md`, nahrať ikonu, titulný obrázok a snímky obrazovky, URL zásad ochrany súkromia, formulár Bezpečnosť údajov, vekové hodnotenie, cieľovú skupinu.
5. Nový osobný účet: najprv **uzavreté testovanie**, aspoň 12 testerov nepretržite 14 dní, až potom žiadosť o produkčný prístup.
6. Aktualizácie: zvýš verziu (`autoIncrement` v `eas.json` zvyšuje `versionCode` sám) a znova `build` + nahrať.

## Rýchly test APK
`npx eas-cli build -p android --profile preview` vyrobí APK na inštaláciu do mobilu (alebo použi lokálny `build-apk.bat`).
