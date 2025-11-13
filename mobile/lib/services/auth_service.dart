import '../models/user.dart';
import '../models/api_response.dart';
import '../utils/constants.dart';
import 'api_client.dart';

class AuthService {
  final ApiClient _apiClient;

  AuthService({ApiClient? apiClient}) 
      : _apiClient = apiClient ?? ApiClient();

  // Sign up
  Future<ApiResponse<void>> signUp({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiClient.post(
        AppConstants.signupEndpoint,
        data: {
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          'password': password,
        },
      );

      return ApiResponse<void>(
        ok: response['ok'] ?? false,
        message: response['message'] as String?,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<void>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Sign in
  Future<ApiResponse<User>> signIn({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiClient.post(
        AppConstants.loginEndpoint,
        data: {
          'email': email,
          'password': password,
        },
      );

      // Store access token
      final accessToken = response['accessToken'] as String?;
      if (accessToken != null) {
        await _apiClient.setAccessToken(accessToken);
      }

      // Parse user data
      User? user;
      if (response['user'] != null) {
        user = User.fromJson(response['user'] as Map<String, dynamic>);
      }

      return ApiResponse<User>(
        ok: response['ok'] ?? false,
        data: user,
        error: response['error'] as String?,
        message: response['message'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<User>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Verify email
  Future<ApiResponse<void>> verifyEmail({required String token}) async {
    try {
      final response = await _apiClient.post(
        AppConstants.verifyEmailEndpoint,
        data: {'token': token},
      );

      return ApiResponse<void>(
        ok: response['ok'] ?? false,
        message: response['message'] as String?,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<void>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Resend verification email
  Future<ApiResponse<void>> resendVerification({required String email}) async {
    try {
      final response = await _apiClient.post(
        AppConstants.resendVerificationEndpoint,
        data: {'email': email},
      );

      return ApiResponse<void>(
        ok: response['ok'] ?? false,
        message: response['message'] as String?,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<void>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Request password reset
  Future<ApiResponse<void>> requestPasswordReset({
    required String email,
  }) async {
    try {
      final response = await _apiClient.post(
        AppConstants.forgotPasswordEndpoint,
        data: {'email': email},
      );

      return ApiResponse<void>(
        ok: response['ok'] ?? false,
        message: response['message'] as String?,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<void>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Reset password
  Future<ApiResponse<void>> resetPassword({
    required String token,
    required String password,
  }) async {
    try {
      final response = await _apiClient.post(
        AppConstants.resetPasswordEndpoint,
        data: {
          'token': token,
          'password': password,
        },
      );

      return ApiResponse<void>(
        ok: response['ok'] ?? false,
        message: response['message'] as String?,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<void>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Change password
  Future<ApiResponse<void>> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      final response = await _apiClient.post(
        AppConstants.changePasswordEndpoint,
        data: {
          'currentPassword': currentPassword,
          'newPassword': newPassword,
        },
        requiresAuth: true,
      );

      return ApiResponse<void>(
        ok: response['ok'] ?? false,
        message: response['message'] as String?,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<void>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Get current user
  Future<ApiResponse<User>> getCurrentUser() async {
    try {
      final response = await _apiClient.get(
        AppConstants.getMeEndpoint,
        requiresAuth: true,
      );

      User? user;
      if (response['user'] != null) {
        user = User.fromJson(response['user'] as Map<String, dynamic>);
      }

      return ApiResponse<User>(
        ok: response['ok'] ?? false,
        data: user,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<User>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Update profile
  Future<ApiResponse<User>> updateProfile({
    String? firstName,
    String? lastName,
  }) async {
    try {
      final data = <String, dynamic>{};
      if (firstName != null) data['firstName'] = firstName;
      if (lastName != null) data['lastName'] = lastName;

      final response = await _apiClient.patch(
        AppConstants.updateProfileEndpoint,
        data: data,
        requiresAuth: true,
      );

      User? user;
      if (response['user'] != null) {
        user = User.fromJson(response['user'] as Map<String, dynamic>);
      }

      return ApiResponse<User>(
        ok: response['ok'] ?? false,
        data: user,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<User>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Logout
  Future<ApiResponse<void>> logout() async {
    try {
      final response = await _apiClient.post(
        AppConstants.logoutEndpoint,
        data: {},
        requiresAuth: true,
      );

      // Clear stored token
      await _apiClient.clearStorage();

      return ApiResponse<void>(
        ok: response['ok'] ?? false,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      // Clear stored token even if request fails
      await _apiClient.clearStorage();
      
      return ApiResponse<void>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Check if user is authenticated
  Future<bool> isAuthenticated() async {
    final token = await _apiClient.getAccessToken();
    return token != null;
  }
}
