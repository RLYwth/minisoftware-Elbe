# Cloak für Android

Die Android-App zeigt die Weboberfläche aus der `index.html` in einer nativen WebView an. Beim Build werden die aktuellen Webdateien automatisch in die APK kopiert.

## Lokal bauen

Voraussetzungen: JDK 17, Android SDK 36 und Gradle 9.5.

```text
gradle -p android assembleDebug
```

Die installierbare Test-APK liegt danach unter `android/app/build/outputs/apk/debug/app-debug.apk`.

GitHub Actions führt denselben Build automatisch aus und stellt `Cloak-Android.apk` als Release bereit.
