/// Route names for type-safe navigation
class RouteNames {
  // Public routes
  static const String home = 'home';
  static const String signIn = 'signin';
  static const String signUp = 'signup';
  static const String forgotPassword = 'forgot-password';
  static const String resetPassword = 'reset-password';
  static const String verifyEmail = 'verify-email';

  // Protected user routes
  static const String dashboard = 'dashboard';
  static const String profile = 'profile';

  // Application form routes
  static const String personalInfo = 'personal-info';
  static const String employment = 'employment';
  static const String assetsLiabilities = 'assets-liabilities';
  static const String propertyInfo = 'property-info';
  static const String realEstate = 'real-estate';
  static const String declarations = 'declarations';
  static const String review = 'review';

  // Admin routes
  static const String adminDashboard = 'admin-dashboard';
  static const String adminApplicationDetail = 'admin-application-detail';
}

/// Route paths for navigation
class RoutePaths {
  // Public routes
  static const String home = '/';
  static const String signIn = '/signin';
  static const String signUp = '/signup';
  static const String forgotPassword = '/forgot-password';
  static const String resetPassword = '/reset-password';
  static const String verifyEmail = '/verify-email';

  // Protected user routes
  static const String dashboard = '/dashboard';
  static const String profile = '/profile';

  // Application form routes
  static const String personalInfo = '/application/personal-info';
  static const String employment = '/application/employment';
  static const String assetsLiabilities = '/application/assets-liabilities';
  static const String propertyInfo = '/application/property-info';
  static const String realEstate = '/application/real-estate';
  static const String declarations = '/application/declarations';
  static const String review = '/application/review';

  // Admin routes
  static const String adminDashboard = '/admin/dashboard';
  static String adminApplicationDetail(String id) => '/admin/application/$id';
}
