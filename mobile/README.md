# Flutter Mobile App

This is the Flutter mobile application for the Mortgage Loan Application system.

## Prerequisites

- Flutter SDK 3.0.0 or higher
- Dart 3.0.0 or higher
- Android Studio / Xcode (for running on emulators)
- VS Code with Flutter extension (recommended)

## Getting Started

1. **Install Flutter**: Follow the official [Flutter installation guide](https://flutter.dev/docs/get-started/install)

2. **Install dependencies**:

   ```bash
   flutter pub get
   ```

3. **Configure API endpoint**:

   - Update the `API_BASE_URL` in `lib/utils/constants.dart` to point to your backend server

4. **Run the app**:

   ```bash
   # For development
   flutter run

   # For specific device
   flutter run -d <device-id>

   # List available devices
   flutter devices
   ```

## Project Structure

```
lib/
├── main.dart              # App entry point
├── models/                # Data models
├── providers/             # State management (Provider)
├── screens/               # UI screens
│   ├── auth/             # Authentication screens
│   ├── application/      # Loan application forms
│   ├── admin/            # Admin screens
│   └── common/           # Common screens (Home, Dashboard, etc.)
├── services/              # API and other services
├── widgets/               # Reusable widgets
└── utils/                 # Constants, helpers, theme
```

## Features

- User authentication (Sign up, Sign in, Email verification)
- Multi-step loan application form
- Application status tracking
- Admin dashboard for reviewing applications
- Profile management
- Password reset functionality

## Building for Production

### Android

```bash
flutter build apk --release
# or for app bundle
flutter build appbundle --release
```

### iOS

```bash
flutter build ios --release
```

## Testing

```bash
# Run all tests
flutter test

# Run with coverage
flutter test --coverage
```
