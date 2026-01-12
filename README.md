# Habik 📱

A beautiful habit tracking app to help you build lasting habits and achieve your goals.

![Habik App](https://img.shields.io/badge/React%20Native-0.83-blue) ![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-brightgreen) ![License](https://img.shields.io/badge/License-Proprietary-red)

## ✨ Features

- **Daily Habit Tracking** - Create and track your daily habits with ease
- **Streak Counter** - Stay motivated with streak tracking
- **Progress Statistics** - View weekly stats and completion rates
- **Journey & Badges** - Unlock achievements as you build habits
- **Custom Reminders** - Set notifications to never miss a habit
- **Profile Customization** - Upload profile picture and personalize
- **Dark/Light Theme** - Choose your preferred appearance
- **Local Data Storage** - All data stays private on your device

## 📸 Screenshots

<!-- Add screenshots here -->
| Home | Statistics | Journey | Profile |
|------|------------|---------|---------|
| ![Home](screenshots/home.png) | ![Stats](screenshots/stats.png) | ![Journey](screenshots/journey.png) | ![Profile](screenshots/profile.png) |

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS, Mac only)

### Installation

```bash
# Clone the repository
git clone https://github.com/lightapps-studio/habik.git

# Install dependencies
cd habik
npm install

# Install iOS dependencies (Mac only)
cd ios && pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios
```

## 🏗️ Building for Production

### Android

```bash
# Generate release keystore (first time only)
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore habik-release.keystore -alias habik -keyalg RSA -keysize 2048 -validity 10000

# Build release AAB
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

## 🛠️ Tech Stack

- **React Native** 0.83
- **TypeScript**
- **NativeWind** (TailwindCSS for RN)
- **AsyncStorage** (Local persistence)
- **Notifee** (Notifications)
- **React Native Image Picker**

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # App screens
├── services/       # Notification & other services
├── context/        # React context providers
├── config/         # App configuration
└── utils/          # Utility functions
```

## 📄 Legal

- [Terms and Conditions](./src/screens/TermsScreen.tsx) - Built into the app
- Privacy Policy - Your data stays local on your device

## 📧 Contact

**LightApps Studio**  
Email: studio.lighty@gmail.com

## 📜 License

Copyright © 2026 LightApps Studio. All rights reserved.

---

Made with ❤️ by LightApps Studio
