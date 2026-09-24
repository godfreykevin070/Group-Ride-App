# React Native + TypeScript + NativeWind

A React Native application built with **Expo**, **TypeScript**, and **NativeWind**.

## Tech Stack

* React Native
* Expo SDK `57.0.9`
* TypeScript
* NativeWind
* Tailwind CSS
* Expo Router
* Lucide React Native

---

## Prerequisites

Make sure the following are installed:

* **Node.js** 20+
* **npm** 10+
* **Git**
* **Expo CLI**
* Android Studio — for Android development
* Xcode — for iOS development on macOS

Check your versions:

```bash
node -v
npm -v
```

---

# 1. Create the Expo Project

Create a new Expo TypeScript project:

```bash
npx create-expo-app@latest my-app
```

Enter the project:

```bash
cd my-app
```

Install Expo SDK `57.0.9`:

```bash
npx expo install expo@57.0.9
```

Verify:

```bash
npx expo-doctor
```

---

# 2. Install NativeWind

Install NativeWind and its required dependencies:

```bash
npm install nativewind
npm install --save-dev tailwindcss
```

Generate the Tailwind configuration:

```bash
npx tailwindcss init
```

Your project should now contain:

```text
my-app/
├── app/
├── assets/
├── node_modules/
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

# 3. Configure Tailwind

Open:

```text
tailwind.config.js
```

Use:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

# 4. Configure Metro

Create or update:

```text
metro.config.js
```

Use:

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: "./global.css",
});
```

---

# 5. Create global.css

Create:

```text
global.css
```

Add:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

# 6. Configure Babel

For the Expo SDK 57 setup, keep the Expo Babel configuration compatible with the current Expo tooling.

Create/update:

```text
babel.config.js
```

```js
module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
  };
};
```

NativeWind is handled through Metro.

---

# 7. Configure TypeScript

Update:

```text
tsconfig.json
```

Example:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

---

# 8. Add NativeWind Types

Create:

```text
nativewind-env.d.ts
```

Add:

```ts
/// <reference types="nativewind/types" />
```

This enables TypeScript support for NativeWind's `className`.

---

# 9. Import global.css

In your root layout:

```text
app/_layout.tsx
```

Add:

```tsx
import "../global.css";
```

Example:

```tsx
import "../global.css";

import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
```

---

# 10. Test NativeWind

Create:

```text
app/index.tsx
```

```tsx
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text className="text-3xl font-bold text-white">
        Hello NativeWind!
      </Text>

      <Text className="mt-2 text-gray-400">
        Expo + React Native + TypeScript
      </Text>
    </View>
  );
}
```

---

# 11. Install Lucide Icons

For icons:

```bash
npm install lucide-react-native
```

Example:

```tsx
import { Home } from "lucide-react-native";

<Home size={24} color="white" />;
```

---

# 12. Recommended Project Structure

```text
my-app/
│
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   │
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── rides.tsx
│       └── profile.tsx
│
├── components/
│   ├── ui/
│   ├── cards/
│   ├── buttons/
│   └── navigation/
│
├── constants/
│   ├── Colors.ts
│   └── Config.ts
│
├── hooks/
│
├── services/
│   ├── api.ts
│   └── storage.ts
│
├── assets/
│   ├── images/
│   └── icons/
│
├── global.css
├── metro.config.js
├── babel.config.js
├── tailwind.config.js
├── nativewind-env.d.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

# 13. Start the Development Server

Run:

```bash
npx expo start
```

Then:

### Android

```bash
npx expo start --android
```

### iOS

```bash
npx expo start --ios
```

### Web

```bash
npx expo start --web
```

You can also scan the QR code using **Expo Go** if the installed Expo Go version supports SDK 57.

---

# 14. Clear Expo Cache

If NativeWind styles are not appearing:

```bash
npx expo start -c
```

If the Metro cache is still problematic:

```bash
rm -rf node_modules
npm install
npx expo start -c
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
npx expo start -c
```

---

# 15. Verify Installation

Run:

```bash
npx expo-doctor
```

Then:

```bash
npx expo start
```

The following should work:

```tsx
<View className="flex-1 bg-black items-center justify-center">
  <Text className="text-white text-2xl font-bold">
    NativeWind is working
  </Text>
</View>
```

---

## Useful Commands

| Command                      | Purpose                         |
| ---------------------------- | ------------------------------- |
| `npm install`                | Install dependencies            |
| `npx expo start`             | Start Expo                      |
| `npx expo start -c`          | Start with cleared cache        |
| `npx expo start --android`   | Run Android                     |
| `npx expo start --ios`       | Run iOS                         |
| `npx expo start --web`       | Run Web                         |
| `npx expo-doctor`            | Check project configuration     |
| `npx expo install <package>` | Install Expo-compatible package |

---

## Package Versions

The project targets:

```text
Expo SDK       57.0.9
React Native   Expo-managed version
TypeScript     Expo-compatible version
NativeWind     Compatible NativeWind release
Tailwind CSS   NativeWind-compatible release
```

> **Important:** Don't blindly install the latest React Native, React, NativeWind, or Tailwind versions. Expo SDK versions have specific dependency compatibility requirements. Prefer `npx expo install` for Expo/React-Native packages.

---

## Troubleshooting

### NativeWind `className` does nothing

Check that:

1. `global.css` exists.
2. `global.css` is imported from `app/_layout.tsx`.
3. `metro.config.js` uses `withNativeWind`.
4. `tailwind.config.js` contains the correct `content` paths.
5. `nativewind-env.d.ts` exists.
6. Restart with:

```bash
npx expo start -c
```

### TypeScript doesn't recognize `className`

Make sure:

```text
nativewind-env.d.ts
```

contains:

```ts
/// <reference types="nativewind/types" />
```

### Styles work inconsistently

Avoid dynamically constructing Tailwind classes like:

```tsx
className={`bg-${color}-500`}
```

Prefer complete class names:

```tsx
className={active ? "bg-blue-500" : "bg-gray-500"}
```

This allows Tailwind/NativeWind to detect the classes during compilation.

---

## Development Workflow

```text
Create Expo project
       ↓
Install Expo SDK 57.0.9
       ↓
Install NativeWind
       ↓
Configure Tailwind
       ↓
Configure Metro
       ↓
Configure TypeScript
       ↓
Import global.css
       ↓
Test className
       ↓
Build application
```

---

## License

This project is for educational and development purposes.
