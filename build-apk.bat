@echo off
setlocal
set "SRC=%~dp0"
set "WORK=C:\h"
echo === Kto Blafuje?: build APK ===

if "%ANDROID_HOME%"=="" set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
if not exist "%ANDROID_HOME%\platform-tools" (
  echo CHYBA: Android SDK nenajdeny v %ANDROID_HOME%. Nastav premennu ANDROID_HOME.
  pause & exit /b 1
)
set "ANDROID_SDK_ROOT=%ANDROID_HOME%"

if exist "C:\Program Files\Android\Android Studio\jbr\bin\java.exe" set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
if "%JAVA_HOME%"=="" (
  echo CHYBA: nenajdeny JDK 17. Nainstaluj Android Studio alebo nastav JAVA_HOME.
  pause & exit /b 1
)
set "PATH=%JAVA_HOME%\bin;%PATH%"

rem Novsi CMake (ninja 1.12+ zvlada dlhe cesty)
set "CMV="
for /d %%D in ("%ANDROID_HOME%\cmake\3.31*") do set "CMV=%%~nxD"
if "%CMV%"=="" (
  echo CHYBA: v Android SDK chyba CMake 3.31.x. Android Studio - Tools - SDK Manager - SDK Tools - Show Package Details - CMake 3.31.x
  pause & exit /b 1
)
set "CMAKE_VERSION=%CMV%"
echo Pouzivam CMake %CMV%

reg query "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v LongPathsEnabled | find "0x1" >nul
if errorlevel 1 (
  echo CHYBA: LongPathsEnabled nie je zapnute. Nastav v regedit HKLM\SYSTEM\CurrentControlSet\Control\FileSystem LongPathsEnabled=1 a restartuj PC.
  pause & exit /b 1
)

rem Build prebieha v kratkej ceste C:\h (Windows limit 260 znakov pre C++ build)
if exist "%WORK%" rmdir /s /q "%WORK%"
mkdir "%WORK%"
robocopy "%SRC%." "%WORK%" /E /XD node_modules android .git .expo /XF package-lock.json KtoBlafuje*.apk /NFL /NDL /NJH /NJS /NP >nul
cd /d "%WORK%" || goto :fail

call npm install || goto :fail
if exist node_modules\react-native-reanimated (
  echo CHYBA: reanimated sa znova nainstalovala.
  goto :fail
)
call npx expo prebuild -p android --clean || goto :fail

> android\local.properties echo sdk.dir=%ANDROID_HOME:\=\\%
>> android\local.properties echo cmake.dir=%ANDROID_HOME:\=\\%\\cmake\\%CMV%

cd android
call gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a || goto :fail
cd ..

copy /Y android\app\build\outputs\apk\release\app-release.apk "%SRC%KtoBlafuje.apk"
echo.
echo HOTOVO: %SRC%KtoBlafuje.apk  (skopiruj do mobilu a nainstaluj)
pause
exit /b 0

:fail
echo.
echo BUILD ZLYHAL - posli mi text chyby.
pause
exit /b 1
