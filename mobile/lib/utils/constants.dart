class AppConstants {
  // API Configuration
  static const String apiBaseUrl = 'http://localhost:3001/api';
  
  // Update this to your production URL when deploying
  // static const String apiBaseUrl = 'https://your-production-api.com/api';
  
  // API Endpoints
  static const String loginEndpoint = '/auth/login';
  static const String signupEndpoint = '/auth/signup';
  static const String logoutEndpoint = '/auth/logout';
  static const String verifyEmailEndpoint = '/auth/verify-email';
  static const String resendVerificationEndpoint = '/auth/resend-verification';
  static const String forgotPasswordEndpoint = '/auth/request-password-reset';
  static const String resetPasswordEndpoint = '/auth/reset-password';
  static const String changePasswordEndpoint = '/auth/change-password';
  static const String getMeEndpoint = '/auth/me';
  static const String updateProfileEndpoint = '/auth/me';
  
  static const String submitApplicationEndpoint = '/submit-application';
  static const String getUserApplicationEndpoint = '/get-user-application';
  static const String deleteApplicationEndpoint = '/delete-user-application';
  
  static const String adminApplicationsEndpoint = '/admin/applications';
  
  // Storage Keys
  static const String accessTokenKey = 'access_token';
  static const String userDataKey = 'user_data';
  
  // App Info
  static const String appName = 'Mortgage App';
  static const String appVersion = '1.0.0';
}
