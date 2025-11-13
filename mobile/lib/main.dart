import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'utils/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/application_provider.dart';

void main() {
  runApp(const MortgageApp());
}

class MortgageApp extends StatelessWidget {
  const MortgageApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider()..checkAuthStatus(),
        ),
        ChangeNotifierProvider(
          create: (_) => ApplicationProvider(),
        ),
      ],
      child: MaterialApp(
        title: 'Mortgage App',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const SplashScreen(),
      ),
    );
  }
}

// Temporary splash screen - will be replaced with proper navigation
class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.home_work,
              size: 100,
              color: AppTheme.primaryColor,
            ),
            const SizedBox(height: 24),
            Text(
              'Mortgage App',
              style: AppTheme.headingLarge,
            ),
            const SizedBox(height: 16),
            Consumer<AuthProvider>(
              builder: (context, auth, _) {
                if (auth.state == AuthState.loading) {
                  return const CircularProgressIndicator();
                }
                if (auth.state == AuthState.authenticated) {
                  return Text(
                    'Welcome back, ${auth.user?.firstName ?? "User"}!',
                    style: AppTheme.bodyLarge,
                  );
                }
                return Text(
                  'Loading...',
                  style: AppTheme.bodyMedium,
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
