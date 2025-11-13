import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'utils/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/application_provider.dart';
import 'routes/app_router.dart';

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
      child: Builder(
        builder: (context) {
          final authProvider =
              Provider.of<AuthProvider>(context, listen: false);
          final appRouter = AppRouter(authProvider);

          return MaterialApp.router(
            title: 'Mortgage App',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            routerConfig: appRouter.router,
          );
        },
      ),
    );
  }
}
