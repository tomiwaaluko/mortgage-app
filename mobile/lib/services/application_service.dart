import '../models/loan_application.dart';
import '../models/api_response.dart';
import '../utils/constants.dart';
import 'api_client.dart';

class ApplicationService {
  final ApiClient _apiClient;

  ApplicationService({ApiClient? apiClient})
      : _apiClient = apiClient ?? ApiClient();

  // Submit or update loan application
  Future<ApiResponse<String>> submitApplication({
    required LoanApplication application,
  }) async {
    try {
      final response = await _apiClient.post(
        AppConstants.submitApplicationEndpoint,
        data: application.toJson(),
        requiresAuth: true,
      );

      return ApiResponse<String>(
        ok: response['ok'] ?? false,
        data: response['applicationId'] as String?,
        error: response['error'] as String?,
        message: response['message'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<String>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Get user's loan application
  Future<ApiResponse<LoanApplication>> getUserApplication() async {
    try {
      final response = await _apiClient.get(
        AppConstants.getUserApplicationEndpoint,
        requiresAuth: true,
      );

      LoanApplication? application;
      if (response['application'] != null) {
        application = LoanApplication.fromJson(
          response['application'] as Map<String, dynamic>,
        );
      }

      return ApiResponse<LoanApplication>(
        ok: response['ok'] ?? false,
        data: application,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<LoanApplication>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Delete user's loan application
  Future<ApiResponse<void>> deleteApplication() async {
    try {
      final response = await _apiClient.delete(
        AppConstants.deleteApplicationEndpoint,
        requiresAuth: true,
      );

      return ApiResponse<void>(
        ok: response['ok'] ?? false,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<void>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Get all applications (Admin only)
  Future<ApiResponse<List<LoanApplication>>> getAllApplications() async {
    try {
      final response = await _apiClient.get(
        AppConstants.adminApplicationsEndpoint,
        requiresAuth: true,
      );

      List<LoanApplication> applications = [];
      if (response['applications'] != null) {
        applications = (response['applications'] as List)
            .map((app) => LoanApplication.fromJson(app as Map<String, dynamic>))
            .toList();
      }

      return ApiResponse<List<LoanApplication>>(
        ok: response['ok'] ?? false,
        data: applications,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<List<LoanApplication>>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Get single application by ID (Admin only)
  Future<ApiResponse<LoanApplication>> getApplicationById({
    required String applicationId,
  }) async {
    try {
      final response = await _apiClient.get(
        '${AppConstants.adminApplicationsEndpoint}/$applicationId',
        requiresAuth: true,
      );

      LoanApplication? application;
      if (response['application'] != null) {
        application = LoanApplication.fromJson(
          response['application'] as Map<String, dynamic>,
        );
      }

      return ApiResponse<LoanApplication>(
        ok: response['ok'] ?? false,
        data: application,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<LoanApplication>(
        ok: false,
        error: e.message,
      );
    }
  }

  // Update application approval status (Admin only)
  Future<ApiResponse<void>> updateApprovalStatus({
    required String applicationId,
    required String approval, // 'approved' or 'denied'
  }) async {
    try {
      final response = await _apiClient.patch(
        '${AppConstants.adminApplicationsEndpoint}/$applicationId/approval',
        data: {'approval': approval},
        requiresAuth: true,
      );

      return ApiResponse<void>(
        ok: response['ok'] ?? false,
        error: response['error'] as String?,
      );
    } on ApiException catch (e) {
      return ApiResponse<void>(
        ok: false,
        error: e.message,
      );
    }
  }
}
