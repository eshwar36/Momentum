# Momentum

Offline Android app for daily tasks, habits, wellness, body recomposition and focus.
Version 1.2 removes the backup/restore controls. Version 1.1 improves scrolling and
Android Back navigation. No login, backend, or internet connection is required.

## Folder contents

- src/ and public/: current React app source and assets.
- android/: native Capacitor Android project.
- package.json and package-lock.json: dependencies and reproducible install metadata.
- releases/Momentum-1.2.apk: latest installable personal-test APK (ignored by Git).
- .private/: signing key and archived old backend/data (ignored by Git; keep private).

This is the consolidated current project. Dependency caches, build intermediates,
and downloaded Android/Java toolchains are not copied; they can be recreated.

## Build

Use Node.js 24, Java 21, Android SDK platform 36, and the included Gradle wrapper.

    npm ci
    npm run build -- --configLoader native
    node node_modules/@capacitor/cli/bin/capacitor sync android

Set JAVA_HOME and ANDROID_HOME for your installed tools. From android/ run:

    gradlew.bat assembleDebug

To create an update that preserves existing installations, use the same signing
key. Before building, copy .private/signing/debug.keystore into the debug signing
location used by your Android tools (usually the Android user directory). Do not
replace the signing key for an existing installation. Never commit the private key.
The generated APK is android/app/build/outputs/apk/debug/app-debug.apk.

## Checks

    npm run lint
    node --test --test-isolation=none src/data/backNavigation.test.js src/data/deviceModel.test.js

Build, signature, navigation logic and device-data tests passed. Touch scrolling
and Android Back behavior still need confirmation on your physical phone.

## Install/update

Transfer releases/Momentum-1.2.apk to the phone and open it with Files. Install over
the existing version; do not uninstall or clear storage if you want to retain data.
Data is stored in the app on the device. Requires Android 7.0 or newer.

## Future GitHub upload

No commit or push was performed. Review the files before uploading. The .gitignore
excludes signing keys, .private, APKs, databases, caches, and local environment files.
Do not upload the whole folder through GitHub's browser uploader: it does not apply
.gitignore. Use Git so the private files remain excluded.
