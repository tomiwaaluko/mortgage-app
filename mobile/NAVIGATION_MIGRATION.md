# Navigation Migration Guide

## Pattern Replacements for GoRouter

### Basic Navigation Patterns

```dart
// OLD: Navigator.pushNamed(context, '/route')
// NEW: context.go('/route')

// OLD: Navigator.pushReplacementNamed(context, '/route')
// NEW: context.go('/route')

// OLD: Navigator.pushNamedAndRemoveUntil(context, '/route', (route) => false)
// NEW: context.go('/route')

// OLD: Navigator.pop(context)
// NEW: context.pop()
```

### Route Mapping

| Old Route                       | New Route                       |
| ------------------------------- | ------------------------------- |
| /sign-in                        | /signin                         |
| /sign-up                        | /signup                         |
| /forgot-password                | /forgot-password                |
| /reset-password                 | /reset-password                 |
| /verify-email                   | /verify-email                   |
| /dashboard                      | /dashboard                      |
| /profile                        | /profile                        |
| /application/personal-info      | /application/personal-info      |
| /application/employment         | /application/employment         |
| /application/assets-liabilities | /application/assets-liabilities |
| /application/property-info      | /application/property-info      |
| /application/real-estate        | /application/real-estate        |
| /application/declarations       | /application/declarations       |
| /application/review             | /application/review             |
| /admin/dashboard                | /admin/dashboard                |
| /admin/application-detail       | /admin/application/:id          |

## Files Requiring Updates

- [x] lib/screens/auth/sign_in_screen.dart
- [ ] lib/screens/auth/sign_up_screen.dart
- [ ] lib/screens/auth/forgot_password_screen.dart
- [ ] lib/screens/auth/reset_password_screen.dart
- [ ] lib/screens/auth/verify_email_screen.dart
- [ ] lib/screens/home_screen.dart
- [ ] lib/screens/dashboard_screen.dart
- [ ] lib/screens/profile_screen.dart
- [ ] lib/screens/application/\*.dart (7 files)
- [ ] lib/screens/admin/\*.dart (2 files)
