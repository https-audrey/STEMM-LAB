# Convert All Screens from HTML/Tailwind to React Native

## Background

All 6 screen files (`OnboardingScreen`, `LoginScreen`, `RegisterRoleScreen`, `RegisterInfoScreen`, `LoadingScreen`, `HomeScreen`) were generated from a Figma-to-code tool that outputs **web HTML + Tailwind CSS**. These use HTML elements (`<main>`, `<img>`, `<header>`, `<section>`, `<form>`, `<input>`, `<button>`) and Tailwind utility classes — this works for Expo Web but **will crash on Android/iOS** since React Native requires its own components (`View`, `Image`, `Text`, `TextInput`, `TouchableOpacity`, etc.) with `StyleSheet`.

## User Review Required

> [!IMPORTANT]
> **Asset availability**: Only 7 asset files exist in `assets/` but the screens reference **80+ assets** (e.g., `vector-1.png` through `vector-92.png`, `group-5.png`, `image-7.png`, etc.). Since these files don't exist, the app will show broken images. There are two approaches:
> 1. **Convert screens now with placeholder `require()` calls** — the code will be correct React Native, but images won't render until assets are added.
> 2. **Simplify the designs** — rebuild screens using React Native primitives (shapes, gradients, colors) instead of relying on dozens of image assets. This would be more maintainable.
> 
> **Which approach do you prefer?**

> [!WARNING]
> **Tailwind CSS**: The project has `tailwind.config.js` and `tailwind.css` but no NativeWind or similar React Native Tailwind bridge installed. The converted screens will use `StyleSheet.create()` instead. The tailwind files will become unused.

> [!IMPORTANT]  
> **Navigation integration**: The current screens don't use React Navigation's `navigation` prop at all (e.g., Onboarding uses `window.location.hash` for navigation). All screens need to accept navigation props and use `navigation.navigate()`.

## Proposed Changes

### Pattern for Each Screen

Every screen will follow this conversion pattern:
- `<main>` / `<div>` → `<View>`
- `<img>` → `<Image>` with `source={require(...)}`
- `<h1>` / `<h2>` / `<p>` / `<span>` / `<label>` → `<Text>`
- `<button>` → `<TouchableOpacity>` wrapping `<Text>`
- `<input>` → `<TextInput>`
- `<form>` → removed (no forms in RN, handle submit via button press)
- `<br/>` → `{"\n"}` inside `<Text>`
- Tailwind classes → `StyleSheet.create()` objects
- `className=` → `style=`
- Absolute pixel positioning preserved via `position: 'absolute'`, `top`, `left`, `width`, `height`
- Navigation via `useNavigation()` hook from `@react-navigation/native`
- Type-safe navigation with `StackNavigationProp<RootStackParamList>`

---

### Screen 1: OnboardingScreen

#### [MODIFY] [OnboardingScreen.tsx](file:///c:/Users/ASUS/Documents/Programming/ExpoGo/screens/OnboardingScreen.tsx)
- Replace all HTML with React Native components
- Replace `window.location.hash` navigation with `navigation.navigate('Login')`
- Convert Tailwind classes to `StyleSheet`
- Use `Image` with `require()` for assets
- Accept navigation prop typed with `StackNavigationProp`

---

### Screen 2: LoginScreen

#### [MODIFY] [LoginScreen.tsx](file:///c:/Users/ASUS/Documents/Programming/ExpoGo/screens/LoginScreen.tsx)
- Replace `<form>`, `<input>`, `<label>` with `<View>`, `<TextInput>`, `<Text>`
- Convert `FormEvent` handling to button `onPress`
- Replace `useId()` (web-only) with simple string IDs
- Replace `onChange` with `onChangeText`
- Add `secureTextEntry` for password field
- Navigation to RegisterRole and Home screens

---

### Screen 3: RegisterRoleScreen

#### [MODIFY] [RegisterRoleScreen.tsx](file:///c:/Users/ASUS/Documents/Programming/ExpoGo/screens/RegisterRoleScreen.tsx)
- Replace `<fieldset>`, `<legend>`, radio `<input>` with `<TouchableOpacity>` toggles
- Convert role selection UI to pressable cards
- Navigate to `RegisterInfo` with selected role param

---

### Screen 4: RegisterInfoScreen

#### [MODIFY] [RegisterInfoScreen.tsx](file:///c:/Users/ASUS/Documents/Programming/ExpoGo/screens/RegisterInfoScreen.tsx)
- Replace 5 HTML `<input>` fields with `<TextInput>` components
- Replace `<form>` submit with button press handler
- Keep date formatting logic
- Add `secureTextEntry` for password fields
- Navigate to Loading screen on submit

---

### Screen 5: LoadingScreen

#### [MODIFY] [LoadingScreen.tsx](file:///c:/Users/ASUS/Documents/Programming/ExpoGo/screens/LoadingScreen.tsx)
- Convert to React Native with Image/View/Text
- Add `React` import (currently missing)
- Add auto-navigation to Home screen after a timer (e.g., `setTimeout` with `useEffect`)

---

### Screen 6: HomeScreen

#### [MODIFY] [HomeScreen.tsx](file:///c:/Users/ASUS/Documents/Programming/ExpoGo/screens/HomeScreen.tsx)
- Largest screen (~769 lines) with complex UI: subject tabs, level map, bottom nav
- Convert all HTML to React Native components
- Convert bottom navigation bar to `TouchableOpacity` buttons
- Convert subject tab buttons

---

### Supporting Files

#### [MODIFY] [assets.d.ts](file:///c:/Users/ASUS/Documents/Programming/ExpoGo/types/assets.d.ts)
- Update PNG module declarations to return `number` (React Native's `require()` returns a number for local images) instead of `string`

#### [MODIFY] [App.tsx](file:///c:/Users/ASUS/Documents/Programming/ExpoGo/App.tsx)
- No structural changes needed — already uses React Navigation correctly

## Open Questions

> [!IMPORTANT]
> 1. **Missing assets (80+ files)**: Should I proceed with `require()` calls for all referenced assets even though only 7 exist? Or should I simplify the designs to only use the 7 available assets?
> 2. **Fonts**: The screens reference `Short_Stack-Regular`, `DynaPuff-Regular`, and `Oliver-Regular` fonts. These aren't installed via `expo-font`. Should I add them, or use the existing `FredokaOne` + system fonts for now?
> 3. **Loading screen behavior**: Should it auto-navigate to Home after a delay, or wait for a user action?

## Verification Plan

### Automated Tests
- Run `npx tsc --noEmit` to verify TypeScript compilation
- Run `npx expo start` to verify the app boots without crashes

### Manual Verification
- Test on Android/iOS emulator or device to verify screens render correctly
- Verify navigation flow: Onboarding → Login → RegisterRole → RegisterInfo → Loading → Home
