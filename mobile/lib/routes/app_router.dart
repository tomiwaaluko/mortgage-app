import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../screens/auth/sign_in_screen.dart';
import '../screens/auth/sign_up_screen.dart';
import '../screens/auth/forgot_password_screen.dart';
import '../screens/auth/reset_password_screen.dart';
import '../screens/auth/verify_email_screen.dart';
import '../screens/home_screen.dart';
import '../screens/dashboard_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/application/personal_info_screen.dart';
import '../screens/application/employment_info_screen.dart';
import '../screens/application/assets_liabilities_screen.dart';
import '../screens/application/property_info_screen.dart';
import '../screens/application/real_estate_screen.dart';
import '../screens/application/declarations_screen.dart';
import '../screens/application/review_screen.dart';
import '../screens/admin/admin_dashboard_screen.dart';
import '../screens/admin/application_detail_screen.dart';

class AppRouter {
  final AuthProvider authProvider;

  AppRouter(this.authProvider);

  late final GoRouter router = GoRouter(
    initialLocation: '/',
    debugLogDiagnostics: true,
    refreshListenable: authProvider,
    redirect: _handleRedirect,
    routes: [
      // Public Routes
      GoRoute(
        path: '/',
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/signin',
        name: 'signin',
        builder: (context, state) => const SignInScreen(),
      ),
      GoRoute(
        path: '/signup',
        name: 'signup',
        builder: (context, state) => const SignUpScreen(),
      ),
      GoRoute(
        path: '/forgot-password',
        name: 'forgot-password',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
      GoRoute(
        path: '/reset-password',
        name: 'reset-password',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'] ?? '';
          return ResetPasswordScreen(token: token);
        },
      ),
      GoRoute(
        path: '/verify-email',
        name: 'verify-email',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'] ?? '';
          return VerifyEmailScreen(token: token);
        },
      ),

      // Protected User Routes
      GoRoute(
        path: '/dashboard',
        name: 'dashboard',
        builder: (context, state) => const DashboardScreen(),
      ),
      GoRoute(
        path: '/profile',
        name: 'profile',
        builder: (context, state) => const ProfileScreen(),
      ),

      // Application Form Routes
      GoRoute(
        path: '/application/personal-info',
        name: 'personal-info',
        builder: (context, state) => const PersonalInfoScreen(),
      ),
      GoRoute(
        path: '/application/employment',
        name: 'employment',
        builder: (context, state) => const EmploymentInfoScreen(),
      ),
      GoRoute(
        path: '/application/assets-liabilities',
        name: 'assets-liabilities',
        builder: (context, state) => const AssetsLiabilitiesScreen(),
      ),
      GoRoute(
        path: '/application/property-info',
        name: 'property-info',
        builder: (context, state) => const PropertyInfoScreen(),
      ),
      GoRoute(
        path: '/application/real-estate',
        name: 'real-estate',
        builder: (context, state) => const RealEstateScreen(),
      ),
      GoRoute(
        path: '/application/declarations',
        name: 'declarations',
        builder: (context, state) => const DeclarationsScreen(),
      ),
      GoRoute(
        path: '/application/review',
        name: 'review',
        builder: (context, state) => const ReviewScreen(),
      ),

      // Admin Routes
      GoRoute(
        path: '/admin/dashboard',
        name: 'admin-dashboard',
        builder: (context, state) => const AdminDashboardScreen(),
      ),
      GoRoute(
        path: '/admin/application/:id',
        name: 'admin-application-detail',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return ApplicationDetailScreen(applicationId: id);
        },
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            const Text(
              'Page Not Found',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text('Error: ${state.error}'),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.go('/'),
              child: const Text('Go Home'),
            ),
          ],
        ),
      ),
    ),
  );

  String? _handleRedirect(BuildContext context, GoRouterState state) {
    final authProvider = context.read<AuthProvider>();
    final isAuthenticated = authProvider.isAuthenticated;
    final isAdmin = authProvider.user?.isAdmin ?? false;
    final location = state.uri.path;

    // Public routes that don't require authentication
    final publicRoutes = [
      '/',
      '/signin',
      '/signup',
      '/forgot-password',
      '/reset-password',
      '/verify-email',
    ];

    // Admin-only routes
    final adminRoutes = [
      '/admin/dashboard',
      '/admin/application',
    ];

    // Protected user routes
    final protectedRoutes = [
      '/dashboard',
      '/profile',
      '/application',
    ];

    // Check if current route is public
    final isPublicRoute = publicRoutes
        .any((route) => location == route || location.startsWith(route));

    // Check if current route is admin-only
    final isAdminRoute = adminRoutes.any((route) => location.startsWith(route));

    // Check if current route is protected
    final isProtectedRoute =
        protectedRoutes.any((route) => location.startsWith(route));

    // If user is not authenticated and trying to access protected route
    if (!isAuthenticated && (isProtectedRoute || isAdminRoute)) {
      return '/signin';
    }

    // If user is authenticated and on auth pages, redirect to appropriate dashboard
    if (isAuthenticated && (location == '/signin' || location == '/signup')) {
      if (isAdmin) {
        return '/admin/dashboard';
      }
      return '/dashboard';
    }

    // If user is authenticated but not admin and trying to access admin route
    if (isAuthenticated && !isAdmin && isAdminRoute) {
      return '/dashboard';
    }

    // No redirect needed
    return null;
  }
}
