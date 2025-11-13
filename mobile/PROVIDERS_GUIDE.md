# State Management with Provider

This document explains how to use the state management providers in the Mortgage App.

## Overview

The app uses the `provider` package for state management with two main providers:

- **AuthProvider**: Manages authentication state and user data
- **ApplicationProvider**: Manages loan application data and operations

## AuthProvider

### Usage

```dart
// Access the provider
final authProvider = Provider.of<AuthProvider>(context);
// or
final authProvider = context.read<AuthProvider>(); // doesn't rebuild
final authProvider = context.watch<AuthProvider>(); // rebuilds on change

// Listen to specific values
Consumer<AuthProvider>(
  builder: (context, auth, child) {
    return Text('User: ${auth.user?.fullName}');
  },
)
```

### Available Properties

- `state: AuthState` - Current authentication state (initial, authenticated, unauthenticated, loading)
- `user: User?` - Current user data
- `error: String?` - Last error message
- `isLoading: bool` - Loading state
- `isAuthenticated: bool` - Whether user is logged in
- `isAdmin: bool` - Whether user has admin role

### Available Methods

```dart
// Check authentication status on app start
await authProvider.checkAuthStatus();

// Sign up
final success = await authProvider.signUp(
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',
);

// Sign in
final success = await authProvider.signIn(
  email: 'john@example.com',
  password: 'password123',
);

// Verify email
final success = await authProvider.verifyEmail(token: 'verification_token');

// Resend verification
final success = await authProvider.resendVerification(email: 'john@example.com');

// Request password reset
final success = await authProvider.requestPasswordReset(email: 'john@example.com');

// Reset password
final success = await authProvider.resetPassword(
  token: 'reset_token',
  password: 'newpassword123',
);

// Change password
final success = await authProvider.changePassword(
  currentPassword: 'oldpassword',
  newPassword: 'newpassword123',
);

// Update profile
final success = await authProvider.updateProfile(
  firstName: 'Jane',
  lastName: 'Doe',
);

// Refresh user data
await authProvider.refreshUser();

// Logout
await authProvider.logout();

// Clear error message
authProvider.clearError();
```

## ApplicationProvider

### Usage

```dart
// Access the provider
final appProvider = Provider.of<ApplicationProvider>(context);

// Listen to application data
Consumer<ApplicationProvider>(
  builder: (context, appProvider, child) {
    if (appProvider.isLoading) {
      return CircularProgressIndicator();
    }

    if (appProvider.hasApplication) {
      return Text('Application Status: ${appProvider.application?.status}');
    }

    return Text('No application found');
  },
)
```

### Available Properties

- `status: ApplicationStatus` - Current status (idle, loading, loaded, submitting, error)
- `application: LoanApplication?` - Current user's application
- `allApplications: List<LoanApplication>?` - All applications (admin only)
- `error: String?` - Last error message
- `isLoading: bool` - Loading state
- `hasApplication: bool` - Whether user has an application

### Available Methods

```dart
// Load user's application
await appProvider.loadUserApplication();

// Submit or update application
final success = await appProvider.submitApplication(application);

// Update application data locally (for form editing)
appProvider.updateApplicationData(updatedApplication);

// Update specific fields using copyWith
appProvider.updateField((app) => app.copyWith(
  borrowerFirstName: 'John',
  borrowerLastName: 'Doe',
));

// Delete application
final success = await appProvider.deleteApplication();

// Load all applications (Admin only)
await appProvider.loadAllApplications();

// Get application by ID (Admin only)
final app = await appProvider.getApplicationById('applicationId');

// Update approval status (Admin only)
final success = await appProvider.updateApprovalStatus(
  applicationId: 'applicationId',
  approval: 'approved', // or 'denied'
);

// Create a new draft application
appProvider.createDraftApplication(userId);

// Clear application data
appProvider.clearApplication();

// Clear all applications (Admin)
appProvider.clearAllApplications();

// Reset provider state
appProvider.reset();

// Clear error message
appProvider.clearError();
```

## Example: Authentication Flow

```dart
class SignInScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      body: Column(
        children: [
          if (authProvider.error != null)
            Text(authProvider.error!, style: TextStyle(color: Colors.red)),

          ElevatedButton(
            onPressed: authProvider.isLoading ? null : () async {
              final success = await authProvider.signIn(
                email: emailController.text,
                password: passwordController.text,
              );

              if (success) {
                Navigator.pushReplacementNamed(context, '/dashboard');
              }
            },
            child: authProvider.isLoading
                ? CircularProgressIndicator()
                : Text('Sign In'),
          ),
        ],
      ),
    );
  }
}
```

## Example: Application Management

```dart
class ApplicationFormScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final appProvider = context.watch<ApplicationProvider>();
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      body: Column(
        children: [
          TextField(
            initialValue: appProvider.application?.borrowerFirstName,
            onChanged: (value) {
              appProvider.updateField((app) => app.copyWith(
                borrowerFirstName: value,
              ));
            },
          ),

          ElevatedButton(
            onPressed: appProvider.isLoading ? null : () async {
              final application = appProvider.application?.copyWith(
                userId: authProvider.user!.id,
                status: 'submitted',
              );

              if (application != null) {
                final success = await appProvider.submitApplication(application);

                if (success) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Application submitted!')),
                  );
                }
              }
            },
            child: Text('Submit Application'),
          ),
        ],
      ),
    );
  }
}
```

## Best Practices

1. **Use `context.watch<T>()` when you need to rebuild on changes**
2. **Use `context.read<T>()` when you just need to call methods**
3. **Use `Consumer<T>` for fine-grained control over rebuilds**
4. **Always check `isLoading` before allowing user actions**
5. **Display error messages from `provider.error`**
6. **Clear errors when appropriate using `clearError()`**
7. **Use `MultiProvider` in main.dart to provide multiple providers**

## Error Handling

All provider methods return `bool` to indicate success/failure and set the `error` property on failure:

```dart
final success = await authProvider.signIn(email: email, password: password);

if (!success) {
  // Show error
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text(authProvider.error ?? 'Unknown error')),
  );
}
```
