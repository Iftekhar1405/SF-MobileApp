# Salim Footwear mobile app — setup and run (Expo)

This guide is written for developers who are new to mobile app development. Follow the sections in order. The app uses [Expo](https://expo.dev) SDK **54** with [Expo Router](https://docs.expo.dev/router/introduction/).

---

## Part 1 — Tools you need on your computer

### 1.1 Install Node.js (required)

The app runs on **Node.js**, which includes **npm** (the package manager we use for this project).

1. Open [https://nodejs.org](https://nodejs.org).
2. Download the **LTS** (Long Term Support) version for your operating system (Windows, macOS, or Linux).
3. Run the installer and accept the defaults (including “npm” and adding Node to your PATH).
4. Open a new terminal (Command Prompt, PowerShell, Terminal, or your IDE terminal) and verify:

   ```bash
   node -v
   npm -v
   ```

   You should see version numbers (for example `v22.x.x` and `10.x.x`). If the command is not found, restart the terminal or reboot once.

### 1.2 Open the project folder in your editor

1. Clone or copy this repository to your machine.
2. Open the folder `salim-mobile-app` in Cursor, VS Code, or another editor.
3. All commands below are run **from this folder** (the one that contains `package.json`).

---

## Part 2 — Install project dependencies

In a terminal, `cd` into the project root, then:

```bash
cd /path/to/salim-mobile-app
npm install
```

Wait until it finishes without errors. This reads `package-lock.json` and installs the same dependency versions the team uses.

---

## Part 3 — API URL (important when testing on a real phone)

The app talks to a backend using `EXPO_PUBLIC_API_URL` (see `services/api.ts`).

- **Simulator/emulator on the same machine** as the API: `http://localhost:8080/api/v1` may work if your API is bound to localhost.
- **Physical phone**: `localhost` means *the phone itself*, not your computer. Use your computer’s **LAN IP** instead, for example `http://192.168.1.50:8080/api/v1` (replace with your IP and port). Phone and computer must be on the **same Wi‑Fi**.

Optional: create a file named `.env` in the project root (same level as `package.json`):

```bash
EXPO_PUBLIC_API_URL=https://your-api-host.example/api/v1
```

Restart Expo after changing `.env` (`Ctrl+C` to stop, then `npm start` again).

---

## Part 4 — Start the Expo dev server

From the project root:

```bash
npm start
```

This runs `expo start` and opens the **Metro** bundler in the terminal (and often a page in your browser).

Useful keys in the terminal (when the dev server is running):

- **`a`** — try to open the app on a connected **Android** device or emulator.
- **`i`** — try to open on **iOS** simulator (macOS with Xcode only).
- **`r`** — reload the app.
- **`m`** — toggle the dev menu on a connected device.

To stop the server: **`Ctrl+C`**.

---

## Part 5 — Run on your **physical phone** with Expo Go (easiest for beginners)

You do **not** need Android Studio for this path. You only need the Expo Go app and the same network as your computer.

### 5.1 Install Expo Go

- **Android**: [Google Play — Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store — Expo Go](https://apps.apple.com/app/expo-go/id982107779)

### 5.2 Same Wi‑Fi

Connect your phone to the **same Wi‑Fi** as your computer (not “guest” Wi‑Fi if that isolates devices).

### 5.3 Scan the QR code

1. Run `npm start` on your computer.
2. In the terminal or browser UI, you will see a **QR code**.
   - **Android**: Open **Expo Go**, tap **Scan QR code**, and scan the code from the terminal/browser.
   - **iOS**: Open the **Camera** app, point at the QR code, tap the notification to open in Expo Go.

### 5.4 If the phone cannot connect

- Disable VPN on phone and computer.
- Try **tunnel** mode (slower but works through strict networks):

  ```bash
  npx expo start --tunnel
  ```

  You need a free Expo account when prompted for tunnel mode.

---

## Part 6 — Android Studio and the **Android emulator** (step by step)

Use this when you want to run the app on a **virtual Android phone** on your computer, or when you need Android SDK tools (for example `adb`).

### 6.1 Download and install Android Studio

1. Open [https://developer.android.com/studio](https://developer.android.com/studio).
2. Download **Android Studio** for your OS.
3. Run the installer:
   - Accept the license and default components when asked.
   - Let it install the **Android SDK**, **Android SDK Platform**, and **Android Virtual Device (AVD)** related items when the setup wizard offers them.

### 6.2 First launch — finish the setup wizard

1. Open **Android Studio**.
2. If you see **Welcome to Android Studio**, choose **More Actions** → **SDK Manager** (or open a project and use **File → Settings → Languages & Frameworks → Android SDK** on Windows/Linux, or **Android Studio → Settings** on macOS).
3. In **SDK Platforms** tab:
   - Check a recent **Android** version (for example **API 35** or **API 34**).
   - Click **Apply** / **OK** and wait for download.
4. In **SDK Tools** tab, ensure these are checked (install if missing):
   - **Android SDK Build-Tools**
   - **Android SDK Platform-Tools**
   - **Android Emulator**
   - **Google Play** system image (optional but useful for images with Play Store)

### 6.3 Create a virtual device (AVD)

1. In Android Studio: **More Actions** → **Virtual Device Manager** (or **Tools → Device Manager**).
2. Click **Create Device**.
3. Pick a phone definition (for example **Pixel 7**) → **Next**.
4. Choose a **system image**:
   - Prefer one with **Google Play** if available (easier for some tests).
   - Download the image if it shows **Download** next to it, then select it → **Next**.
5. Confirm **AVD Name** → **Finish**.

### 6.4 Start the emulator

1. In **Device Manager**, click the **Play** button next to your AVD.
2. Wait until the virtual phone is fully booted (home screen visible).

### 6.5 Run this Expo project on the emulator

1. In a terminal, from the project root, start Expo:

   ```bash
   npm start
   ```

2. With the emulator running, press **`a`** in the Expo terminal, **or** run in a second terminal:

   ```bash
   npm run android
   ```

   Expo should install **Expo Go** on the emulator (if needed) and open your project.

### 6.6 USB debugging on a **physical Android** (optional)

If you prefer a cable instead of Wi‑Fi:

1. On the phone: **Settings → About phone** — tap **Build number** seven times to enable **Developer options**.
2. **Settings → Developer options** — enable **USB debugging**.
3. Connect USB; accept the “Allow USB debugging?” prompt on the phone.
4. In Android Studio or SDK platform-tools, `adb devices` should list your device.
5. Run `npm start`, then press **`a`**.

---

## Part 7 — Quick command reference

| Goal                         | Command              |
|-----------------------------|----------------------|
| Install dependencies        | `npm install`        |
| Start dev server            | `npm start`          |
| Open on Android (emulator)  | `npm run android`    |
| Open in web browser (limited) | `npm run web`      |

---

## Part 8 — Troubleshooting (common first-time issues)

| Problem | What to try |
|--------|-------------|
| `node` / `npm` not found | Reinstall Node LTS; restart terminal; confirm PATH. |
| Metro / bundler errors after pull | Delete `node_modules`, run `npm install` again. |
| Phone shows “Couldn’t connect” | Same Wi‑Fi; try `npx expo start --tunnel`; turn off VPN. |
| App loads but API fails on phone | Set `EXPO_PUBLIC_API_URL` to your PC’s LAN IP, not `localhost`. |
| Emulator does not show in `adb devices` | Cold boot AVD; revoke USB debugging authorizations; update platform-tools. |
| Expo Go says unsupported SDK | Update **Expo Go** from the store; align project with supported SDK (this repo targets Expo **54**). |

---

## Summary

1. Install **Node.js LTS** and verify `node` / `npm`.
2. In the project folder: **`npm install`** then **`npm start`**.
3. **Phone**: install **Expo Go**, same Wi‑Fi, scan QR code.
4. **Android emulator**: install **Android Studio**, install SDK, create **AVD**, start emulator, then **`npm run android`** or **`a`** in the Expo terminal.

For official Expo documentation, see [https://docs.expo.dev/get-started/set-up-your-environment/](https://docs.expo.dev/get-started/set-up-your-environment/).
